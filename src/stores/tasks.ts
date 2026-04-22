import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { Task, normalizeTask } from '../lib/types';
import {
  editCompletionDate as editCompletionDateReducer,
  markCompleted as markCompletedReducer,
  mergeTasks as mergeTasksReducer,
  removeTask as removeTaskReducer,
  unmarkCompleted as unmarkCompletedReducer,
  upsertTask as upsertTaskReducer,
} from './taskReducers';

const STORAGE_KEY = 'tasks';

interface TasksStore {
  tasks: Task[];
  loaded: boolean;
  load: () => Promise<void>;
  save: (task: Task) => Promise<void>;
  remove: (id: string) => Promise<void>;
  markCompleted: (id: string, date?: number) => Promise<void>;
  unmarkCompleted: (id: string, date: number) => Promise<void>;
  editCompletionDate: (
    id: string,
    oldDate: number,
    newDate: number
  ) => Promise<void>;
  replaceAll: (tasks: Task[]) => Promise<void>;
  merge: (tasks: Task[]) => Promise<{ imported: number; skipped: number }>;
}

async function persist(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: [],
  loaded: false,

  load: async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      const raw: Task[] = json ? JSON.parse(json) : [];
      set({ tasks: raw.map(normalizeTask), loaded: true });
    } catch {
      set({ tasks: [], loaded: true });
    }
  },

  save: async task => {
    const tasks = upsertTaskReducer(get().tasks, task);
    set({ tasks });
    await persist(tasks);
  },

  remove: async id => {
    const tasks = removeTaskReducer(get().tasks, id);
    set({ tasks });
    await persist(tasks);
  },

  markCompleted: async (id, date) => {
    const tasks = markCompletedReducer(get().tasks, id, date);
    set({ tasks });
    await persist(tasks);
  },

  unmarkCompleted: async (id, date) => {
    const tasks = unmarkCompletedReducer(get().tasks, id, date);
    set({ tasks });
    await persist(tasks);
  },

  editCompletionDate: async (id, oldDate, newDate) => {
    const tasks = editCompletionDateReducer(get().tasks, id, oldDate, newDate);
    set({ tasks });
    await persist(tasks);
  },

  replaceAll: async incoming => {
    const tasks = incoming.map(normalizeTask);
    set({ tasks });
    await persist(tasks);
  },

  merge: async incoming => {
    const { merged, imported, skipped } = mergeTasksReducer(
      get().tasks,
      incoming
    );
    set({ tasks: merged });
    await persist(merged);
    return { imported, skipped };
  },
}));
