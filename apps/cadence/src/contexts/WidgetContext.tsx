import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { createContext, useCallback, useContext } from 'react';
import { Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { Task } from '../lib/types';
import {
  WidgetStatsPayload,
  WidgetTask,
  WidgetTaskPayload,
} from '../lib/widgetPayloads';
import { computeOnTimePct, computeStreak } from '../utils/statsUtils';
import {
  getNextDueDate,
  getTodayTimestamp,
  isCompletedToday,
  isDueToday,
  isOverdue,
  MS_DAY,
} from '../utils/taskUtils';
import { CadenceWidget } from '../widgets/CadenceWidget';
import { reloadIosWidget, updateIosWidget } from '../widgets/iosWidget';
import {
  ANDROID_WIDGET_TASKS_KEY,
  loadWidgetTasks,
} from '../widgets/widgetTaskHandler';

const ANDROID_WIDGET_NAMES = [
  'CadenceWidgetSmall',
  'CadenceWidgetMedium',
  'CadenceWidgetLarge',
] as const;

type WidgetContextType = {
  refreshWidget: () => void;
};

const WidgetContext = createContext<WidgetContextType | null>(null);

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
    ...(task.lastCompletedAt !== undefined && {
      lastCompletedAt: task.lastCompletedAt,
    }),
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
    const { tasks: payloadTasks } = buildPayload(tasks);

    if (Platform.OS === 'ios') {
      updateIosWidget(payloadTasks);
    } else if (Platform.OS === 'android') {
      const androidTasks: WidgetTask[] = payloadTasks
        .filter(t => !t.isCompletedToday)
        .map(t => ({
          id: t.id,
          title: t.title,
          color: t.color,
          glyph: t.glyph,
          nextDueDate: t.nextDueDate,
          isDueToday: t.isDueToday,
          isOverdue: t.isOverdue,
        }));
      AsyncStorage.setItem(
        ANDROID_WIDGET_TASKS_KEY,
        JSON.stringify(androidTasks)
      ).then(() => {
        ANDROID_WIDGET_NAMES.forEach(widgetName => {
          requestWidgetUpdate({
            widgetName,
            renderWidget: async widgetInfo => {
              const widgetTasks = await loadWidgetTasks();
              return (
                <CadenceWidget
                  tasks={widgetTasks}
                  width={widgetInfo.width}
                  height={widgetInfo.height}
                />
              );
            },
          });
        });
      });
    }
  }, [tasks]);

  const refreshWidget = useCallback(() => {
    if (Platform.OS === 'ios') {
      reloadIosWidget();
    } else if (Platform.OS === 'android') {
      ANDROID_WIDGET_NAMES.forEach(widgetName => {
        requestWidgetUpdate({
          widgetName,
          renderWidget: async widgetInfo => {
            const widgetTasks = await loadWidgetTasks();
            return (
              <CadenceWidget
                tasks={widgetTasks}
                width={widgetInfo.width}
                height={widgetInfo.height}
              />
            );
          },
        });
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
