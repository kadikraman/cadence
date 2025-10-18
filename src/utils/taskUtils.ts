import { Task } from '../lib/db';

export type CadenceType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface TaskFormData {
  name: string;
  description?: string;
  cadenceType: CadenceType;
  cadenceInterval: number;
  nextDueDate: Date;
}

export const calculateNextDueDate = (
  currentDueDate: Date,
  cadenceType: CadenceType,
  cadenceInterval: number
): Date => {
  const nextDate = new Date(currentDueDate);

  switch (cadenceType) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + cadenceInterval);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + cadenceInterval * 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + cadenceInterval);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + cadenceInterval);
      break;
  }

  return nextDate;
};

export const isTaskDueToday = (task: Task): boolean => {
  const today = new Date();
  const dueDate = new Date(task.nextDueDate);

  return (
    dueDate.getDate() === today.getDate() &&
    dueDate.getMonth() === today.getMonth() &&
    dueDate.getFullYear() === today.getFullYear()
  );
};

export const isTaskDueTomorrow = (task: Task): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dueDate = new Date(task.nextDueDate);

  return (
    dueDate.getDate() === tomorrow.getDate() &&
    dueDate.getMonth() === tomorrow.getMonth() &&
    dueDate.getFullYear() === tomorrow.getFullYear()
  );
};

export const isTaskOverdue = (task: Task): boolean => {
  const today = new Date();
  const dueDate = new Date(task.nextDueDate);

  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const dueDateOnly = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate()
  );

  return dueDateOnly < todayDateOnly;
};

export const isTaskDueInNext7Days = (task: Task): boolean => {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  const dueDate = new Date(task.nextDueDate);

  return dueDate >= today && dueDate <= nextWeek;
};

export const getTaskDueStatus = (
  task: Task
): 'overdue' | 'due-today' | 'due-tomorrow' | 'due-soon' | 'due-later' => {
  if (isTaskOverdue(task)) return 'overdue';
  if (isTaskDueToday(task)) return 'due-today';
  if (isTaskDueTomorrow(task)) return 'due-tomorrow';
  if (isTaskDueInNext7Days(task)) return 'due-soon';
  return 'due-later';
};

export const formatDueDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (isTaskDueToday({ nextDueDate: timestamp } as Task)) {
    return 'Today';
  }

  if (isTaskDueTomorrow({ nextDueDate: timestamp } as Task)) {
    return 'Tomorrow';
  }

  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) {
    return `In ${diffDays} day${diffDays === 1 ? '' : 's'}`;
  }

  return date.toLocaleDateString();
};

export const sortTasksByDueDate = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    const statusA = getTaskDueStatus(a);
    const statusB = getTaskDueStatus(b);

    const priorityOrder = {
      overdue: 0,
      'due-today': 1,
      'due-tomorrow': 2,
      'due-soon': 3,
      'due-later': 4,
    };

    const priorityDiff = priorityOrder[statusA] - priorityOrder[statusB];
    if (priorityDiff !== 0) return priorityDiff;

    return a.nextDueDate - b.nextDueDate;
  });
};
