import { Cadence, Task } from '../lib/types';
import {
  addOneCadence,
  getNextDueDate,
  getTaskStatus,
  getTodayTimestamp,
  MS_DAY,
  normalizeToMidnight,
  subtractOneCadence,
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
  /** Timestamp of the completion that opened this cycle. */
  previousAt: number;
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
      previousAt: sorted[i - 1],
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

export type CompletionStatus = DriftStatus | 'first';

export interface RangeCompletion {
  completedAt: number;
  status: CompletionStatus;
}

export interface LateSpan {
  dueAt: number;
  completedAt: number;
}

export interface TaskLane {
  task: Task;
  completions: RangeCompletion[];
  lateSpans: LateSpan[];
  overdueDays: number;
  nextDue: number;
  pct: number | null;
}

export interface RangeStats {
  onTime: number;
  late: number;
  pct: number;
  completions: number;
  graded: DriftStatus[];
  lanes: TaskLane[];
}

export const computeRangeStats = (
  tasks: Task[],
  start: number,
  end: number,
  todayTs: number = getTodayTimestamp()
): RangeStats => {
  let onTime = 0;
  let late = 0;
  let completions = 0;
  const graded: { at: number; status: DriftStatus }[] = [];
  const lanes: TaskLane[] = [];

  for (const task of tasks) {
    const sorted = [...(task.completedDates ?? [])].sort((a, b) => a - b);
    const inRange = (ts: number) => ts >= start && ts < end;
    const laneCompletions: RangeCompletion[] = [];
    const lateSpans: LateSpan[] = [];
    let laneGraded = 0;
    let laneLate = 0;

    if (sorted.length > 0 && inRange(sorted[0])) {
      laneCompletions.push({ completedAt: sorted[0], status: 'first' });
    }
    for (const d of iterCompletionDeltas(task, start)) {
      if (!inRange(d.completedAt)) continue;
      laneCompletions.push({ completedAt: d.completedAt, status: d.status });
      graded.push({ at: d.completedAt, status: d.status });
      laneGraded++;
      if (d.isLate) {
        laneLate++;
        late++;
        lateSpans.push({
          dueAt: addOneCadence(d.previousAt, task.cadence),
          completedAt: d.completedAt,
        });
      } else {
        onTime++;
      }
    }
    completions += laneCompletions.length;

    if (task.archived) continue;
    const nextDue = getNextDueDate(task);
    const overdueDays =
      getTaskStatus(task, todayTs) === 'overdue'
        ? Math.round((todayTs - normalizeToMidnight(nextDue)) / MS_DAY)
        : 0;
    lanes.push({
      task,
      completions: laneCompletions,
      lateSpans,
      overdueDays,
      nextDue,
      pct:
        laneGraded > 0
          ? Math.round(((laneGraded - laneLate) / laneGraded) * 100)
          : null,
    });
  }

  lanes.sort(
    (a, b) =>
      b.overdueDays - a.overdueDays ||
      (a.pct ?? 101) - (b.pct ?? 101) ||
      cadenceDays(a.task.cadence) - cadenceDays(b.task.cadence)
  );
  graded.sort((a, b) => a.at - b.at);
  const total = onTime + late;
  return {
    onTime,
    late,
    pct: total > 0 ? Math.round((onTime / total) * 100) : 100,
    completions,
    graded: graded.map(g => g.status),
    lanes,
  };
};

export interface CurrentCycle {
  start: number;
  nextDue: number;
  days: number;
  elapsed: number;
  dueIn: number;
}

export const computeCurrentCycle = (
  task: Task,
  todayTs: number = getTodayTimestamp()
): CurrentCycle => {
  const nextDue = normalizeToMidnight(getNextDueDate(task));
  const start = subtractOneCadence(nextDue, task.cadence);
  return {
    start,
    nextDue,
    days: Math.max(1, Math.round((nextDue - start) / MS_DAY)),
    elapsed: Math.round((todayTs - start) / MS_DAY),
    dueIn: Math.round((nextDue - todayTs) / MS_DAY),
  };
};

export interface HistoryEntry {
  completedAt: number;
  deltaDays: number | null;
  status: CompletionStatus;
}

export const computeHistory = (task: Task): HistoryEntry[] => {
  const sorted = [...(task.completedDates ?? [])].sort((a, b) => a - b);
  if (sorted.length === 0) return [];
  const out: HistoryEntry[] = [
    { completedAt: sorted[0], deltaDays: null, status: 'first' },
  ];
  for (const d of iterCompletionDeltas(task)) {
    out.push({
      completedAt: d.completedAt,
      deltaDays: Math.round(d.deltaDays),
      status: d.status,
    });
  }
  return out.reverse();
};
