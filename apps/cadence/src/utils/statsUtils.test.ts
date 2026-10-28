import { describe, expect, test } from 'bun:test';
import { Task } from '../lib/types';
import {
  cadenceDays,
  computeCurrentCycle,
  computeHistory,
  computeOnTimePct,
  computeRangeStats,
  computeTaskStats,
  iterCompletionDeltas,
  stripSquareIndex,
  stripSquares,
  stripUnit,
} from './statsUtils';
import { MS_DAY } from './taskUtils';

function midnight(offsetDays = 0): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime() + offsetDays * MS_DAY;
}

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 't1',
    title: 'Water plants',
    cadence: { type: 'daily' },
    createdAt: midnight(-30),
    completedDates: [],
    ...overrides,
  };
}

describe('cadenceDays', () => {
  test('returns 1 for daily', () => {
    expect(cadenceDays({ type: 'daily' })).toBe(1);
  });

  test('returns 7 for weekly', () => {
    expect(cadenceDays({ type: 'weekly' })).toBe(7);
  });

  test('returns 30 for monthly', () => {
    expect(cadenceDays({ type: 'monthly' })).toBe(30);
  });

  test('multiplies for custom intervals', () => {
    expect(cadenceDays({ type: 'custom', value: 3, unit: 'days' })).toBe(3);
    expect(cadenceDays({ type: 'custom', value: 2, unit: 'weeks' })).toBe(14);
    expect(cadenceDays({ type: 'custom', value: 2, unit: 'months' })).toBe(60);
  });
});

describe('iterCompletionDeltas', () => {
  test('yields nothing for fewer than two completions', () => {
    const empty = [...iterCompletionDeltas(makeTask({ completedDates: [] }))];
    expect(empty).toEqual([]);
    const single = [
      ...iterCompletionDeltas(makeTask({ completedDates: [midnight(-5)] })),
    ];
    expect(single).toEqual([]);
  });

  test('classifies on-time, late, and early for a daily cadence', () => {
    const task = makeTask({
      cadence: { type: 'daily' },
      completedDates: [
        midnight(-10),
        midnight(-9), // 1 day, on time
        midnight(-7), // 2 days, late
        midnight(-6), // 1 day, on time
      ],
    });
    const deltas = [...iterCompletionDeltas(task)];
    expect(deltas).toHaveLength(3);
    expect(deltas[0].deltaDays).toBe(1);
    expect(deltas[0].isLate).toBe(false);
    expect(deltas[0].status).toBe('onTime');
    expect(deltas[1].deltaDays).toBe(2);
    expect(deltas[1].isLate).toBe(true);
    expect(deltas[1].status).toBe('late');
    expect(deltas[2].isLate).toBe(false);
  });

  test('flags an early completion when delta is well under cadence', () => {
    const task = makeTask({
      cadence: { type: 'weekly' },
      completedDates: [midnight(-10), midnight(-7)], // 3 days vs 7
    });
    const [d] = [...iterCompletionDeltas(task)];
    expect(d.status).toBe('early');
    expect(d.isLate).toBe(false);
  });

  test('skips pairs whose closing completion falls before sinceTs', () => {
    const task = makeTask({
      cadence: { type: 'daily' },
      completedDates: [midnight(-5), midnight(-4), midnight(-1), midnight()],
    });
    const all = [...iterCompletionDeltas(task)];
    expect(all).toHaveLength(3);
    const recent = [...iterCompletionDeltas(task, midnight(-2))];
    expect(recent).toHaveLength(2);
    expect(recent[0].completedAt).toBe(midnight(-1));
    expect(recent[0].previousAt).toBe(midnight(-4));
  });

  test('sorts unsorted completedDates before walking', () => {
    const task = makeTask({
      cadence: { type: 'daily' },
      completedDates: [midnight(-1), midnight(-3), midnight(-2)],
    });
    const deltas = [...iterCompletionDeltas(task)];
    expect(deltas).toHaveLength(2);
    expect(deltas[0].completedAt).toBe(midnight(-2));
    expect(deltas[1].completedAt).toBe(midnight(-1));
  });
});

