import type { Task } from '../../lib/types';
import { getNextDueDate, normalizeToMidnight } from '../../utils/taskUtils';
import type { CompletionEdit } from './types';

export interface DayOption {
  label: string;
  ts: number;
}

export function daysBefore(today: number, days: number): number {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return normalizeToMidnight(d);
}

export function buildDayOptions(
  task: Task,
  today: number,
  includeToday: boolean
): DayOption[] {
  const options: DayOption[] = [
    ...(includeToday ? [{ label: 'Today', ts: today }] : []),
    { label: 'Yesterday', ts: daysBefore(today, 1) },
    { label: '2 days ago', ts: daysBefore(today, 2) },
  ];
  const due = normalizeToMidnight(getNextDueDate(task));
  if (due < today && !options.some(o => o.ts === due)) {
    options.push({ label: 'When it was due', ts: due });
  }
  return options;
}

export function defaultSelection(
  today: number,
  editing: CompletionEdit | null
): number {
  const yesterday = daysBefore(today, 1);
  return editing?.date === yesterday ? daysBefore(today, 2) : yesterday;
}
