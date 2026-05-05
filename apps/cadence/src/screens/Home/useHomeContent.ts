import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Task } from '../../lib/types';
import { useTasksStore } from '../../stores/tasks';
import {
  getNextDueDate,
  getTodayTimestamp,
  isCompletedToday,
  isDueToday,
  isOverdue,
  normalizeToMidnight,
} from '../../utils/taskUtils';

const MS_DAY = 86400000;

export interface Buckets {
  overdue: Task[];
  today: Task[];
  thisWeek: Task[];
  later: Task[];
}

function bucketize(tasks: Task[]): Buckets {
  const now = getTodayTimestamp();
  const inWeek = now + 7 * MS_DAY;
  const buckets: Buckets = { overdue: [], today: [], thisWeek: [], later: [] };
  for (const t of tasks) {
    if (isCompletedToday(t)) {
      buckets.today.push(t);
      continue;
    }
    const due = getNextDueDate(t);
    if (due < now) buckets.overdue.push(t);
    else if (due === now) buckets.today.push(t);
    else if (due < inWeek) buckets.thisWeek.push(t);
    else buckets.later.push(t);
  }
  const sortFn = (a: Task, b: Task) => getNextDueDate(a) - getNextDueDate(b);
  (Object.keys(buckets) as (keyof Buckets)[]).forEach(k =>
    buckets[k].sort(sortFn)
  );
  return buckets;
}

export function formatTodayHeading(date = new Date()): string {
  return date.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function useHomeContent(tasks: Task[]) {
  const router = useRouter();
  const confettiRef = useRef<ConfettiCannon>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const buckets = useMemo(() => bucketize(tasks), [tasks]);
  const dueTodayCount =
    buckets.overdue.length +
    buckets.today.filter(t => !isCompletedToday(t)).length;

  const markCompleted = useTasksStore(s => s.markCompleted);
  const unmarkCompleted = useTasksStore(s => s.unmarkCompleted);
  const removeTaskFromStore = useTasksStore(s => s.remove);

  const celebrateCompletion = () => {
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      confettiRef.current?.start();
    }, 200);
  };

  const markDone = async (task: Task) => {
    await markCompleted(task.id);
    const updated = useTasksStore.getState().tasks;
    const remaining = updated.filter(
      t => (isOverdue(t) || isDueToday(t)) && !isCompletedToday(t)
    );
    if (remaining.length === 0) celebrateCompletion();
  };

  const quickDone = async (task: Task) => {
    const today = getTodayTimestamp();
    if (isCompletedToday(task)) {
      const entry = task.completedDates?.find(
        d => normalizeToMidnight(d) === today
      );
      if (entry) await unmarkCompleted(task.id, entry);
      return;
    }
    const nextDue = normalizeToMidnight(getNextDueDate(task));
    const diffDays = Math.floor((nextDue - today) / MS_DAY);
    if (diffDays > 0) {
      Alert.alert(
        'Confirm completion',
        `This task isn't due for another ${diffDays} day${diffDays === 1 ? '' : 's'}. Mark it done anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Mark as done', onPress: () => markDone(task) },
        ]
      );
    } else {
      await markDone(task);
    }
  };

  const deleteTask = (task: Task) => {
    Alert.alert(
      'Delete task',
      `"${task.title}" and its history will be removed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeTaskFromStore(task.id),
        },
      ]
    );
  };

  const pickDate = (task: Task) => {
    router.push(`/task/${task.id}`);
  };

  const toggleExpanded = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const buildActions = (task: Task) => ({
    toggleComplete: () => quickDone(task),
    quickDone: () => quickDone(task),
    edit: () => router.push(`/new?taskId=${task.id}`),
    delete: () => deleteTask(task),
    openHistory: () => router.push(`/task/${task.id}`),
    pickDate: () => pickDate(task),
  });

  return {
    router,
    confettiRef,
    buckets,
    dueTodayCount,
    expandedId,
    toggleExpanded,
    buildActions,
  };
}
