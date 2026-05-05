import { Task } from '../../lib/types';
import {
  getNextDueDate,
  isCompletedToday,
  isDueToday,
  isOverdue,
} from '../../utils/taskUtils';

export interface WidgetPreviewProps {
  size: 'small' | 'medium';
  tasks: Task[];
  scale?: number;
}

export interface PreviewData {
  sorted: Task[];
  urgent: Task[];
  upcoming: Task[];
  overdueCount: number;
  todayCount: number;
}

export function computePreviewData(tasks: Task[]): PreviewData {
  const active = tasks.filter(t => !isCompletedToday(t));
  const sorted = [...active].sort(
    (a, b) => getNextDueDate(a) - getNextDueDate(b)
  );
  const overdueCount = sorted.filter(isOverdue).length;
  const todayCount = sorted.filter(t => !isOverdue(t) && isDueToday(t)).length;
  const urgent = sorted.filter(t => isOverdue(t) || isDueToday(t));
  const upcoming = sorted.filter(t => !isOverdue(t) && !isDueToday(t));
  return { sorted, urgent, upcoming, overdueCount, todayCount };
}

export function buildSummaryLabel(
  total: number,
  overdueCount: number,
  todayCount: number
): string {
  if (total === 0) return 'No tasks';
  if (overdueCount > 0 && todayCount > 0)
    return `${overdueCount} overdue · ${todayCount} today`;
  if (overdueCount > 0)
    return overdueCount === 1 ? '1 overdue' : `${overdueCount} overdue`;
  if (todayCount === 0) return 'Nothing due today';
  return todayCount === 1 ? '1 due today' : `${todayCount} due today`;
}
