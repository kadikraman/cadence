import { ExtensionStorage } from '@bacons/apple-targets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { createContext, useCallback, useContext } from 'react';
import { Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { Task } from '../lib/storage';
import { computeOnTimePct, computeStreak } from '../utils/statsUtils';
import {
  getNextDueDate,
  getPriorityTask,
  getTodayTimestamp,
  isCompletedToday,
  isDueToday,
  isOverdue,
} from '../utils/taskUtils';
import { CadenceWidget } from '../widgets/CadenceWidget';
import {
  ANDROID_WIDGET_TASKS_KEY,
  loadWidgetTasks,
} from '../widgets/widgetTaskHandler';

const storage = new ExtensionStorage('group.dev.kadi.cadence');

const MS_DAY = 86400000;

type WidgetContextType = {
  refreshWidget: () => void;
};

const WidgetContext = createContext<WidgetContextType | null>(null);

interface WidgetTaskPayload {
  id: string;
  title: string;
  color: string;
  glyph: string;
  nextDueDate: number;
  isDueToday: boolean;
  isOverdue: boolean;
  isCompletedToday: boolean;
  details?: string;
}

interface WidgetStatsPayload {
  overdueCount: number;
  todayCount: number;
  doneTodayCount: number;
  moreDueThisWeekCount: number;
  totalCount: number;
  streak: number;
  onTimePct: number;
}

function buildPayload(tasks: Task[]): {
  tasks: WidgetTaskPayload[];
  stats: WidgetStatsPayload;
} {
  const today = getTodayTimestamp();
  const weekEnd = today + 7 * MS_DAY;

  const mapped: WidgetTaskPayload[] = tasks.map(task => ({
    id: task.id,
    title: task.title,
    color: task.color ?? 'slate',
    glyph: task.glyph ?? 'entry',
    nextDueDate: getNextDueDate(task),
    isDueToday: isDueToday(task),
    isOverdue: isOverdue(task),
    isCompletedToday: isCompletedToday(task),
    ...(task.details && { details: task.details }),
  }));

  const sorted = [...mapped].sort((a, b) => {
    const aPriority = a.isOverdue ? 0 : a.isDueToday ? 1 : 2;
    const bPriority = b.isOverdue ? 0 : b.isDueToday ? 1 : 2;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return a.nextDueDate - b.nextDueDate;
  });

  const overdueCount = sorted.filter(
    t => t.isOverdue && !t.isCompletedToday
  ).length;
  const todayCount = sorted.filter(
    t => t.isDueToday && !t.isCompletedToday
  ).length;
  const doneTodayCount = sorted.filter(t => t.isCompletedToday).length;
  const moreDueThisWeekCount = sorted.filter(
    t =>
      !t.isCompletedToday &&
      !t.isOverdue &&
      !t.isDueToday &&
      t.nextDueDate < weekEnd
  ).length;

  const stats: WidgetStatsPayload = {
    overdueCount,
    todayCount,
    doneTodayCount,
    moreDueThisWeekCount,
    totalCount: tasks.length,
    streak: computeStreak(tasks),
    onTimePct: computeOnTimePct(tasks, 30).pct,
  };

  return { tasks: sorted, stats };
}

export function WidgetProvider({
  children,
  tasks,
}: {
  children: React.ReactNode;
  tasks: Task[];
}) {
  React.useEffect(() => {
    const priorityTask = getPriorityTask(tasks);
    const { tasks: payloadTasks, stats } = buildPayload(tasks);

    if (Platform.OS === 'ios') {
      if (!priorityTask) {
        storage.set('widget_priority_task', JSON.stringify(null));
        storage.set('widget_tasks', JSON.stringify([]));
      } else {
        const priorityPayload = payloadTasks.find(
          t => t.id === priorityTask.id
        );
        storage.set(
          'widget_priority_task',
          JSON.stringify(priorityPayload ?? null)
        );
        storage.set('widget_tasks', JSON.stringify(payloadTasks));
      }
      storage.set('widget_stats', JSON.stringify(stats));
      ExtensionStorage.reloadWidget();
    } else if (Platform.OS === 'android') {
      AsyncStorage.setItem(
        ANDROID_WIDGET_TASKS_KEY,
        JSON.stringify(
          payloadTasks.map(t => ({
            id: t.id,
            title: t.title,
            nextDueDate: t.nextDueDate,
            isDueToday: t.isDueToday,
            ...(t.details && { details: t.details }),
          }))
        )
      ).then(() => {
        requestWidgetUpdate({
          widgetName: 'CadenceWidget',
          renderWidget: async () => {
            const tasks = await loadWidgetTasks();
            return <CadenceWidget tasks={tasks} />;
          },
        });
      });
    }
  }, [tasks]);

  const refreshWidget = useCallback(() => {
    if (Platform.OS === 'ios') {
      ExtensionStorage.reloadWidget();
    } else if (Platform.OS === 'android') {
      requestWidgetUpdate({
        widgetName: 'CadenceWidget',
        renderWidget: async () => {
          const tasks = await loadWidgetTasks();
          return <CadenceWidget tasks={tasks} />;
        },
      });
    }
  }, []);

  return (
    <WidgetContext.Provider value={{ refreshWidget }}>
      {children}
    </WidgetContext.Provider>
  );
}

export const useWidget = () => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidget must be used within a WidgetProvider');
  }
  return context;
};
