'use no memo';

import {
  type ColorProp,
  FlexWidget,
  TextWidget,
} from 'react-native-android-widget';
import type { WidgetTask } from '../../lib/widgetPayloads';

export const M3 = {
  primary: '#0061A4',
  onPrimary: '#FFFFFF',
  primaryContainer: '#D1E4FF',
  onPrimaryContainer: '#001D36',
  secondaryContainer: '#D7E3F8',
  onSecondaryContainer: '#101C2B',
  surface: '#FEF7FF',
  surface2: '#F7F2FA',
  surface3: '#F3EDF7',
  label: '#1D1B20',
  label2: '#49454F',
  label3: '#79747E',
  outlineVariant: '#CAC4D0',
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',
  green: '#146C2E',
  greenContainer: '#B0F1B7',
  onGreenContainer: '#002108',
  onErrorContainerDim: '#6B2E2E',
} as const;

export const TILE_TINTS = {
  red: { tint: '#FFDAD6', fg: '#BA1A1A' },
  maroon: { tint: '#FFDAD6', fg: '#8B2C1A' },
  orange: { tint: '#FFDDB3', fg: '#8B5000' },
  peach: { tint: '#FFE0CC', fg: '#7C4A20' },
  yellow: { tint: '#F3E9C7', fg: '#6F5D10' },
  olive: { tint: '#E4E9BA', fg: '#4F571B' },
  green: { tint: '#B0F1B7', fg: '#135322' },
  forest: { tint: '#A5DDB3', fg: '#0B4A1E' },
  mint: { tint: '#BEEAD5', fg: '#114D3B' },
  teal: { tint: '#B8EEEA', fg: '#00504C' },
  cyan: { tint: '#BDE5F0', fg: '#004E61' },
  blue: { tint: '#D1E4FF', fg: '#00497D' },
  indigo: { tint: '#D8DFFF', fg: '#1F2F77' },
  purple: { tint: '#EADDFF', fg: '#4F378B' },
  lavender: { tint: '#E6DEFF', fg: '#403972' },
  pink: { tint: '#FFD8E4', fg: '#7D2E4E' },
  rose: { tint: '#FFD9DF', fg: '#7D2D3F' },
  slate: { tint: '#DDE2EB', fg: '#3D4450' },
  brown: { tint: '#E4D8CA', fg: '#4E3A1C' },
  gray: { tint: '#E1E3E6', fg: '#44474F' },
} as const satisfies Record<string, { tint: ColorProp; fg: ColorProp }>;

export function tintFor(colorKey: string | undefined): {
  tint: ColorProp;
  fg: ColorProp;
} {
  return TILE_TINTS[colorKey as keyof typeof TILE_TINTS] ?? TILE_TINTS.gray;
}

export function firstLetter(title: string): string {
  const trimmed = title.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
}

export function isOverdueTs(timestamp: number): boolean {
  const due = new Date(timestamp);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
}

export function isTodayTs(timestamp: number): boolean {
  const due = new Date(timestamp);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return due.getTime() === today.getTime();
}

export function formatDue(timestamp: number): string {
  const due = new Date(timestamp);
  const today = new Date();
  const dueM = new Date(timestamp);
  dueM.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (dueM.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays < 0) return `${Math.abs(diffDays)}d late`;
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7)
    return due.toLocaleDateString('en-US', { weekday: 'short' });
  return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function dueColor(task: WidgetTask): ColorProp {
  if (task.isOverdue ?? isOverdueTs(task.nextDueDate)) return M3.error;
  if (task.isDueToday ?? isTodayTs(task.nextDueDate)) return M3.primary;
  return M3.label2;
}

export function bucketize(tasks: WidgetTask[]) {
  const today: WidgetTask[] = [];
  const overdue: WidgetTask[] = [];
  const upcoming: WidgetTask[] = [];
  for (const t of tasks) {
    if (t.isOverdue ?? isOverdueTs(t.nextDueDate)) overdue.push(t);
    else if (t.isDueToday ?? isTodayTs(t.nextDueDate)) today.push(t);
    else upcoming.push(t);
  }
  const sortByDue = (a: WidgetTask, b: WidgetTask) =>
    a.nextDueDate - b.nextDueDate;
  return {
    overdue: overdue.sort(sortByDue),
    today: today.sort(sortByDue),
    upcoming: upcoming.sort(sortByDue),
  };
}

export function TaskTile({
  task,
  size = 28,
}: {
  task: WidgetTask;
  size?: number;
}) {
  const overdue = task.isOverdue ?? isOverdueTs(task.nextDueDate);
  const { tint, fg } = overdue
    ? { tint: M3.errorContainer, fg: M3.error }
    : tintFor(task.color);
  return (
    <FlexWidget
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size / 2),
        backgroundColor: tint,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextWidget
        text={firstLetter(task.title)}
        style={{
          fontSize: Math.round(size * 0.48),
          fontWeight: '500',
          color: fg,
        }}
      />
    </FlexWidget>
  );
}
