import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { logs } from '../../../lib/logs';
import { Todo } from '../../../lib/types';
import { splitTodos } from '../../../stores/todoReducers';
import { useTodosStore } from '../../../stores/todos';
import type { TodoRowCallbacks, TodoUndo } from './types';

const TICK_DELAY_MS = 500;

export function useTodoList() {
  const todos = useTodosStore(s => s.todos);
  const add = useTodosStore(s => s.add);
  const toggle = useTodosStore(s => s.toggle);
  const remove = useTodosStore(s => s.remove);
  const clearDone = useTodosStore(s => s.clearDone);
  const merge = useTodosStore(s => s.merge);

  const { open, done } = useMemo(() => splitTodos(todos), [todos]);
  const [draft, setDraft] = useState('');
  const [doneExpanded, setDoneExpanded] = useState(false);
  const [pendingIds, setPendingIds] = useState<ReadonlySet<string>>(
    () => new Set()
  );
  const [undo, setUndo] = useState<TodoUndo | null>(null);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer, id) => {
        clearTimeout(timer);
        logs.todoCompleted();
        useTodosStore.getState().toggle(id);
      });
    };
  }, []);

  const setPending = useCallback((id: string, isPending: boolean) => {
    setPendingIds(prev => {
      const next = new Set(prev);
      if (isPending) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const submit = useCallback((): boolean => {
    if (!draft.trim()) return false;
    logs.todoCreated();
    add(draft);
    setDraft('');
    return true;
  }, [draft, add]);

  const onToggle = useCallback(
    (todo: Todo) => {
      if (todo.completedAt !== undefined) {
        toggle(todo.id);
        return;
      }
      const timer = timers.current.get(todo.id);
      if (timer) {
        clearTimeout(timer);
        timers.current.delete(todo.id);
        setPending(todo.id, false);
        return;
      }
      setPending(todo.id, true);
      timers.current.set(
        todo.id,
        setTimeout(() => {
          timers.current.delete(todo.id);
          setPending(todo.id, false);
          logs.todoCompleted();
          toggle(todo.id);
        }, TICK_DELAY_MS)
      );
    },
    [toggle, setPending]
  );

  const onDelete = useCallback(
    (todo: Todo) => {
      logs.todoDeleted();
      remove(todo.id);
      setUndo({ key: Date.now(), message: 'To-do deleted', items: [todo] });
    },
    [remove]
  );

  const clearDoneItems = useCallback(() => {
    if (done.length === 0) return;
    logs.todosCleared();
    clearDone();
    setUndo({
      key: Date.now(),
      message: `${done.length} done to-do${done.length === 1 ? '' : 's'} cleared`,
      items: done,
    });
  }, [done, clearDone]);

  const undoRemove = useCallback(() => {
    if (undo) merge(undo.items);
    setUndo(null);
  }, [undo, merge]);

  const dismissUndo = useCallback(() => setUndo(null), []);

  const toggleDoneExpanded = useCallback(
    () => setDoneExpanded(prev => !prev),
    []
  );

  const callbacks = useMemo<TodoRowCallbacks>(
    () => ({ onToggle, onDelete }),
    [onToggle, onDelete]
  );

  return {
    isEmpty: todos.length === 0,
    open,
    done,
    pendingIds,
    draft,
    setDraft,
    submit,
    doneExpanded,
    toggleDoneExpanded,
    clearDoneItems,
    undo,
    undoRemove,
    dismissUndo,
    callbacks,
  };
}
