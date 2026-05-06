import { describe, expect, test } from 'bun:test';
import { Task } from '../lib/types';
import {
  cadenceDays,
  computeAvgLateDrift,
  computeMostReliable,
  computeOnTimePct,
  computeTaskStats,
  iterCompletionDeltas,
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

describe('computeAvgLateDrift', () => {
  test('averages drift across only the late completions', () => {
    const tasks = [
      makeTask({
        cadence: { type: 'daily' },
        completedDates: [
          midnight(-10),
          midnight(-9), // 1d on time
          midnight(-6), // 3d late, drift = 2
          midnight(-2), // 4d late, drift = 3
        ],
      }),
    ];
    const avg = computeAvgLateDrift(tasks, 30);
    expect(avg).toBeCloseTo(2.5);
  });

  test('returns 0 when no late completions exist', () => {
    const tasks = [
      makeTask({
        cadence: { type: 'daily' },
        completedDates: [midnight(-2), midnight(-1), midnight()],
      }),
    ];
    expect(computeAvgLateDrift(tasks, 30)).toBe(0);
  });
});

describe('computeMostReliable', () => {
  test('picks the task with the highest on-time percentage', () => {
    const reliable = makeTask({
      id: 'reliable',
      cadence: { type: 'daily' },
      completedDates: [midnight(-3), midnight(-2), midnight(-1), midnight()],
    });
    const flaky = makeTask({
      id: 'flaky',
      cadence: { type: 'daily' },
      completedDates: [midnight(-9), midnight(-6), midnight(-2), midnight()],
    });
    const result = computeMostReliable([flaky, reliable], 30, 2);
    expect(result.task?.id).toBe('reliable');
    expect(result.pct).toBe(100);
  });

  test('ignores tasks below the minimum completion threshold', () => {
    const task = makeTask({
      cadence: { type: 'daily' },
      completedDates: [midnight(-1), midnight()],
    });
    const result = computeMostReliable([task], 30, 5);
    expect(result.task).toBeNull();
  });
});
