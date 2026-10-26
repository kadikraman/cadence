import { describe, expect, test } from 'bun:test';
import { Task, Todo } from '../types';
import {
  SYNC_SCHEMA,
  SyncData,
  isEqual,
  mergeSyncData,
  parseSyncDoc,
  planSync,
  toSyncDoc,
} from './syncDoc';

const DAY = 86400000;

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 't1',
    title: 'Water plants',
    cadence: { type: 'weekly' },
    createdAt: 1000,
    completedDates: [],
    ...overrides,
  };
}

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return { id: 'd1', title: 'Buy milk', createdAt: 1000, ...overrides };
}

function data(tasks: Task[], todos: Todo[] = []): SyncData {
  return { tasks, todos };
}

describe('isEqual', () => {
  test('ignores key order', () => {
    expect(isEqual({ a: 1, b: [1, 2] }, { b: [1, 2], a: 1 })).toBe(true);
  });

  test('treats a missing key as undefined', () => {
    expect(isEqual({ a: 1 }, { a: 1, b: undefined })).toBe(true);
  });

  test('detects array order changes', () => {
    expect(isEqual([1, 2], [2, 1])).toBe(false);
  });
});

describe('mergeSyncData', () => {
  test('takes a local-only edit', () => {
    const base = data([makeTask()]);
    const local = data([makeTask({ title: 'Water ferns' })]);
    const merged = mergeSyncData(base, local, base);
    expect(merged.tasks[0].title).toBe('Water ferns');
  });

  test('takes a remote-only edit', () => {
    const base = data([makeTask()]);
    const remote = data([makeTask({ color: 'blue' })]);
    const merged = mergeSyncData(base, base, remote);
    expect(merged.tasks[0].color).toBe('blue');
  });

  test('keeps edits to different fields on both sides', () => {
    const base = data([makeTask()]);
    const local = data([makeTask({ title: 'Water ferns' })]);
    const remote = data([makeTask({ details: 'Kitchen only' })]);
    const merged = mergeSyncData(base, local, remote);
    expect(merged.tasks[0].title).toBe('Water ferns');
    expect(merged.tasks[0].details).toBe('Kitchen only');
  });

  test('prefers local on a same-field conflict', () => {
    const base = data([makeTask()]);
    const local = data([makeTask({ title: 'Local' })]);
    const remote = data([makeTask({ title: 'Remote' })]);
    expect(mergeSyncData(base, local, remote).tasks[0].title).toBe('Local');
  });

  test('a field cleared on one side stays cleared', () => {
    const base = data([makeTask({ details: 'Old' })]);
    const local = data([makeTask()]);
    const merged = mergeSyncData(base, local, base);
    expect(merged.tasks[0].details).toBeUndefined();
    expect('details' in merged.tasks[0]).toBe(false);
  });

  test('keeps completions made on both devices', () => {
    const base = data([makeTask()]);
    const local = data([
      makeTask({
        completedDates: [2 * DAY],
        lastCompletedAt: 2 * DAY,
        nextDueDate: 9 * DAY,
      }),
    ]);
    const remote = data([
      makeTask({
        completedDates: [3 * DAY],
        lastCompletedAt: 3 * DAY,
        nextDueDate: 10 * DAY,
      }),
    ]);
    const task = mergeSyncData(base, local, remote).tasks[0];
    expect(task.completedDates).toEqual([3 * DAY, 2 * DAY]);
    expect(task.lastCompletedAt).toBe(3 * DAY);
    expect(task.nextDueDate).toBe(10 * DAY);
  });

  test('an uncompletion on one side survives a completion on the other', () => {
    const base = data([makeTask({ completedDates: [2 * DAY, 1 * DAY] })]);
    const local = data([makeTask({ completedDates: [1 * DAY] })]);
    const remote = data([
      makeTask({ completedDates: [5 * DAY, 2 * DAY, 1 * DAY] }),
    ]);
    const task = mergeSyncData(base, local, remote).tasks[0];
    expect(task.completedDates).toEqual([5 * DAY, 1 * DAY]);
    expect(task.lastCompletedAt).toBe(5 * DAY);
  });

  test('a local delete removes the task when remote did not change it', () => {
    const base = data([makeTask()]);
    expect(mergeSyncData(base, data([]), base).tasks).toEqual([]);
  });

  test('a remote delete removes the task when local did not change it', () => {
    const base = data([makeTask()]);
    expect(mergeSyncData(base, base, data([])).tasks).toEqual([]);
  });

  test('an edit wins over a delete on the other side', () => {
    const base = data([makeTask()]);
    const remote = data([makeTask({ title: 'Edited' })]);
    const merged = mergeSyncData(base, data([]), remote);
    expect(merged.tasks.map(t => t.title)).toEqual(['Edited']);
  });

  test('adds records new on either side', () => {
    const base = data([]);
    const local = data([makeTask({ id: 'a' })]);
    const remote = data([makeTask({ id: 'b' })]);
    const ids = mergeSyncData(base, local, remote).tasks.map(t => t.id);
    expect(ids).toEqual(['a', 'b']);
  });

  test('without a base, unions records and completions', () => {
    const local = data([
      makeTask({ id: 'a', title: 'Local', completedDates: [1 * DAY] }),
    ]);
    const remote = data([
      makeTask({ id: 'a', title: 'Remote', completedDates: [2 * DAY] }),
      makeTask({ id: 'b' }),
    ]);
    const merged = mergeSyncData(null, local, remote);
    expect(merged.tasks).toHaveLength(2);
    expect(merged.tasks[0].title).toBe('Local');
    expect(merged.tasks[0].completedDates).toEqual([2 * DAY, 1 * DAY]);
  });

  test('without a base, nothing is deleted', () => {
    const merged = mergeSyncData(null, data([]), data([makeTask()]));
    expect(merged.tasks).toHaveLength(1);
  });

  test('merges todo fields', () => {
    const base = data([], [makeTodo()]);
    const local = data([], [makeTodo({ completedAt: 5000 })]);
    const remote = data([], [makeTodo({ title: 'Buy oat milk' })]);
    expect(mergeSyncData(base, local, remote).todos[0]).toEqual({
      id: 'd1',
      title: 'Buy oat milk',
      createdAt: 1000,
      completedAt: 5000,
    });
  });

  test('an untick on one side survives an edit on the other', () => {
    const base = data([], [makeTodo({ completedAt: 5000 })]);
    const local = data([], [makeTodo()]);
    const remote = data(
      [],
      [makeTodo({ title: 'Buy oat milk', completedAt: 5000 })]
    );
    const todo = mergeSyncData(base, local, remote).todos[0];
    expect(todo.completedAt).toBeUndefined();
    expect(todo.title).toBe('Buy oat milk');
  });
});

