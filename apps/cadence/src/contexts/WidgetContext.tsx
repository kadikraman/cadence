import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { createContext, useCallback, useContext } from 'react';
import { Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { Task } from '../lib/types';
import { CadenceWidget } from '../widgets/CadenceWidget';
import { reloadIosWidget, updateIosWidget } from '../widgets/iosWidget';
import { buildWidgetPayload } from '../widgets/widgetPayload';
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

export function WidgetProvider({
  children,
  tasks,
}: {
  children: React.ReactNode;
  tasks: Task[];
}) {
  React.useEffect(() => {
    const payloadTasks = buildWidgetPayload(tasks);

    if (Platform.OS === 'ios') {
      updateIosWidget(payloadTasks);
    } else if (Platform.OS === 'android') {
      AsyncStorage.setItem(
        ANDROID_WIDGET_TASKS_KEY,
        JSON.stringify(payloadTasks)
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
