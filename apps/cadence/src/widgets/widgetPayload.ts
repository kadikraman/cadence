import type { Task } from '../lib/types';
import type { WidgetTaskPayload } from '../lib/widgetPayloads';
import { getNextDueDate } from '../utils/taskUtils';

export function buildWidgetPayload(tasks: Task[]): WidgetTaskPayload[] {
  return tasks
    .map(task => ({
      id: task.id,
      title: task.title,
      color: task.color ?? 'slate',
      glyph: task.glyph ?? 'entry',
      nextDueDate: getNextDueDate(task),
    }))
    .sort((a, b) => a.nextDueDate - b.nextDueDate);
}