describe('planSync', () => {
  test('writes nothing on a first sync with no data anywhere', () => {
    const plan = planSync(null, data([]), null);
    expect(plan.writeLocal).toBe(false);
    expect(plan.writeRemote).toBe(false);
  });

  test('saves no base until the cloud doc is read or written', () => {
    expect(planSync(null, data([]), null).saveBase).toBe(false);
    expect(planSync(null, data([makeTask()]), null).saveBase).toBe(true);
    expect(planSync(null, data([]), data([])).saveBase).toBe(true);
  });

  test('uploads local data when the cloud has no doc', () => {
    const local = data([makeTask()]);
    const plan = planSync(null, local, null);
    expect(plan.merged).toBe(local);
    expect(plan.writeRemote).toBe(true);
    expect(plan.writeLocal).toBe(false);
  });

  test('never deletes local data because the cloud doc is gone', () => {
    const local = data([makeTask()]);
    const plan = planSync(local, local, null);
    expect(plan.merged.tasks).toHaveLength(1);
    expect(plan.writeLocal).toBe(false);
    expect(plan.writeRemote).toBe(true);
  });

  test('pulls a remote change without writing remote', () => {
    const base = data([makeTask()]);
    const remote = data([makeTask({ title: 'New' })]);
    const plan = planSync(base, base, remote);
    expect(plan.writeLocal).toBe(true);
    expect(plan.writeRemote).toBe(false);
  });

  test('pushes a local change without writing local', () => {
    const base = data([makeTask()]);
    const local = data([makeTask({ title: 'New' })]);
    const plan = planSync(base, local, base);
    expect(plan.writeLocal).toBe(false);
    expect(plan.writeRemote).toBe(true);
  });

  test('a device whose write was lost merges it back on the next sync', () => {
    const base = data([makeTask()]);
    const mine = data([makeTask({ title: 'Mine' })]);
    const theirs = data([makeTask({ details: 'Theirs' })]);
    const plan = planSync(base, mine, theirs);
    expect(plan.merged.tasks[0].title).toBe('Mine');
    expect(plan.merged.tasks[0].details).toBe('Theirs');
    expect(plan.writeRemote).toBe(true);
  });
});

describe('parseSyncDoc', () => {
  test('round-trips a doc', () => {
    const doc = toSyncDoc(data([makeTask()], [makeTodo()]), 42);
    const parsed = parseSyncDoc(JSON.stringify(doc));
    expect(parsed).toEqual({ type: 'ok', doc });
  });

  test('refuses an unknown schema', () => {
    const text = JSON.stringify({ schema: 'cadence-sync-v2', tasks: [] });
    expect(parseSyncDoc(text)).toEqual({ type: 'unsupported' });
  });

  test('rejects malformed JSON and records', () => {
    expect(parseSyncDoc('{')).toEqual({ type: 'invalid' });
    const bad = JSON.stringify({
      schema: SYNC_SCHEMA,
      tasks: [{ id: 1 }],
      todos: [],
    });
    expect(parseSyncDoc(bad)).toEqual({ type: 'invalid' });
  });
});
