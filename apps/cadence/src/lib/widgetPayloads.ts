/**
 * Shared shapes for data the home-screen widget consumes.
 *
 * Both producer (the app) and consumer (the widget renderer) must agree on
 * these field names. The iOS Swift target has its own copy of these shapes;
 * if you change a field here, update `targets/widget/` to match.
 */

export interface WidgetTaskPayload {
  id: string;
  title: string;
  color: string;
  glyph: string;
  nextDueDate: number;
  isDueToday: boolean;
  isOverdue: boolean;
  isCompletedToday: boolean;
  details?: string;
}

export interface WidgetStatsPayload {
  overdueCount: number;
  todayCount: number;
  doneTodayCount: number;
  moreDueThisWeekCount: number;
  totalCount: number;
  streak: number;
  onTimePct: number;
}

/**
 * Subset of WidgetTaskPayload that the Android widget reads from AsyncStorage.
 * Completed-today tasks are filtered out by the producer, which is why
 * `isCompletedToday` is absent here.
 */
export interface WidgetTask {
  id: string;
  title: string;
  color: string;
  glyph: string;
  nextDueDate: number;
  isDueToday?: boolean;
  isOverdue?: boolean;
}
