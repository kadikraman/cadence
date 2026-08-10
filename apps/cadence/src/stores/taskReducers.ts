import {
  advanceFixedDueDate,
  calculateNextDueDate,
  normalizeToMidnight,
  subtractOneCadence,
} from '../utils/taskUtils';
import { Task, normalizeTask } from '../lib/types';

const currentDueDate = (task: Task): number =>
  task.nextDueDate ?? calculateNextDueDate(task.cadence, task.lastCompletedAt);

export function upsertTask(tasks: Task[], task: Task): Task[] {
  const index = tasks.findIndex(t => t.id === task.id);
  if (index >= 0) {
    const next = tasks.slice();
    next[index] = task;
    return next;
  }
  return [...tasks, task];
}

export function removeTask(tasks: Task[], id: string): Task[] {
  return tasks.filter(t => t.id !== id);
}

export function markCompleted(
  tasks: Task[],
  id: string,
  date: number = Date.now()
): Task[] {
  return tasks.map(t => {
    if (t.id !== id) return t;
    const ts = normalizeToMidnight(date);
    const existing = (t.completedDates || []).filter(d => d !== ts);
    const completedDates = [...existing, ts].sort((a, b) => b - a);
    const lastCompletedAt = completedDates[0];
    const nextDueDate =
      t.schedule === 'fixed'
        ? advanceFixedDueDate(t.cadence, currentDueDate(t), ts)
        : calculateNextDueDate(t.cadence, lastCompletedAt);
    return {
      ...t,
      completedDates,
      lastCompletedAt,
      nextDueDate,
    };
  });
}

export function unmarkCompleted(
  tasks: Task[],
  id: string,
  date: number
): Task[] {
  return tasks.map(t => {
    if (t.id !== id) return t;
    const completedDates = (t.completedDates || []).filter(d => d !== date);
    const lastCompletedAt =
      completedDates.length > 0 ? Math.max(...completedDates) : undefined;
    let nextDueDate: number;
    if (t.schedule === 'fixed') {
      nextDueDate = subtractOneCadence(currentDueDate(t), t.cadence);
    } else if (completedDates.length > 0) {
      nextDueDate = calculateNextDueDate(t.cadence, lastCompletedAt);
    } else {
      nextDueDate = normalizeToMidnight(date);
    }
    return {
      ...t,
      completedDates,
      lastCompletedAt,
      nextDueDate,
    };
  });
}

export function editCompletionDate(
  tasks: Task[],
  id: string,
  oldDate: number,
  newDate: number
): Task[] {
  return tasks.map(t => {
    if (t.id !== id) return t;
    const newTs = normalizeToMidnight(newDate);
    const filtered = (t.completedDates || []).filter(d => d !== oldDate);
    const completedDates = [...filtered, newTs].sort((a, b) => b - a);
    const lastCompletedAt =
      completedDates.length > 0 ? completedDates[0] : undefined;
    const nextDueDate =
      t.schedule === 'fixed'
        ? currentDueDate(t)
        : calculateNextDueDate(t.cadence, lastCompletedAt);
    return {
      ...t,
      completedDates,
      lastCompletedAt,
      nextDueDate,
    };
  });
}

export function archiveTask(tasks: Task[], id: string): Task[] {
  return tasks.map(t => (t.id === id ? { ...t, archived: true } : t));
}

export function unarchiveTask(
  tasks: Task[],
  id: string,
  nextDueDate: number
): Task[] {
  return tasks.map(t =>
    t.id === id
      ? { ...t, archived: false, nextDueDate: normalizeToMidnight(nextDueDate) }
      : t
  );
}

export function replaceAll(tasks: Task[]): Task[] {
  return tasks.map(normalizeTask);
}

export function mergeTasks(
  existing: Task[],
  incoming: Task[]
): {
  merged: Task[];
  imported: number;
  skipped: number;
} {
  const existingIds = new Set(existing.map(t => t.id));
  const additions: Task[] = [];
  let skipped = 0;
  for (const t of incoming) {
    if (existingIds.has(t.id)) {
      skipped++;
      continue;
    }
    additions.push(normalizeTask(t));
  }
  return {
    merged: [...existing, ...additions],
    imported: additions.length,
    skipped,
  };
}
