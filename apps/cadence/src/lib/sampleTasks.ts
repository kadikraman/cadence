import { Task } from './types';
import { MS_DAY, normalizeToMidnight } from '../utils/taskUtils';

const dayMidnight = (daysAgo: number): number =>
  normalizeToMidnight(Date.now() - daysAgo * MS_DAY);

function makeTask(
  partial: Omit<Task, 'createdAt' | 'lastCompletedAt' | 'completedDates'> & {
    completedDates: number[];
  }
): Task {
  const completedDates = [...partial.completedDates].sort((a, b) => a - b);
  const lastCompletedAt =
    completedDates.length > 0
      ? completedDates[completedDates.length - 1]
      : undefined;
  return {
    ...partial,
    completedDates,
    createdAt: dayMidnight(180),
    lastCompletedAt,
  };
}

export function generateSampleTasks(): Task[] {
  return [
    makeTask({
      id: 'sample-vitamins',
      title: 'Take vitamins',
      cadence: { type: 'daily' },
      color: 'amber',
      glyph: 'pill',
      completedDates: Array.from({ length: 20 }, (_, i) => dayMidnight(i + 1)),
    }),
    makeTask({
      id: 'sample-yoga',
      title: 'Yoga',
      cadence: { type: 'weekly' },
      color: 'purple',
      glyph: 'workout',
      completedDates: [
        dayMidnight(72),
        dayMidnight(65),
        dayMidnight(58),
        dayMidnight(51),
        dayMidnight(44),
        dayMidnight(37),
        dayMidnight(30),
        dayMidnight(23),
        dayMidnight(15),
        dayMidnight(8),
        dayMidnight(2),
      ],
    }),
    makeTask({
      id: 'sample-laundry',
      title: 'Laundry',
      cadence: { type: 'weekly' },
      color: 'sky',
      glyph: 'washer',
      completedDates: [
        dayMidnight(63),
        dayMidnight(56),
        dayMidnight(49),
        dayMidnight(42),
        dayMidnight(35),
        dayMidnight(28),
        dayMidnight(21),
        dayMidnight(14),
        dayMidnight(7),
      ],
    }),
    makeTask({
      id: 'sample-vacuum',
      title: 'Vacuum living room',
      cadence: { type: 'monthly' },
      color: 'mint',
      glyph: 'kitchen',
      completedDates: [dayMidnight(90), dayMidnight(60), dayMidnight(28)],
    }),
    makeTask({
      id: 'sample-plants',
      title: 'Water plants',
      cadence: { type: 'monthly' },
      color: 'green',
      glyph: 'plant',
      completedDates: [dayMidnight(85), dayMidnight(55), dayMidnight(24)],
    }),
    makeTask({
      id: 'sample-sheets',
      title: 'Change bed sheets',
      cadence: { type: 'monthly' },
      color: 'lavender',
      glyph: 'bed',
      completedDates: [dayMidnight(95), dayMidnight(62), dayMidnight(30)],
    }),
    makeTask({
      id: 'sample-bathroom',
      title: 'Clean bathroom',
      cadence: { type: 'monthly' },
      color: 'teal',
      glyph: 'bath',
      completedDates: [dayMidnight(98), dayMidnight(64), dayMidnight(18)],
    }),
    makeTask({
      id: 'sample-oil',
      title: 'Oil change',
      cadence: { type: 'custom', value: 3, unit: 'months' },
      color: 'slate',
      glyph: 'car',
      completedDates: [dayMidnight(120), dayMidnight(35)],
    }),
    makeTask({
      id: 'sample-dentist',
      title: 'Dentist',
      cadence: { type: 'custom', value: 6, unit: 'months' },
      color: 'coral',
      glyph: 'heart',
      completedDates: [dayMidnight(170)],
    }),
  ];
}
