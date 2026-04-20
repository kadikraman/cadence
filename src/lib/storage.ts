import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ColorKey } from '../utils/taskTints';
import type { GlyphKey } from '../utils/glyphs';

export interface Task {
  id: string;
  title: string;
  cadence: Cadence;
  createdAt: number;
  lastCompletedAt?: number;
  completedDates: number[];
  nextDueDate?: number;
  details?: string;
  color?: ColorKey;
  glyph?: GlyphKey;
}

export type Cadence = {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  value?: number;
  unit?: 'days' | 'weeks' | 'months';
};

const TASKS_KEY = 'tasks';

export const DEFAULT_COLOR: ColorKey = 'blue';
export const DEFAULT_GLYPH: GlyphKey = 'entry';

export const normalizeTask = (task: Task): Task => ({
  ...task,
  color: task.color ?? DEFAULT_COLOR,
  glyph: task.glyph ?? DEFAULT_GLYPH,
});

export const taskStorage = {
  getAllTasks: async (): Promise<Task[]> => {
    try {
      const tasksJson = await AsyncStorage.getItem(TASKS_KEY);
      if (!tasksJson) return [];
      const raw: Task[] = JSON.parse(tasksJson);
      return raw.map(normalizeTask);
    } catch {
      return [];
    }
  },

  getTask: async (id: string): Promise<Task | null> => {
    const tasks = await taskStorage.getAllTasks();
    return tasks.find(t => t.id === id) || null;
  },

  saveTask: async (task: Task): Promise<void> => {
    const tasks = await taskStorage.getAllTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index >= 0) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  deleteTask: async (id: string): Promise<void> => {
    const tasks = await taskStorage.getAllTasks();
    const filtered = tasks.filter(t => t.id !== id);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(filtered));
  },

  markTaskCompleted: async (
    id: string,
    date: number = Date.now()
  ): Promise<void> => {
    const task = await taskStorage.getTask(id);
    if (!task) return;

    const completedDates = [...(task.completedDates || []), date].sort(
      (a, b) => b - a
    );
    const lastCompletedAt = completedDates[0];

    const { calculateNextDueDate } = await import('../utils/taskUtils');
    const nextDueDate = calculateNextDueDate(task.cadence, lastCompletedAt);

    await taskStorage.saveTask({
      ...task,
      lastCompletedAt,
      completedDates,
      nextDueDate,
    });
  },

  editCompletionDate: async (
    id: string,
    oldDate: number,
    newDate: number
  ): Promise<void> => {
    const task = await taskStorage.getTask(id);
    if (!task) return;
    const filtered = (task.completedDates || []).filter(d => d !== oldDate);
    const completedDates = [...filtered, newDate].sort((a, b) => b - a);
    const lastCompletedAt =
      completedDates.length > 0 ? completedDates[0] : undefined;

    const { calculateNextDueDate } = await import('../utils/taskUtils');
    const nextDueDate = calculateNextDueDate(task.cadence, lastCompletedAt);

    await taskStorage.saveTask({
      ...task,
      completedDates,
      lastCompletedAt,
      nextDueDate,
    });
  },

  unmarkTaskCompleted: async (id: string, date: number): Promise<void> => {
    const task = await taskStorage.getTask(id);
    if (!task) return;

    const completedDates = (task.completedDates || []).filter(d => d !== date);
    const newLastCompletedAt =
      completedDates.length > 0 ? Math.max(...completedDates) : undefined;

    const { calculateNextDueDate } = await import('../utils/taskUtils');
    const nextDueDate = calculateNextDueDate(task.cadence, newLastCompletedAt);

    await taskStorage.saveTask({
      ...task,
      completedDates,
      lastCompletedAt: newLastCompletedAt,
      nextDueDate,
    });
  },

  deleteCompletionDate: async (id: string, date: number): Promise<void> => {
    await taskStorage.unmarkTaskCompleted(id, date);
  },
};