describe('computeOnTimePct', () => {
  test('returns 100 when there are no deltas', () => {
    const tasks = [makeTask({ completedDates: [] })];
    expect(computeOnTimePct(tasks).pct).toBe(100);
  });

  test('counts on-time and late across the full history', () => {
    const tasks = [
      makeTask({
        cadence: { type: 'daily' },
        completedDates: [
          midnight(-4),
          midnight(-3), // 1d on time
          midnight(-1), // 2d late
          midnight(), // 1d on time
        ],
      }),
    ];
    const r = computeOnTimePct(tasks);
    expect(r.onTime).toBe(2);
    expect(r.late).toBe(1);
    expect(r.pct).toBe(67);
  });

  test('respects rangeDays cutoff', () => {
    const tasks = [
      makeTask({
        cadence: { type: 'daily' },
        completedDates: [
          midnight(-30),
          midnight(-20),
          midnight(-1),
          midnight(),
        ],
      }),
    ];
    const r = computeOnTimePct(tasks, 5);
    expect(r.onTime + r.late).toBe(2);
  });
});

describe('computeTaskStats', () => {
  test('counts streak as the trailing run of non-late deltas', () => {
    const task = makeTask({
      cadence: { type: 'daily' },
      completedDates: [
        midnight(-6),
        midnight(-3), // 3d late
        midnight(-2), // 1d on time
        midnight(-1), // 1d on time
        midnight(), // 1d on time
      ],
    });
    const stats = computeTaskStats(task);
    expect(stats.streak).toBe(3);
    expect(stats.late).toBe(1);
    expect(stats.onTime).toBe(3);
  });

  test('total counts completions, not deltas', () => {
    const task = makeTask({
      cadence: { type: 'daily' },
      completedDates: [midnight(-2), midnight(-1), midnight()],
    });
    expect(computeTaskStats(task).total).toBe(3);
  });
});

describe('computeRangeStats', () => {
  test('counts completions in range and grades all but the first', () => {
    const task = makeTask({
      cadence: { type: 'daily' },
      completedDates: [midnight(-6), midnight(-5), midnight(-2), midnight(-1)],
    });
    const stats = computeRangeStats([task], midnight(-6), midnight(1));
    expect(stats.completions).toBe(4);
    expect(stats.onTime).toBe(2);
    expect(stats.late).toBe(1);
    expect(stats.pct).toBe(67);
    expect(stats.graded).toEqual(['onTime', 'late', 'onTime']);
    const [lane] = stats.lanes;
    expect(lane.completions[0].status).toBe('first');
    expect(lane.lateSpans).toEqual([
      { dueAt: midnight(-4), completedAt: midnight(-2) },
    ]);
    expect(lane.pct).toBe(67);
  });

  test('ignores completions outside the range', () => {
    const task = makeTask({
      cadence: { type: 'daily' },
      completedDates: [midnight(-20), midnight(-19), midnight(-1)],
    });
    const stats = computeRangeStats([task], midnight(-6), midnight(1));
    expect(stats.completions).toBe(1);
    expect(stats.graded).toEqual(['late']);
  });

  test('sorts overdue lanes first, then by lowest on-time rate', () => {
    const overdue = makeTask({
      id: 'overdue',
      cadence: { type: 'weekly' },
      completedDates: [midnight(-10)],
      lastCompletedAt: midnight(-10),
      nextDueDate: midnight(-3),
    });
    const flaky = makeTask({
      id: 'flaky',
      completedDates: [midnight(-4), midnight(-1)],
      lastCompletedAt: midnight(-1),
      nextDueDate: midnight(),
    });
    const steady = makeTask({
      id: 'steady',
      completedDates: [midnight(-2), midnight(-1)],
      lastCompletedAt: midnight(-1),
      nextDueDate: midnight(),
    });
    const stats = computeRangeStats(
      [steady, flaky, overdue],
      midnight(-29),
      midnight(1),
      midnight()
    );
    expect(stats.lanes.map(l => l.task.id)).toEqual([
      'overdue',
      'flaky',
      'steady',
    ]);
    expect(stats.lanes[0].overdueDays).toBe(3);
    expect(stats.lanes[0].pct).toBeNull();
  });

  test('leaves archived tasks out of the lanes but in the totals', () => {
    const task = makeTask({
      archived: true,
      completedDates: [midnight(-2), midnight(-1)],
    });
    const stats = computeRangeStats([task], midnight(-6), midnight(1));
    expect(stats.completions).toBe(2);
    expect(stats.lanes).toEqual([]);
  });
});

