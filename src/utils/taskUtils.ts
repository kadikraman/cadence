import { Task, Cadence } from '../lib/storage';

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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return nextDue < today.getTime();
};

export const isDueToday = (task: Task): boolean => {
  const nextDue = getNextDueDate(task);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return nextDue === today.getTime();
};

export const formatDueDate = (timestamp: number): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  const dueDate = new Date(timestamp);
  dueDate.setHours(0, 0, 0, 0);
  const dueTimestamp = dueDate.getTime();

  const diffDays = Math.floor((dueTimestamp - todayTimestamp) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} overdue`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  } else {
    return dueDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
};

export const formatDueIn = (timestamp: number): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  const dueDate = new Date(timestamp);
  dueDate.setHours(0, 0, 0, 0);
  const dueTimestamp = dueDate.getTime();

  const diffDays = Math.floor((dueTimestamp - todayTimestamp) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} overdue`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due in 1 day';
  } else {
    return `Due in ${diffDays} days`;
  }
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
