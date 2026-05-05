import { useUnistyles } from 'react-native-unistyles';
import type { Task } from '../../lib/types';
import {
  formatDueIn,
  getNextDueDate,
  getTaskStatus,
} from '../../utils/taskUtils';

export function useTaskRowVisuals(task: Task) {
  const { theme } = useUnistyles();
  const status = getTaskStatus(task);
  const overdue = status === 'overdue';
  const dueToday = status === 'dueToday';
  const completed = status === 'completed';
  const nextDue = getNextDueDate(task);
  const dueLabel = formatDueIn(nextDue);

  const dueColor = overdue
    ? theme.colors.error
    : dueToday
      ? theme.colors.blue
      : theme.colors.label3;
  const borderColor = overdue
    ? theme.colors.error
    : dueToday
      ? theme.colors.blue
      : theme.colors.label4;

  return {
    status,
    overdue,
    dueToday,
    completed,
    dueLabel,
    dueColor,
    borderColor,
  };
}
