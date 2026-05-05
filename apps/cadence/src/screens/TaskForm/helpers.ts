import { QuickOption } from '../../components/DatePickerSheet';
import { Cadence } from '../../lib/types';
import { getTodayTimestamp, normalizeToMidnight } from '../../utils/taskUtils';

export type CadenceType = Cadence['type'];
export type CadenceUnit = NonNullable<Cadence['unit']>;

export const CADENCE_OPTIONS: { value: CadenceType; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom' },
];

export const UNIT_OPTIONS: { value: CadenceUnit; label: string }[] = [
  { value: 'days', label: 'days' },
  { value: 'weeks', label: 'weeks' },
  { value: 'months', label: 'months' },
];

const MS_DAY = 86400000;

export const getDueQuickOptions = (): QuickOption[] => {
  const today = getTodayTimestamp();
  return [
    { label: 'Yesterday', ts: today - MS_DAY },
    { label: 'Today', ts: today },
    { label: 'Tomorrow', ts: today + MS_DAY },
    { label: 'Next week', ts: today + 7 * MS_DAY },
  ];
};

export const formatDueDate = (ts: number): string => {
  const today = getTodayTimestamp();
  const diffDays = Math.round((normalizeToMidnight(ts) - today) / MS_DAY);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  return new Date(ts).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};
