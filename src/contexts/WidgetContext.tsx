import { ExtensionStorage } from '@bacons/apple-targets';
import * as React from 'react';
import { createContext, useCallback, useContext } from 'react';
import { Task } from '../lib/storage';
import { getNextDueDate, getPriorityTask } from '../utils/taskUtils';

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

    if (!priorityTask) {
      storage.set('widget_priority_task', JSON.stringify(null));
    } else {
      const nextDue = getNextDueDate(priorityTask);
      const taskData = {
        id: priorityTask.id,
        title: priorityTask.title,
        nextDueDate: nextDue,
        ...(priorityTask.details && { details: priorityTask.details }),
      };
      storage.set('widget_priority_task', JSON.stringify(taskData));
    }

    ExtensionStorage.reloadWidget();
  }, [tasks]);

  const refreshWidget = useCallback(() => {
    ExtensionStorage.reloadWidget();
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
