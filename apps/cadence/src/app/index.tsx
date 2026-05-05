import { useMemo } from 'react';
import { WidgetProvider } from '../contexts/WidgetContext';
import Home from '../screens/Home';
import { useTasksStore } from '../stores/tasks';
import { sortTasksByDueDate } from '../utils/taskUtils';

export default function HomeRoute() {
  const tasks = useTasksStore(s => s.tasks);
  const sortedTasks = useMemo(() => sortTasksByDueDate(tasks), [tasks]);
  return (
    <WidgetProvider tasks={sortedTasks}>
      <Home tasks={sortedTasks} />
    </WidgetProvider>
  );
}
