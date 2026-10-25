import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { Todo } from '../lib/types';
import {
  addTodo as addTodoReducer,
  clearDone as clearDoneReducer,
  mergeTodos as mergeTodosReducer,
  removeTodo as removeTodoReducer,
  toggleTodo as toggleTodoReducer,
} from './todoReducers';

const STORAGE_KEY = 'todos';

interface TodosStore {
  todos: Todo[];
  loaded: boolean;
  load: () => Promise<void>;
  add: (title: string) => Promise<void>;
  toggle: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clearDone: () => Promise<void>;
  replaceAll: (todos: Todo[]) => Promise<void>;
  merge: (todos: Todo[]) => Promise<{ imported: number; skipped: number }>;
}

async function persist(todos: Todo[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export const useTodosStore = create<TodosStore>((set, get) => {
  const apply =
    <Args extends readonly unknown[]>(
      reducer: (todos: Todo[], ...args: Args) => Todo[]
    ) =>
    async (...args: Args): Promise<void> => {
      const todos = reducer(get().todos, ...args);
      set({ todos });
      await persist(todos);
    };

  return {
    todos: [],
    loaded: false,

    load: async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        set({ todos: json ? JSON.parse(json) : [], loaded: true });
      } catch {
        set({ todos: [], loaded: true });
      }
    },

    add: apply((todos: Todo[], title: string) => addTodoReducer(todos, title)),
    toggle: apply((todos: Todo[], id: string) => toggleTodoReducer(todos, id)),
    remove: apply(removeTodoReducer),
    clearDone: apply(clearDoneReducer),
    replaceAll: apply((_todos: Todo[], incoming: Todo[]) => incoming),

    merge: async incoming => {
      const { merged, imported, skipped } = mergeTodosReducer(
        get().todos,
        incoming
      );
      set({ todos: merged });
      await persist(merged);
      return { imported, skipped };
    },
  };
});
