import { Cadence, Task } from '../lib/types';

export type TaskStatus = 'completed' | 'overdue' | 'dueToday' | 'default';

export const MS_DAY = 86400000;

export const getTodayTimestamp = (): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
};

export const normalizeToMidnight = (date: Date | number): number => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const stepCadence = (
  ts: number,
  cadence: Cadence,
  direction: 1 | -1
): number => {
  const date = new Date(ts);

  switch (cadence.type) {
    case 'daily':
      date.setDate(date.getDate() + direction);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7 * direction);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + direction);
      break;
    case 'custom':
      const value = cadence.value || 1;
      if (cadence.unit === 'days') {
        date.setDate(date.getDate() + value * direction);
      } else if (cadence.unit === 'weeks') {
        date.setDate(date.getDate() + value * 7 * direction);
      } else if (cadence.unit === 'months') {
        date.setMonth(date.getMonth() + value * direction);
      }
      break;
  }

  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

export const addOneCadence = (ts: number, cadence: Cadence): number =>
  stepCadence(ts, cadence, 1);

export const subtractOneCadence = (ts: number, cadence: Cadence): number =>
  stepCadence(ts, cadence, -1);

export const calculateNextDueDate = (
  cadence: Cadence,
  lastCompletedAt?: number,
  currentNextDueDate?: number
): number => {
  if (currentNextDueDate) {
    return currentNextDueDate;
  }

  return addOneCadence(lastCompletedAt || Date.now(), cadence);
};

/**
 * Fixed-schedule next due date. Unlike the floating schedule (which anchors the
 * next due to the completion date), this keeps the task on its original
 * cadence: it advances the *current* due date by one cadence step, then keeps
 * stepping until the result is strictly after the completion date. So a task
 * due every Sunday that is marked done on Monday stays due the next Sunday, and
 * one marked done weeks late skips the missed cycles to the next Sunday ahead.
 */
export const advanceFixedDueDate = (
  cadence: Cadence,
  currentDue: number,
  completedAt: number
): number => {
  const threshold = normalizeToMidnight(completedAt);
  let next = normalizeToMidnight(currentDue);
  do {
    const stepped = addOneCadence(next, cadence);
    if (stepped <= next) break;
    next = stepped;
  } while (next <= threshold);
  return next;
};

export const getNextDueDate = (task: Task): number => {
  return calculateNextDueDate(
    task.cadence,
    task.lastCompletedAt,
    task.nextDueDate
  );
};

export const isOverdue = (task: Task): boolean => {
  const nextDue = getNextDueDate(task);
  return nextDue < getTodayTimestamp();
};

export const isDueToday = (task: Task): boolean => {
  const nextDue = getNextDueDate(task);
  return nextDue === getTodayTimestamp();
};

export const isCompletedToday = (task: Task): boolean => {
  if (!task.completedDates || task.completedDates.length === 0) {
    return false;
  }
  const todayTimestamp = getTodayTimestamp();
  return task.completedDates.some(
    date => normalizeToMidnight(date) === todayTimestamp
  );
};

export const getTaskStatus = (task: Task): TaskStatus => {
  if (isCompletedToday(task)) return 'completed';
  if (isOverdue(task)) return 'overdue';
  if (isDueToday(task)) return 'dueToday';
  return 'default';
};

export const formatDueIn = (timestamp: number): string => {
  const todayTimestamp = getTodayTimestamp();
  const dueTimestamp = normalizeToMidnight(timestamp);

  const diffDays = Math.floor((dueTimestamp - todayTimestamp) / MS_DAY);

  if (diffDays < -1) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === -1) return '1d overdue';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `in ${diffDays}d`;
  if (diffDays < 14) return 'Next week';
  if (diffDays < 30) return `in ${Math.round(diffDays / 7)}w`;
  if (diffDays < 365) return `in ${Math.round(diffDays / 30)}mo`;
  return `in ${Math.round(diffDays / 365)}y`;
};

export const relativeLabel = (timestamp: number): string => {
  const diff = Math.floor(
    (getTodayTimestamp() - normalizeToMidnight(timestamp)) / MS_DAY
  );
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  if (diff < 14) return 'Last week';
  if (diff < 30) return `${Math.round(diff / 7)} weeks ago`;
  if (diff < 60) return 'Last month';
  if (diff < 365) return `${Math.round(diff / 30)} months ago`;
  return `${Math.round(diff / 365)} years ago`;
};

export const formatCompletionDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatLastCompleted = (task: Task): string => {
  if (!task.lastCompletedAt) {
    return 'Never completed';
  }

  const lastDate = new Date(task.lastCompletedAt);
  return lastDate.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const sortTasksByDueDate = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    const aDue = getNextDueDate(a);
    const bDue = getNextDueDate(b);
    if (aDue !== bDue) {
      return aDue - bDue;
    }
    return a.createdAt - b.createdAt;
  });
};

export interface Buckets {
  overdue: Task[];
  today: Task[];
  thisWeek: Task[];
  later: Task[];
}

export function bucketizeTasks(
  tasks: Task[],
  todayTs: number = getTodayTimestamp()
): Buckets {
  const inWeek = todayTs + 7 * MS_DAY;
  const buckets: Buckets = {
    overdue: [],
    today: [],
    thisWeek: [],
    later: [],
  };
  const dueOf = new Map<string, number>();
  for (const t of tasks) {
    const nextDue = getNextDueDate(t);
    dueOf.set(t.id, nextDue);
    const completedToday = (t.completedDates ?? []).some(
      d => normalizeToMidnight(d) === todayTs
    );
    if (completedToday) {
      buckets.today.push(t);
      continue;
    }
    if (nextDue < todayTs) buckets.overdue.push(t);
    else if (nextDue === todayTs) buckets.today.push(t);
    else if (nextDue < inWeek) buckets.thisWeek.push(t);
    else buckets.later.push(t);
  }
  const sortFn = (a: Task, b: Task) =>
    (dueOf.get(a.id) ?? 0) - (dueOf.get(b.id) ?? 0);
  buckets.overdue.sort(sortFn);
  buckets.today.sort(sortFn);
  buckets.thisWeek.sort(sortFn);
  buckets.later.sort(sortFn);
  return buckets;
}

export const getPriorityTask = (tasks: Task[]): Task | null => {
  if (tasks.length === 0) return null;

  const sortedTasks = sortTasksByDueDate(tasks);

  const overdueTask = sortedTasks.find(task => isOverdue(task));
  if (overdueTask) return overdueTask;

  const dueTodayTask = sortedTasks.find(task => isDueToday(task));
  if (dueTodayTask) return dueTodayTask;

  return sortedTasks[0] || null;
};

export function cadenceEquals(a: Cadence, b: Cadence): boolean {
  if (a.type !== b.type) return false;
  if (a.type !== 'custom') return true;
  return a.value === b.value && a.unit === b.unit;
}

export function formatCadence(cadence: Cadence): string {
  const interval = cadence.value ?? 1;

  switch (cadence.type) {
    case 'daily':
      return 'every day';
    case 'weekly':
      return 'every week';
    case 'monthly':
      return 'every month';
    case 'custom':
      return `every ${interval} ${cadence.unit}`;
    default:
      return 'unknown';
  }
}