describe('computeCurrentCycle', () => {
  test('measures the cycle that ends at the next due date', () => {
    const task = makeTask({
      cadence: { type: 'weekly' },
      completedDates: [midnight(-2)],
      lastCompletedAt: midnight(-2),
      nextDueDate: midnight(5),
    });
    const cycle = computeCurrentCycle(task, midnight());
    expect(cycle.start).toBe(midnight(-2));
    expect(cycle.days).toBe(7);
    expect(cycle.elapsed).toBe(2);
    expect(cycle.dueIn).toBe(5);
  });

  test('reports a negative dueIn when overdue', () => {
    const task = makeTask({
      cadence: { type: 'weekly' },
      nextDueDate: midnight(-3),
    });
    const cycle = computeCurrentCycle(task, midnight());
    expect(cycle.elapsed).toBe(10);
    expect(cycle.dueIn).toBe(-3);
  });
});

describe('stripUnit', () => {
  test('uses days up to a month, weeks up to 31 weeks, then months', () => {
    expect(stripUnit(1).label).toBe('day');
    expect(stripUnit(31).label).toBe('day');
    expect(stripUnit(32).label).toBe('week');
    expect(stripUnit(217).label).toBe('week');
    expect(stripUnit(218).label).toBe('month');
    expect(
      stripUnit(cadenceDays({ type: 'custom', value: 12, unit: 'months' })).days
    ).toBe(30);
  });
});

describe('stripSquares', () => {
  test('fits a yearly cycle in 12 month squares', () => {
    expect(stripSquares(365, 30)).toBe(12);
    expect(stripSquares(360, 30)).toBe(12);
  });

  test('keeps one square per day for short cycles', () => {
    expect(stripSquares(7, 1)).toBe(7);
  });
});

describe('stripSquareIndex', () => {
  test('matches the day count when each square is one day', () => {
    expect(stripSquareIndex(0, 7, 1)).toBe(0);
    expect(stripSquareIndex(3, 7, 1)).toBe(3);
    expect(stripSquareIndex(7, 7, 1)).toBe(7);
    expect(stripSquareIndex(10, 7, 1)).toBe(10);
  });

  test('spreads a yearly cycle over its squares', () => {
    expect(stripSquareIndex(1, 365, 30)).toBe(1);
    expect(stripSquareIndex(58, 365, 30)).toBe(2);
    expect(stripSquareIndex(365, 365, 30)).toBe(12);
  });

  test('adds one square per unit after the cycle ends', () => {
    expect(stripSquareIndex(366, 365, 30)).toBe(13);
    expect(stripSquareIndex(396, 365, 30)).toBe(14);
  });
});

describe('computeHistory', () => {
  test('lists completions newest first with whole-day gaps', () => {
    const task = makeTask({
      cadence: { type: 'weekly' },
      completedDates: [midnight(-16), midnight(-7), midnight()],
    });
    expect(computeHistory(task)).toEqual([
      { completedAt: midnight(), deltaDays: 7, status: 'onTime' },
      { completedAt: midnight(-7), deltaDays: 9, status: 'late' },
      { completedAt: midnight(-16), deltaDays: null, status: 'first' },
    ]);
  });

  test('returns nothing for a task never completed', () => {
    expect(computeHistory(makeTask())).toEqual([]);
  });
});
