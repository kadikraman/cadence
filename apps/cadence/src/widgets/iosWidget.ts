import type {
  WidgetDisplayTask,
  WidgetIosSnapshot,
  WidgetTaskPayload,
} from '../lib/widgetPayloads';
import { DEFAULT_GLYPH, GLYPHS, GlyphKey } from '../utils/glyphs';
import { getTint } from '../utils/taskTints';
import {
  getTodayTimestamp,
  MS_DAY,
  normalizeToMidnight,
} from '../utils/taskUtils';
import CadenceWidget from './ios/CadenceWidget';

const daysUntil = (timestamp: number): number =>
  Math.floor((normalizeToMidnight(timestamp) - getTodayTimestamp()) / MS_DAY);

const formatDue = (diff: number): string => {
  if (diff < 0) return `${Math.abs(diff)}d late`;
  if (diff === 0) return 'TODAY';
  if (diff < 30) return `${diff}d`;
  if (diff < 365) return `${Math.round(diff / 30)}mo`;
  return `${Math.round(diff / 365)}y`;
};

const completedToday = (task: WidgetTaskPayload): boolean =>
  task.lastCompletedAt != null && daysUntil(task.lastCompletedAt) === 0;

const toDisplayTask = (task: WidgetTaskPayload): WidgetDisplayTask => {
  const diff = daysUntil(task.nextDueDate);
  const tint = getTint(task.color);
  const glyph = GLYPHS[task.glyph as GlyphKey] ?? GLYPHS[DEFAULT_GLYPH];
  return {
    id: task.id,
    title: task.title,
    symbol: glyph.symbol,
    tint: tint.tint,
    tintDark: tint.tintDark,
    accent: tint.accent,
    accentDark: tint.accentDark,
    dueLabel: formatDue(diff),
    status: diff < 0 ? 'overdue' : diff === 0 ? 'today' : 'upcoming',
  };
};

export function updateIosWidget(tasks: WidgetTaskPayload[]) {
  const displayTasks = tasks.filter(t => !completedToday(t)).map(toDisplayTask);
  const snapshot: WidgetIosSnapshot = {
    tasks: displayTasks,
    overdueCount: displayTasks.filter(t => t.status === 'overdue').length,
    todayCount: displayTasks.filter(t => t.status === 'today').length,
    totalCount: tasks.length,
  };
  CadenceWidget.updateSnapshot(snapshot);
}

export function reloadIosWidget() {
  CadenceWidget.reload();
}
