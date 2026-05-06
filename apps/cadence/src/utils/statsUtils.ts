import { Cadence, Task } from '../lib/types';
import {
  getNextDueDate,
  getTodayTimestamp,
  MS_DAY,
  normalizeToMidnight,
} from './taskUtils';

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

export interface CompletionDelta {
  /** Timestamp of the completion that closed this cycle. */
  completedAt: number;
  /** Days between this completion and the previous one. */
  deltaDays: number;
  /** deltaDays minus the task's cadence in days (negative = early, positive = late). */
  drift: number;
  /** True when drift exceeds 10% of the cadence (the binary on-time/late split). */
  isLate: boolean;
  /** Three-way classification using a 10% tolerance band: 'onTime' | 'late' | 'early'. */
  status: DriftStatus;
}

/**
 * Walks a task's completion history in chronological order and yields one
 * `CompletionDelta` per consecutive pair. Pass `sinceTs` to skip pairs whose
 * closing completion falls before that timestamp.
 *
 * Every per-task stats computation should go through this helper instead of
 * re-implementing the "sort, walk pairs, classify" loop.
 */
export function* iterCompletionDeltas(
  task: Task,
  sinceTs = 0
): Generator<CompletionDelta> {
  const cadDays = cadenceDays(task.cadence);
  const tolerance = cadDays * 0.1;
  const sorted = [...(task.completedDates ?? [])].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] < sinceTs) continue;
    const deltaDays = (sorted[i] - sorted[i - 1]) / MS_DAY;
    const drift = deltaDays - cadDays;
    yield {
      completedAt: sorted[i],
      deltaDays,
      drift,
      isLate: drift > tolerance,
      status: driftStatus(deltaDays, cadDays),
    };
  }
}

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
    for (const d of iterCompletionDeltas(task, cutoff)) {
      if (d.isLate) late++;
      else onTime++;
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
  const deltas = [...iterCompletionDeltas(task)];
  let onTime = 0;
  let late = 0;
  let totalDrift = 0;
  for (const d of deltas) {
    totalDrift += d.drift;
    if (d.isLate) late++;
    else onTime++;
  }
  const total = (task.completedDates ?? []).length;
  const pct =
    onTime + late > 0 ? Math.round((onTime / (onTime + late)) * 100) : 100;
  const avgDrift = deltas.length > 0 ? totalDrift / deltas.length : 0;

  let streak = 0;
  for (let i = deltas.length - 1; i >= 0; i--) {
    if (deltas[i].isLate) break;
    streak++;
  }
  return { onTimePct: pct, onTime, late, total, avgDrift, streak };
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

export interface LongestStreak {
  task: Task | null;
  streak: number;
}

export const computeLongestStreak = (tasks: Task[]): LongestStreak => {
  let best: LongestStreak = { task: null, streak: 0 };
  for (const task of tasks) {
    const s = computeTaskStats(task).streak;
    if (s > best.streak) best = { task, streak: s };
  }
  return best;
};

export const computeAvgLateDrift = (
  tasks: Task[],
  rangeDays: number
): number => {
  const cutoff = getTodayTimestamp() - rangeDays * MS_DAY;
  let totalDrift = 0;
  let count = 0;
  for (const task of tasks) {
    for (const d of iterCompletionDeltas(task, cutoff)) {
      if (d.isLate) {
        totalDrift += d.drift;
        count++;
      }
    }
  }
  return count > 0 ? totalDrift / count : 0;
};

export interface MostReliable {
  task: Task | null;
  pct: number;
  completions: number;
}

export const computeMostReliable = (
  tasks: Task[],
  rangeDays: number,
  minCompletions = 3
): MostReliable => {
  const cutoff = getTodayTimestamp() - rangeDays * MS_DAY;
  let best: MostReliable = { task: null, pct: 0, completions: 0 };
  for (const task of tasks) {
    let onTime = 0;
    let late = 0;
    for (const d of iterCompletionDeltas(task, cutoff)) {
      if (d.isLate) late++;
      else onTime++;
    }
    const total = onTime + late;
    if (total < minCompletions) continue;
    const pct = Math.round((onTime / total) * 100);
    if (pct > best.pct || (pct === best.pct && total > best.completions)) {
      best = { task, pct, completions: total };
    }
  }
  return best;
};

export const computeDowCounts = (
  tasks: Task[],
  rangeDays: number
): number[] => {
  const cutoff = getTodayTimestamp() - rangeDays * MS_DAY;
  const counts = Array(7).fill(0) as number[];
  for (const task of tasks) {
    for (const ts of task.completedDates ?? []) {
      if (ts < cutoff) continue;
      counts[new Date(ts).getDay()]++;
    }
  }
  return counts;
};

export interface CadenceMix {
  daily: number;
  weekly: number;
  monthly: number;
  custom: number;
  total: number;
}

export const computeCadenceMix = (tasks: Task[]): CadenceMix => {
  const mix: CadenceMix = {
    daily: 0,
    weekly: 0,
    monthly: 0,
    custom: 0,
    total: tasks.length,
  };
  for (const task of tasks) {
    mix[task.cadence.type]++;
  }
  return mix;
};
