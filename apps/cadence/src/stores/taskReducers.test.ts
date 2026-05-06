import { describe, expect, test } from 'bun:test';
import { Task } from '../lib/types';
import { MS_DAY } from '../utils/taskUtils';
import {
  editCompletionDate,
  markCompleted,
  mergeTasks,
  removeTask,
  replaceAll,
  unmarkCompleted,
  upsertTask,
} from './taskReducers';

function midnight(offsetDays = 0): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime() + offsetDays * MS_DAY;
}

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 't1',
    title: 'Water plants',
    cadence: { type: 'weekly' },
    createdAt: midnight(-30),
    completedDates: [],
    color: 'green',
    glyph: 'plant',
    ...overrides,
  };
}

describe('upsertTask', () => {
  test('adds a new task when id is not found', () => {
    const existing = [makeTask({ id: 'a' })];
    const next = upsertTask(
      existing,
      makeTask({ id: 'b', title: 'Pay bills' })
    );
    expect(next).toHaveLength(2);
    expect(next[1].id).toBe('b');
  });

  test('replaces an existing task in place', () => {
    const existing = [
      makeTask({ id: 'a' }),
      makeTask({ id: 'b', title: 'old title' }),
    ];
    const next = upsertTask(
      existing,
      makeTask({ id: 'b', title: 'new title' })
    );
    expect(next).toHaveLength(2);
    expect(next[1].title).toBe('new title');
    expect(next[0]).toBe(existing[0]);
  });

  test('does not mutate the original array', () => {
    const existing = [makeTask({ id: 'a' })];
    upsertTask(existing, makeTask({ id: 'b' }));
    expect(existing).toHaveLength(1);
  });
});

describe('removeTask', () => {
  test('removes the matching task', () => {
    const existing = [makeTask({ id: 'a' }), makeTask({ id: 'b' })];
    expect(removeTask(existing, 'a')).toEqual([existing[1]]);
  });

  test('returns an equivalent list when id is unknown', () => {
    const existing = [makeTask({ id: 'a' })];
    expect(removeTask(existing, 'missing')).toEqual(existing);
  });
});

describe('markCompleted', () => {
  test('appends the completion date and sets lastCompletedAt', () => {
    const task = makeTask({ completedDates: [] });
    const ts = midnight();
    const [next] = markCompleted([task], task.id, ts);
    expect(next.completedDates).toEqual([ts]);
    expect(next.lastCompletedAt).toBe(ts);
  });

  test('keeps completedDates sorted descending', () => {
    const earlier = midnight(-5);
    const later = midnight();
    const task = makeTask({ completedDates: [earlier] });
    const [next] = markCompleted([task], task.id, later);
    expect(next.completedDates).toEqual([later, earlier]);
    expect(next.lastCompletedAt).toBe(later);
  });

  test('recomputes nextDueDate from the latest completion', () => {
    const task = makeTask({ cadence: { type: 'daily' } });
    const ts = midnight();
    const [next] = markCompleted([task], task.id, ts);
    expect(next.nextDueDate).toBe(midnight(1));
  });

  test('is a no-op when the task id is unknown', () => {
    const existing = [makeTask({ id: 'a' })];
    const next = markCompleted(existing, 'missing', midnight());
    expect(next).toEqual(existing);
  });

  test('normalizes the completion timestamp to midnight', () => {
    const task = makeTask({ completedDates: [] });
    const today = midnight();
    const middayTs = today + 12 * 60 * 60 * 1000;
    const [next] = markCompleted([task], task.id, middayTs);
    expect(next.completedDates).toEqual([today]);
    expect(next.lastCompletedAt).toBe(today);
  });

  test('dedupes when the same day is marked twice', () => {
    const today = midnight();
    const task = makeTask({ completedDates: [today] });
    const [next] = markCompleted([task], task.id, today);
    expect(next.completedDates).toEqual([today]);
  });
});

describe('unmarkCompleted', () => {
  test('removes the matching completion date', () => {
    const a = midnight(-2);
    const b = midnight(-1);
    const task = makeTask({ completedDates: [b, a] });
    const [next] = unmarkCompleted([task], task.id, a);
    expect(next.completedDates).toEqual([b]);
    expect(next.lastCompletedAt).toBe(b);
  });

  test('clears lastCompletedAt when all dates are removed', () => {
    const only = midnight(-1);
    const task = makeTask({ completedDates: [only], lastCompletedAt: only });
    const [next] = unmarkCompleted([task], task.id, only);
    expect(next.completedDates).toEqual([]);
    expect(next.lastCompletedAt).toBeUndefined();
  });

  test('ignores an unknown date', () => {
    const a = midnight(-1);
    const task = makeTask({ completedDates: [a], lastCompletedAt: a });
    const [next] = unmarkCompleted([task], task.id, midnight(-99));
    expect(next.completedDates).toEqual([a]);
  });

  test('restores nextDueDate to the unmarked day when no completions remain', () => {
    const todayTs = midnight();
    const completionTs = Date.now();
    const task = makeTask({
      cadence: { type: 'weekly' },
      completedDates: [completionTs],
      lastCompletedAt: completionTs,
      nextDueDate: todayTs + 7 * MS_DAY,
    });
    const [next] = unmarkCompleted([task], task.id, completionTs);
    expect(next.nextDueDate).toBe(todayTs);
    expect(next.lastCompletedAt).toBeUndefined();
  });
});

describe('editCompletionDate', () => {
  test('replaces the old timestamp with the new one', () => {
    const a = midnight(-2);
    const b = midnight(-1);
    const newTs = midnight();
    const task = makeTask({ completedDates: [b, a], lastCompletedAt: b });
    const [next] = editCompletionDate([task], task.id, a, newTs);
    expect(next.completedDates).toEqual([newTs, b]);
    expect(next.lastCompletedAt).toBe(newTs);
  });

  test('recomputes nextDueDate after the edit', () => {
    const task = makeTask({
      cadence: { type: 'daily' },
      completedDates: [midnight(-5)],
      lastCompletedAt: midnight(-5),
    });
    const [next] = editCompletionDate(
      [task],
      task.id,
      midnight(-5),
      midnight(-1)
    );
    expect(next.nextDueDate).toBe(midnight());
  });

  test('normalizes the new timestamp to midnight', () => {
    const a = midnight(-2);
    const middayToday = midnight() + 12 * 60 * 60 * 1000;
    const task = makeTask({ completedDates: [a], lastCompletedAt: a });
    const [next] = editCompletionDate([task], task.id, a, middayToday);
    expect(next.completedDates).toEqual([midnight()]);
    expect(next.lastCompletedAt).toBe(midnight());
  });
});

describe('replaceAll', () => {
  test('normalizes color and glyph defaults', () => {
    const raw = makeTask({ color: undefined, glyph: undefined });
    const [result] = replaceAll([raw]);
    expect(result.color).toBe('slate');
    expect(result.glyph).toBe('entry');
  });
});

describe('mergeTasks', () => {
  test('adds only tasks whose ids are not already present', () => {
    const existing = [makeTask({ id: 'a' })];
    const incoming = [
      makeTask({ id: 'a', title: 'duplicate' }),
      makeTask({ id: 'b', title: 'new' }),
    ];
    const { merged, imported, skipped } = mergeTasks(existing, incoming);
    expect(imported).toBe(1);
    expect(skipped).toBe(1);
    expect(merged).toHaveLength(2);
    expect(merged[0].title).toBe('Water plants');
    expect(merged[1].id).toBe('b');
  });
});
