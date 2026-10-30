import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { logs } from '../../lib/logs';
import { useTasksStore } from '../../stores/tasks';
import {
  computeCurrentCycle,
  computeHistory,
  computeTaskStats,
} from '../../utils/statsUtils';
import { getTodayTimestamp, MS_DAY } from '../../utils/taskUtils';
import type { QuickOption } from '../../components/DatePickerSheet';

function nextDueQuickOptions(): QuickOption[] {
  const today = getTodayTimestamp();
  return [
    { label: 'Today', ts: today },
    { label: 'Tomorrow', ts: today + MS_DAY },
    { label: 'In a week', ts: today + 7 * MS_DAY },
    { label: 'In a month', ts: today + 30 * MS_DAY },
  ];
}

export function useTaskDetail(taskId: string | undefined) {
  const router = useRouter();

  const task = useTasksStore(s => s.tasks.find(t => t.id === taskId) ?? null);
  const markCompleted = useTasksStore(s => s.markCompleted);
  const editCompletionDate = useTasksStore(s => s.editCompletionDate);
  const unmarkCompleted = useTasksStore(s => s.unmarkCompleted);
  const unarchiveTask = useTasksStore(s => s.unarchive);

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<number | null>(null);
  const [completionSheetOpen, setCompletionSheetOpen] = useState(false);
  const [unarchiveOpen, setUnarchiveOpen] = useState(false);

  const stats = useMemo(() => (task ? computeTaskStats(task) : null), [task]);
  const history = useMemo(() => (task ? computeHistory(task) : []), [task]);
  const cycle = useMemo(
    () => (task && !task.archived ? computeCurrentCycle(task) : null),
    [task]
  );

  const openCompletionSheet = () => setCompletionSheetOpen(true);
  const closeCompletionSheet = () => setCompletionSheetOpen(false);

  const confirmCompletion = async (ts: number) => {
    if (!task) return;
    setCompletionSheetOpen(false);
    logs.taskCompleted();
    await markCompleted(task.id, ts);
  };

  const openEditDatePicker = (ts: number) => {
    setEditingEntry(ts);
    setDatePickerOpen(true);
  };

  const closeDatePicker = () => {
    setDatePickerOpen(false);
    setEditingEntry(null);
  };

  const savePicker = async (ts: number) => {
    if (!task || editingEntry === null) return;
    await editCompletionDate(task.id, editingEntry, ts);
    closeDatePicker();
  };

  const markDoneNow = async () => {
    if (!task) return;
    logs.taskCompleted();
    await markCompleted(task.id);
  };

  const deleteCompletion = async (ts: number) => {
    if (!task) return;
    logs.taskUncompleted();
    await unmarkCompleted(task.id, ts);
  };

  const openUnarchivePicker = () => setUnarchiveOpen(true);
  const closeUnarchivePicker = () => setUnarchiveOpen(false);

  const confirmUnarchive = async (ts: number) => {
    if (!task) return;
    logs.taskUnarchived();
    await unarchiveTask(task.id, ts);
    setUnarchiveOpen(false);
  };

  return {
    router,
    task,
    stats,
    history,
    cycle,
    datePickerOpen,
    editingEntry,
    openEditDatePicker,
    closeDatePicker,
    savePicker,
    markDoneNow,
    deleteCompletion,
    completionSheetOpen,
    openCompletionSheet,
    closeCompletionSheet,
    confirmCompletion,
    unarchiveOpen,
    openUnarchivePicker,
    closeUnarchivePicker,
    confirmUnarchive,
    unarchiveQuickOptions: nextDueQuickOptions(),
  };
}
