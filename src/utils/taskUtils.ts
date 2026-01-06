import { Cadence, Task } from '../lib/storage';

export type TaskStatus = 'completed' | 'overdue' | 'dueToday' | 'default';

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

export const calculateNextDueDate = (
  cadence: Cadence,
  lastCompletedAt?: number,
  currentNextDueDate?: number
): number => {
  if (currentNextDueDate) {
    return currentNextDueDate;
  }

  const now = Date.now();
  const baseDate = lastCompletedAt || now;
  const date = new Date(baseDate);

  switch (cadence.type) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'custom':
      const value = cadence.value || 1;
      if (cadence.unit === 'days') {
        date.setDate(date.getDate() + value);
      } else if (cadence.unit === 'weeks') {
        date.setDate(date.getDate() + value * 7);
      } else if (cadence.unit === 'months') {
        date.setMonth(date.getMonth() + value);
      }
      break;
  }

  date.setHours(0, 0, 0, 0);
  return date.getTime();
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

  const diffDays = Math.floor(
    (dueTimestamp - todayTimestamp) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} overdue`;
  } else if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else {
    return `${diffDays} days`;
  }
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

export const getPriorityTask = (tasks: Task[]): Task | null => {
  if (tasks.length === 0) return null;

  const sortedTasks = sortTasksByDueDate(tasks);

  const overdueTask = sortedTasks.find(task => isOverdue(task));
  if (overdueTask) return overdueTask;

  const dueTodayTask = sortedTasks.find(task => isDueToday(task));
  if (dueTodayTask) return dueTodayTask;

  return sortedTasks[0] || null;
};

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
