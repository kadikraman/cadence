import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import type { TaskRowCallbacks } from '../../components/TaskRow';
import { routes } from '../../lib/routes';
import { Task } from '../../lib/types';
import { useTasksStore } from '../../stores/tasks';
import {
  bucketizeTasks,
  getNextDueDate,
  getTodayTimestamp,
  isCompletedToday,
  isDueToday,
  isOverdue,
  MS_DAY,
  normalizeToMidnight,
} from '../../utils/taskUtils';

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

  const buckets = useMemo(() => bucketizeTasks(tasks), [tasks]);
  const dueTodayCount =
    buckets.overdue.length +
    buckets.today.filter(t => !isCompletedToday(t)).length;

  const markCompleted = useTasksStore(s => s.markCompleted);
  const unmarkCompleted = useTasksStore(s => s.unmarkCompleted);
  const removeTaskFromStore = useTasksStore(s => s.remove);

  const celebrateCompletion = useCallback(() => {
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      confettiRef.current?.start();
    }, 200);
  }, []);

  const markDone = useCallback(
    async (task: Task) => {
      await markCompleted(task.id);
      const updated = useTasksStore.getState().tasks;
      const remaining = updated.filter(
        t => (isOverdue(t) || isDueToday(t)) && !isCompletedToday(t)
      );
      if (remaining.length === 0) celebrateCompletion();
    },
    [markCompleted, celebrateCompletion]
  );

  const onQuickDone = useCallback(
    async (task: Task) => {
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
    },
    [unmarkCompleted, markDone]
  );

  const onDelete = useCallback(
    (task: Task) => {
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
    },
    [removeTaskFromStore]
  );

  const onEdit = useCallback(
    (task: Task) => {
      router.push(routes.editTask(task.id));
    },
    [router]
  );

  const onPickDate = useCallback(
    (task: Task) => {
      router.push(routes.taskDetail(task.id));
    },
    [router]
  );

  const onOpenHistory = useCallback(
    (task: Task) => {
      router.push(routes.taskDetail(task.id));
    },
    [router]
  );

  const onTap = useCallback((task: Task) => {
    setExpandedId(prev => (prev === task.id ? null : task.id));
  }, []);

  const callbacks = useMemo<TaskRowCallbacks>(
    () => ({
      onTap,
      onToggleComplete: onQuickDone,
      onQuickDone,
      onEdit,
      onDelete,
      onOpenHistory,
      onPickDate,
    }),
    [onTap, onQuickDone, onEdit, onDelete, onOpenHistory, onPickDate]
  );

  return {
    router,
    confettiRef,
    buckets,
    dueTodayCount,
    expandedId,
    callbacks,
  };
}
