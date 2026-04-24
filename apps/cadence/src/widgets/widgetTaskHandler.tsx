import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { CadenceWidget, WidgetTask } from './CadenceWidget';

export const ANDROID_WIDGET_TASKS_KEY = 'android_widget_tasks';

export async function loadWidgetTasks(): Promise<WidgetTask[]> {
  try {
    const data = await AsyncStorage.getItem(ANDROID_WIDGET_TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function widgetTaskHandler(
  props: WidgetTaskHandlerProps
): Promise<void> {
  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      const tasks = await loadWidgetTasks();
      props.renderWidget(
        <CadenceWidget
          tasks={tasks}
          width={props.widgetInfo.width}
          height={props.widgetInfo.height}
        />
      );
      return;
    }
    case 'WIDGET_CLICK':
    case 'WIDGET_DELETED':
      return;
  }
}
