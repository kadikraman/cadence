import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: string;
  title: string;
  cadence: Cadence;
  createdAt: number;
  lastCompletedAt?: number;
  completedDates: number[];
  nextDueDate?: number;
  details?: string;
}

export type Cadence = {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  value?: number;
  unit?: 'days' | 'weeks' | 'months';
};

const TASKS_KEY = 'tasks';

export const taskStorage = {
  getAllTasks: async (): Promise<Task[]> => {
    try {
      const tasksJson = await AsyncStorage.getItem(TASKS_KEY);
      if (!tasksJson) return [];
      return JSON.parse(tasksJson);
    } catch {
      return [];
    }
  },

  getTask: async (id: string): Promise<Task | null> => {
    const tasks = await taskStorage.getAllTasks();
    return tasks.find((t) => t.id === id) || null;
  },

  saveTask: async (task: Task): Promise<void> => {
    const tasks = await taskStorage.getAllTasks();
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index >= 0) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  deleteTask: async (id: string): Promise<void> => {
    const tasks = await taskStorage.getAllTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(filtered));
  },

  markTaskCompleted: async (id: string, date: number = Date.now()): Promise<void> => {
    const task = await taskStorage.getTask(id);
    if (!task) return;

    const completedDates = [...(task.completedDates || [])];
    completedDates.push(date);

    const { calculateNextDueDate } = await import('../utils/taskUtils');
    const nextDueDate = calculateNextDueDate(task.cadence, date);

    await taskStorage.saveTask({
      ...task,
      lastCompletedAt: date,
      completedDates: completedDates.sort((a, b) => b - a),
      nextDueDate,
    });
  },

  unmarkTaskCompleted: async (id: string, date: number): Promise<void> => {
    const task = await taskStorage.getTask(id);
    if (!task) return;

    const completedDates = (task.completedDates || []).filter((d) => d !== date);
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

