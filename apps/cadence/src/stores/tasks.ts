import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { Task } from '../lib/types';
import {
  archiveTask as archiveTaskReducer,
  editCompletionDate as editCompletionDateReducer,
  markCompleted as markCompletedReducer,
  mergeTasks as mergeTasksReducer,
  removeTask as removeTaskReducer,
  replaceAll as replaceAllReducer,
  unarchiveTask as unarchiveTaskReducer,
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
  archive: (id: string) => Promise<void>;
  unarchive: (id: string, nextDueDate: number) => Promise<void>;
  replaceAll: (tasks: Task[]) => Promise<void>;
  merge: (tasks: Task[]) => Promise<{ imported: number; skipped: number }>;
}

async function persist(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export const useTasksStore = create<TasksStore>((set, get) => {
  const apply =
    <Args extends readonly unknown[]>(
      reducer: (tasks: Task[], ...args: Args) => Task[]
    ) =>
    async (...args: Args): Promise<void> => {
      const tasks = reducer(get().tasks, ...args);
      set({ tasks });
      await persist(tasks);
    };

  return {
    tasks: [],
    loaded: false,

    load: async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        const raw: Task[] = json ? JSON.parse(json) : [];
        set({ tasks: replaceAllReducer(raw), loaded: true });
      } catch {
        set({ tasks: [], loaded: true });
      }
    },

    save: apply(upsertTaskReducer),
    remove: apply(removeTaskReducer),
    markCompleted: apply(markCompletedReducer),
    unmarkCompleted: apply(unmarkCompletedReducer),
    editCompletionDate: apply(editCompletionDateReducer),
    archive: apply(archiveTaskReducer),
    unarchive: apply(unarchiveTaskReducer),

    replaceAll: async incoming => {
      const tasks = replaceAllReducer(incoming);
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
  };
});
