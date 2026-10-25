import { Todo } from '../lib/types';

export function addTodo(
  todos: Todo[],
  title: string,
  now: number = Date.now()
): Todo[] {
  const trimmed = title.trim();
  if (!trimmed) return todos;
  return [{ id: `todo_${now}`, title: trimmed, createdAt: now }, ...todos];
}

export function toggleTodo(
  todos: Todo[],
  id: string,
  now: number = Date.now()
): Todo[] {
  return todos.map(t => {
    if (t.id !== id) return t;
    if (t.completedAt !== undefined) {
      const { completedAt: _completedAt, ...open } = t;
      return open;
    }
    return { ...t, completedAt: now };
  });
}

export function removeTodo(todos: Todo[], id: string): Todo[] {
  return todos.filter(t => t.id !== id);
}

export function clearDone(todos: Todo[]): Todo[] {
  return todos.filter(t => t.completedAt === undefined);
}

export function mergeTodos(
  existing: Todo[],
  incoming: Todo[]
): {
  merged: Todo[];
  imported: number;
  skipped: number;
} {
  const existingIds = new Set(existing.map(t => t.id));
  const additions = incoming.filter(t => !existingIds.has(t.id));
  return {
    merged: [...existing, ...additions],
    imported: additions.length,
    skipped: incoming.length - additions.length,
  };
}

export function splitTodos(todos: Todo[]): { open: Todo[]; done: Todo[] } {
  const open = todos
    .filter(t => t.completedAt === undefined)
    .sort((a, b) => b.createdAt - a.createdAt);
  const done = todos
    .filter(t => t.completedAt !== undefined)
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
  return { open, done };
}
