import { useCallback, useRef, useState } from 'react';
import type { CompletionEdit } from '../../components/CompletionSheet';
import type { CompletionToastData } from '../../components/CompletionToast';
import { logs } from '../../lib/logs';
import type { Task } from '../../lib/types';
import { completeTaskAt } from '../../stores/taskReducers';
import { useTasksStore } from '../../stores/tasks';
import {
  formatDayPhrase,
  formatShortDay,
  getNextDueDate,
  getTodayTimestamp,
} from '../../utils/taskUtils';

interface SheetTarget {
  task: Task;
  editing: CompletionEdit | null;
}

interface ToastState extends CompletionToastData {
  previous: Task;
  date: number;
  undoesCompletion: boolean;
}

const findTask = (id: string): Task | undefined =>
  useTasksStore.getState().tasks.find(t => t.id === id);

export function useCompletionFlow(onCompleted: () => void) {
  const markCompleted = useTasksStore(s => s.markCompleted);
  const saveTask = useTasksStore(s => s.save);

  const [sheetTarget, setSheetTarget] = useState<SheetTarget | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastKey = useRef(0);

  const showToast = useCallback(
    (
      previous: Task,
      date: number,
      canChange: boolean,
      undoesCompletion: boolean
    ) => {
      const current = findTask(previous.id);
      if (!current) return;
      toastKey.current += 1;
      setToast({
        key: toastKey.current,
        title: `Done ${formatDayPhrase(date, getTodayTimestamp(), 'on ')}`,
        subtitle: `${current.title} · next due ${formatShortDay(getNextDueDate(current))}`,
        canChange,
        previous,
        date,
        undoesCompletion,
      });
    },
    []
  );

  const complete = useCallback(
    async (task: Task, date: number, canChange: boolean) => {
      const previous = findTask(task.id) ?? task;
      logs.taskCompleted();
      await markCompleted(task.id, date);
      showToast(previous, date, canChange, true);
      onCompleted();
    },
    [markCompleted, showToast, onCompleted]
  );

  const markDoneToday = useCallback(
    (task: Task) => complete(task, getTodayTimestamp(), true),
    [complete]
  );

  const openSheet = useCallback((task: Task) => {
    setToast(null);
    setSheetTarget({ task, editing: null });
    setSheetVisible(true);
  }, []);

  const closeSheet = useCallback(() => setSheetVisible(false), []);

  const confirmSheet = useCallback(
    async (ts: number) => {
      if (!sheetTarget) return;
      setSheetVisible(false);
      const { task, editing } = sheetTarget;
      if (!editing) {
        await complete(task, ts, false);
        return;
      }
      const previous = findTask(task.id);
      if (!previous) return;
      await saveTask(completeTaskAt(task, ts));
      showToast(previous, ts, false, false);
    },
    [sheetTarget, complete, saveTask, showToast]
  );

  const changeFromToast = useCallback(() => {
    if (!toast) return;
    setToast(null);
    const current = findTask(toast.previous.id);
    if (!current) return;
    setSheetTarget({
      task: toast.previous,
      editing: { date: toast.date, nextDue: getNextDueDate(current) },
    });
    setSheetVisible(true);
  }, [toast]);

  const undoFromToast = useCallback(async () => {
    if (!toast) return;
    setToast(null);
    if (toast.undoesCompletion) logs.taskUncompleted();
    await saveTask(toast.previous);
  }, [toast, saveTask]);

  const dismissToast = useCallback(() => setToast(null), []);

  const dismissToastFor = useCallback((taskId: string) => {
    setToast(t => (t?.previous.id === taskId ? null : t));
  }, []);

  return {
    markDoneToday,
    openSheet,
    dismissToastFor,
    completionSheet: {
      visible: sheetVisible,
      task: sheetTarget?.task ?? null,
      editing: sheetTarget?.editing ?? null,
      onClose: closeSheet,
      onConfirm: confirmSheet,
    },
    completionToast: {
      toast,
      onChange: changeFromToast,
      onUndo: undoFromToast,
      onDismiss: dismissToast,
    },
  };
}
