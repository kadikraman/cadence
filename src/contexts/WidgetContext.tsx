import { ExtensionStorage } from '@bacons/apple-targets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { createContext, useCallback, useContext } from 'react';
import { Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { Task } from '../lib/storage';
import {
  getNextDueDate,
  getPriorityTask,
  isDueToday,
} from '../utils/taskUtils';
import { CadenceWidget } from '../widgets/CadenceWidget';
import {
  ANDROID_WIDGET_TASKS_KEY,
  loadWidgetTasks,
} from '../widgets/widgetTaskHandler';

const storage = new ExtensionStorage('group.dev.kadi.cadence');

type WidgetContextType = {
  refreshWidget: () => void;
};

const WidgetContext = createContext<WidgetContextType | null>(null);

export function WidgetProvider({
  children,
  tasks,
}: {
  children: React.ReactNode;
  tasks: Task[];
}) {
  React.useEffect(() => {
    const priorityTask = getPriorityTask(tasks);
    const sortedTasks = tasks
      .map(task => {
        const nextDue = getNextDueDate(task);
        return {
          id: task.id,
          title: task.title,
          nextDueDate: nextDue,
          isDueToday: isDueToday(task),
          ...(task.details && { details: task.details }),
        };
      })
      .sort((a, b) => {
        if (a.isDueToday !== b.isDueToday) {
          return a.isDueToday ? -1 : 1;
        }
        return a.nextDueDate - b.nextDueDate;
      });

    if (Platform.OS === 'ios') {
      if (!priorityTask) {
        storage.set('widget_priority_task', JSON.stringify(null));
        storage.set('widget_tasks', JSON.stringify([]));
      } else {
        const nextDue = getNextDueDate(priorityTask);
        const taskData = {
          id: priorityTask.id,
          title: priorityTask.title,
          nextDueDate: nextDue,
          ...(priorityTask.details && { details: priorityTask.details }),
        };
        storage.set('widget_priority_task', JSON.stringify(taskData));
        storage.set('widget_tasks', JSON.stringify(sortedTasks));
      }
      ExtensionStorage.reloadWidget();
    } else if (Platform.OS === 'android') {
      AsyncStorage.setItem(
        ANDROID_WIDGET_TASKS_KEY,
        JSON.stringify(sortedTasks)
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
