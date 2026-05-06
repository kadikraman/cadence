import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { logs } from '../../lib/logs';
import { useTasksStore } from '../../stores/tasks';

export type Tab = 'timeline' | 'cycles';

export function useTaskDetail() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const router = useRouter();

  const task = useTasksStore(s => s.tasks.find(t => t.id === taskId) ?? null);
  const markCompleted = useTasksStore(s => s.markCompleted);
  const editCompletionDate = useTasksStore(s => s.editCompletionDate);
  const unmarkCompleted = useTasksStore(s => s.unmarkCompleted);

  const [tab, setTab] = useState<Tab>('timeline');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<number | null>(null);

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
  };
}
