import type { ColorKey } from '../utils/taskTints';
import type { GlyphKey } from '../utils/glyphs';

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
}

export type Cadence = {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  value?: number;
  unit?: 'days' | 'weeks' | 'months';
};

export const DEFAULT_COLOR: ColorKey = 'slate';
export const DEFAULT_GLYPH: GlyphKey = 'entry';

export const normalizeTask = (task: Task): Task => ({
  ...task,
  color: task.color ?? DEFAULT_COLOR,
  glyph: task.glyph ?? DEFAULT_GLYPH,
});
