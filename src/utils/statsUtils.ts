import { Cadence, Task } from '../lib/storage';
import {
  getNextDueDate,
  getTodayTimestamp,
  normalizeToMidnight,
} from './taskUtils';

const MS_DAY = 86400000;

export const cadenceDays = (cadence: Cadence): number => {
  if (cadence.type === 'daily') return 1;
  if (cadence.type === 'weekly') return 7;
  if (cadence.type === 'monthly') return 30;
  const v = cadence.value ?? 1;
  if (cadence.unit === 'days') return v;
  if (cadence.unit === 'weeks') return v * 7;
  if (cadence.unit === 'months') return v * 30;
  return 1;
};

export const taskHealth = (task: Task): number => {
  const last = task.lastCompletedAt ?? task.createdAt;
  const next = getNextDueDate(task);
  const span = Math.max(next - last, MS_DAY);
  const elapsed = getTodayTimestamp() - last;
  return elapsed / span;
};

export interface OnTimeResult {
  onTime: number;
  late: number;
  pct: number;
}

export const computeOnTimePct = (
  tasks: Task[],
  rangeDays?: number
): OnTimeResult => {
  const cutoff = rangeDays ? getTodayTimestamp() - rangeDays * MS_DAY : 0;
  let onTime = 0;
  let late = 0;
  for (const task of tasks) {
    const cadDays = cadenceDays(task.cadence);
    const sorted = [...(task.completedDates ?? [])].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] < cutoff) continue;
      const delta = (sorted[i] - sorted[i - 1]) / MS_DAY;
      if (delta <= cadDays * 1.1) onTime++;
      else late++;
    }
  }
  const total = onTime + late;
  const pct = total > 0 ? Math.round((onTime / total) * 100) : 100;
  return { onTime, late, pct };
};

export const computeStreak = (tasks: Task[]): number => {
  const byDay = new Set<number>();
  for (const task of tasks) {
    for (const d of task.completedDates ?? []) {
      byDay.add(normalizeToMidnight(d));
    }
  }
  let s = 0;
  let day = getTodayTimestamp();
  while (byDay.has(day) && s < 365) {
    s++;
    day -= MS_DAY;
  }
  return s;
};

export interface TaskStats {
  onTimePct: number;
  onTime: number;
  late: number;
  total: number;
  avgDrift: number;
  streak: number;
}

export const computeTaskStats = (task: Task): TaskStats => {
  const cadDays = cadenceDays(task.cadence);
  const sorted = [...(task.completedDates ?? [])].sort((a, b) => a - b);
  let onTime = 0;
  let late = 0;
  let totalDrift = 0;
  let driftCount = 0;
  for (let i = 1; i < sorted.length; i++) {
    const delta = (sorted[i] - sorted[i - 1]) / MS_DAY;
    const drift = delta - cadDays;
    totalDrift += drift;
    driftCount++;
    if (delta <= cadDays * 1.1) onTime++;
    else late++;
  }
  const total = sorted.length;
  const pct =
    onTime + late > 0 ? Math.round((onTime / (onTime + late)) * 100) : 100;
  const avgDrift = driftCount > 0 ? totalDrift / driftCount : 0;

  let streak = 0;
  for (let i = sorted.length - 1; i > 0; i--) {
    const delta = (sorted[i] - sorted[i - 1]) / MS_DAY;
    if (delta <= cadDays * 1.1) streak++;
    else break;
  }
  return { onTimePct: pct, onTime, late, total, avgDrift, streak };
};

export type DriftStatus = 'onTime' | 'late' | 'early';

export const driftStatus = (
  deltaDays: number,
  cadDays: number
): DriftStatus => {
  const drift = deltaDays - cadDays;
  if (Math.abs(drift) <= cadDays * 0.1) return 'onTime';
  if (drift > 0) return 'late';
  return 'early';
};

export const formatDriftLabel = (
  deltaDays: number,
  cadDays: number
): { label: string; status: DriftStatus } => {
  const drift = deltaDays - cadDays;
  const status = driftStatus(deltaDays, cadDays);
  if (status === 'onTime') return { label: 'on time', status };
  if (status === 'late') return { label: `${Math.round(drift)}d late`, status };
  return { label: `${Math.abs(Math.round(drift))}d early`, status };
};

export interface WeekBucket {
  count: number;
  end: number;
}

export const computeWeeklyCompletions = (
  tasks: Task[],
  weeks = 12
): WeekBucket[] => {
  const out: WeekBucket[] = [];
  const today = getTodayTimestamp();
  for (let w = weeks - 1; w >= 0; w--) {
    const end = today - w * 7 * MS_DAY;
    const start = end - 7 * MS_DAY;
    let count = 0;
    for (const task of tasks) {
      for (const d of task.completedDates ?? []) {
        if (d >= start && d < end) count++;
      }
    }
    out.push({ count, end });
  }
  return out;
};

export interface HeatmapResult {
  grid: number[][];
  max: number;
}

export const computeHeatmap = (
  tasks: Task[],
  rangeDays: number
): HeatmapResult => {
  const cutoff = getTodayTimestamp() - rangeDays * MS_DAY;
  const grid = Array.from({ length: 7 }, () => Array(6).fill(0) as number[]);
  for (const task of tasks) {
    for (const ts of task.completedDates ?? []) {
      if (ts < cutoff) continue;
      const d = new Date(ts);
      const dow = d.getDay();
      const bucket = Math.floor(d.getHours() / 4);
      grid[dow][bucket]++;
    }
  }
  const max = Math.max(1, ...grid.flat());
  return { grid, max };
};
