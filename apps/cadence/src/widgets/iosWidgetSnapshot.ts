import type {
  WidgetDisplayTask,
  WidgetIosSnapshot,
  WidgetTaskPayload,
} from '../lib/widgetPayloads';
import { DEFAULT_GLYPH, GLYPHS, GlyphKey } from '../utils/glyphs';
import { getTint } from '../utils/taskTints';
import { MS_DAY, normalizeToMidnight } from '../utils/taskUtils';

const formatDue = (diff: number): string => {
  if (diff < 0) return `${Math.abs(diff)}d late`;
  if (diff === 0) return 'TODAY';
  if (diff < 30) return `${diff}d`;
  if (diff < 365) return `${Math.round(diff / 30)}mo`;
  return `${Math.round(diff / 365)}y`;
};

const toDisplayTask = (
  task: WidgetTaskPayload,
  dayTs: number
): WidgetDisplayTask => {
  const diff = Math.floor(
    (normalizeToMidnight(task.nextDueDate) - dayTs) / MS_DAY
  );
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

export const buildIosSnapshot = (
  tasks: WidgetTaskPayload[],
  dayTs: number
): WidgetIosSnapshot => {
  const displayTasks = tasks.map(t => toDisplayTask(t, dayTs));
  return {
    tasks: displayTasks,
    overdueCount: displayTasks.filter(t => t.status === 'overdue').length,
    todayCount: displayTasks.filter(t => t.status === 'today').length,
    totalCount: tasks.length,
  };
};
