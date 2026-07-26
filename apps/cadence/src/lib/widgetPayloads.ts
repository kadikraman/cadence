import type { SFSymbol } from 'expo-symbols';

/**
 * Shared shapes for data the home-screen widgets consume.
 *
 * Both producer (the app) and consumer (the widget renderer) must agree on
 * these field names. The iOS widget (`widgets/ios/CadenceWidget.tsx`) receives
 * a `WidgetIosSnapshot` as props via expo-widgets.
 */

export interface WidgetTaskPayload {
  id: string;
  title: string;
  color: string;
  glyph: string;
  nextDueDate: number;
  lastCompletedAt?: number;
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

export type WidgetTaskStatus = 'overdue' | 'today' | 'upcoming';

/**
 * Presentation-ready task for the iOS widget. expo-widgets evaluates the
 * widget component in an isolated runtime where imports and module scope are
 * unavailable, so the producer (`widgets/iosWidget.ts`) resolves glyph
 * symbols, tint colors, and due labels before they cross the boundary.
 */
export interface WidgetDisplayTask {
  id: string;
  title: string;
  symbol: SFSymbol;
  tint: string;
  tintDark: string;
  accent: string;
  accentDark: string;
  dueLabel: string;
  status: WidgetTaskStatus;
}

export interface WidgetIosSnapshot {
  tasks: WidgetDisplayTask[];
  overdueCount: number;
  todayCount: number;
  totalCount: number;
}

/**
 * Subset of WidgetTaskPayload that the Android widget reads from AsyncStorage.
 * Completed-today tasks are filtered out by the producer, which is why
 * `isCompletedToday` is absent here. Overdue/due-today status is intentionally
 * absent too: the widget re-renders in the background long after the app last
 * wrote this payload, so status must be derived from `nextDueDate` at render
 * time, never precomputed by the producer.
 */
export interface WidgetTask {
  id: string;
  title: string;
  color: string;
  glyph: string;
  nextDueDate: number;
}
