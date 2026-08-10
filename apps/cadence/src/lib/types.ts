import { ColorKey, DEFAULT_COLOR } from '../utils/taskTints';
import { DEFAULT_GLYPH, GlyphKey } from '../utils/glyphs';

export interface Task {
  id: string;
  title: string;
  cadence: Cadence;
  createdAt: number;
  lastCompletedAt?: number;
  completedDates: number[];
  nextDueDate?: number;
  details?: string;
  color?: ColorKey;
  glyph?: GlyphKey;
  archived?: boolean;
  schedule?: Schedule;
}

export type Schedule = 'floating' | 'fixed';

export const DEFAULT_SCHEDULE: Schedule = 'floating';

export type Cadence = {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  value?: number;
  unit?: 'days' | 'weeks' | 'months';
};

export const normalizeTask = (task: Task): Task => ({
  ...task,
  color: task.color ?? DEFAULT_COLOR,
  glyph: task.glyph ?? DEFAULT_GLYPH,
});
