import { describe, expect, test } from 'bun:test';
import type { Task } from '../lib/types';
import { completeTaskAt } from '../stores/taskReducers';
import { MS_DAY } from '../utils/taskUtils';
import { buildIosSnapshot } from './iosWidgetSnapshot';
import { buildWidgetPayload } from './widgetPayload';

const today = new Date(2026, 9, 1).getTime();

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 't1',
    title: 'Laundry',
    cadence: { type: 'weekly' },
    createdAt: today - 60 * MS_DAY,
    completedDates: [],
    ...overrides,
  };
}

describe('buildIosSnapshot', () => {
  test('keeps a task completed today as upcoming at its next due date', () => {
    const laundry = completeTaskAt(makeTask({ nextDueDate: today }), today);
    const snapshot = buildIosSnapshot(buildWidgetPayload([laundry]), today);

    expect(snapshot.tasks).toHaveLength(1);
    expect(snapshot.tasks[0].status).toBe('upcoming');
    expect(snapshot.tasks[0].dueLabel).toBe('7d');
    expect(snapshot.overdueCount).toBe(0);
    expect(snapshot.todayCount).toBe(0);
  });

  test('sorts a task completed today among the upcoming tasks', () => {
    const tasks = [
      makeTask({
        id: 'bathroom',
        title: 'Clean bathroom',
        cadence: { type: 'monthly' },
        nextDueDate: today + 28 * MS_DAY,
      }),
      completeTaskAt(makeTask({ id: 'laundry', nextDueDate: today }), today),
      makeTask({ id: 'yoga', title: 'Yoga', nextDueDate: today + 6 * MS_DAY }),
    ];
    const snapshot = buildIosSnapshot(buildWidgetPayload(tasks), today);

    expect(snapshot.tasks.map(t => [t.id, t.dueLabel])).toEqual([
      ['yoga', '6d'],
      ['laundry', '7d'],
      ['bathroom', '28d'],
    ]);
  });

  test('counts overdue and due-today tasks as of the given day', () => {
    const tasks = [
      makeTask({ id: 'late', nextDueDate: today - 2 * MS_DAY }),
      makeTask({ id: 'due', nextDueDate: today + MS_DAY }),
    ];
    const snapshot = buildIosSnapshot(
      buildWidgetPayload(tasks),
      today + MS_DAY
    );

    expect(snapshot.tasks.map(t => [t.id, t.status, t.dueLabel])).toEqual([
      ['late', 'overdue', '3d late'],
      ['due', 'today', 'TODAY'],
    ]);
    expect(snapshot.overdueCount).toBe(1);
    expect(snapshot.todayCount).toBe(1);
  });
});
