import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { logs } from '../../lib/logs';
import { useTasksStore } from '../../stores/tasks';
import { getTodayTimestamp, MS_DAY } from '../../utils/taskUtils';
import type { QuickOption } from '../../components/DatePickerSheet';

export type Tab = 'timeline' | 'cycles';

function nextDueQuickOptions(): QuickOption[] {
  const today = getTodayTimestamp();
  return [
    { label: 'Today', ts: today },
    { label: 'Tomorrow', ts: today + MS_DAY },
    { label: 'In a week', ts: today + 7 * MS_DAY },
    { label: 'In a month', ts: today + 30 * MS_DAY },
  ];
}

export function useTaskDetail() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const router = useRouter();

  const task = useTasksStore(s => s.tasks.find(t => t.id === taskId) ?? null);
  const markCompleted = useTasksStore(s => s.markCompleted);
  const editCompletionDate = useTasksStore(s => s.editCompletionDate);
  const unmarkCompleted = useTasksStore(s => s.unmarkCompleted);
  const unarchiveTask = useTasksStore(s => s.unarchive);

  const [tab, setTab] = useState<Tab>('timeline');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<number | null>(null);
  const [unarchiveOpen, setUnarchiveOpen] = useState(false);

  const openNewDatePicker = () => {
    setEditingEntry(null);
    setDatePickerOpen(true);
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
    if (!task) return;
    if (editingEntry !== null) {
      await editCompletionDate(task.id, editingEntry, ts);
    } else {
      logs.taskCompleted();
      await markCompleted(task.id, ts);
    }
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
    tab,
    setTab,
    datePickerOpen,
    editingEntry,
    openNewDatePicker,
    openEditDatePicker,
    closeDatePicker,
    savePicker,
    markDoneNow,
    deleteCompletion,
    unarchiveOpen,
    openUnarchivePicker,
    closeUnarchivePicker,
    confirmUnarchive,
    unarchiveQuickOptions: nextDueQuickOptions(),
  };
}
