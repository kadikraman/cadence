import { describe, expect, test } from 'bun:test';
import type { Task } from '../../lib/types';
import { buildDayOptions, daysBefore, defaultSelection } from './helpers';

const today = new Date(2026, 9, 1).getTime();

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 't1',
    title: 'Timebox tidy',
    cadence: { type: 'weekly' },
    createdAt: daysBefore(today, 60),
    completedDates: [],
    ...overrides,
  };
}

describe('daysBefore', () => {
  test('steps back whole calendar days', () => {
    expect(daysBefore(today, 1)).toBe(new Date(2026, 8, 30).getTime());
    expect(daysBefore(today, 10)).toBe(new Date(2026, 8, 21).getTime());
  });
});

describe('buildDayOptions', () => {
  test('adds the due date when the task is overdue', () => {
    const due = daysBefore(today, 10);
    const options = buildDayOptions(
      makeTask({ nextDueDate: due }),
      today,
      false
    );
    expect(options.map(o => o.label)).toEqual([
      'Yesterday',
      '2 days ago',
      'When it was due',
    ]);
    expect(options[2].ts).toBe(due);
  });

  test('skips the due date when it is not in the past', () => {
    const options = buildDayOptions(
      makeTask({ nextDueDate: today }),
      today,
      false
    );
    expect(options.map(o => o.label)).toEqual(['Yesterday', '2 days ago']);
  });

  test('skips the due date when it matches a relative day', () => {
    const options = buildDayOptions(
      makeTask({ nextDueDate: daysBefore(today, 1) }),
      today,
      false
    );
    expect(options.map(o => o.label)).toEqual(['Yesterday', '2 days ago']);
  });

  test('can lead with today', () => {
    const options = buildDayOptions(
      makeTask({ nextDueDate: today }),
      today,
      true
    );
    expect(options[0]).toEqual({ label: 'Today', ts: today });
  });
});

describe('defaultSelection', () => {
  test('picks yesterday', () => {
    expect(defaultSelection(today, null)).toBe(daysBefore(today, 1));
    expect(defaultSelection(today, { date: today, nextDue: today })).toBe(
      daysBefore(today, 1)
    );
  });

  test('avoids the date being edited', () => {
    const yesterday = daysBefore(today, 1);
    expect(defaultSelection(today, { date: yesterday, nextDue: today })).toBe(
      daysBefore(today, 2)
    );
  });
});
