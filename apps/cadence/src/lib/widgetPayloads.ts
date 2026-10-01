import type { SFSymbol } from 'expo-symbols';

/**
 * Shared shapes for data the home-screen widgets consume.
 *
 * Both producer (the app) and consumer (the widget renderer) must agree on
 * these field names. The iOS widget (`widgets/ios/CadenceWidget.tsx`) receives
 * a `WidgetIosSnapshot` as props via expo-widgets.
 */

/**
 * Every non-archived task, sorted by `nextDueDate`. Tasks completed today are
 * included: completing a task moves `nextDueDate` past today, so they sort
 * with the other upcoming tasks.
 */
export interface WidgetTaskPayload {
  id: string;
  title: string;
  color: string;
  glyph: string;
  nextDueDate: number;
}

export type WidgetTaskStatus = 'overdue' | 'today' | 'upcoming';

/**
 * Presentation-ready task for the iOS widget. expo-widgets evaluates the
 * widget component in an isolated runtime where imports and module scope are
 * unavailable, so the producer (`widgets/iosWidgetSnapshot.ts`) resolves glyph
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
 * What the Android widget reads from AsyncStorage. Same shape as
 * WidgetTaskPayload. Overdue/due-today status is intentionally absent: the
 * widget re-renders in the background long after the app last wrote this
 * payload, so status must be derived from `nextDueDate` at render time, never
 * precomputed by the producer.
 */
export type WidgetTask = WidgetTaskPayload;
