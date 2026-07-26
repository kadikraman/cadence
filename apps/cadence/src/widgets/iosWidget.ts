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

const toDisplayTask = (
  task: WidgetTaskPayload,
  dayOffset: number
): WidgetDisplayTask => {
  const diff = daysUntil(task.nextDueDate) - dayOffset;
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

const TIMELINE_DAYS = 30;

const buildSnapshot = (
  tasks: WidgetTaskPayload[],
  dayOffset: number
): WidgetIosSnapshot => {
  const visible =
    dayOffset === 0 ? tasks.filter(t => !completedToday(t)) : tasks;
  const displayTasks = visible.map(t => toDisplayTask(t, dayOffset));
  return {
    tasks: displayTasks,
    overdueCount: displayTasks.filter(t => t.status === 'overdue').length,
    todayCount: displayTasks.filter(t => t.status === 'today').length,
    totalCount: tasks.length,
  };
};

export function updateIosWidget(tasks: WidgetTaskPayload[]) {
  const todayMidnight = getTodayTimestamp();
  const entries = Array.from({ length: TIMELINE_DAYS }, (_, day) => ({
    date: new Date(day === 0 ? Date.now() : todayMidnight + day * MS_DAY),
    props: buildSnapshot(tasks, day),
  }));
  CadenceWidget.updateTimeline(entries);
}

export function reloadIosWidget() {
  CadenceWidget.reload();
}
