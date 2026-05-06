'use no memo';

import type { WidgetTask } from '../../lib/widgetPayloads';
import { Large } from './Large';
import { Medium } from './Medium';
import { Small } from './Small';

export type { WidgetTask } from '../../lib/widgetPayloads';

interface CadenceWidgetProps {
  tasks: WidgetTask[];
  width: number;
  height: number;
}

// Size detection thresholds match Pixel widget cells (roughly):
// 2x2 ≈ 170dp square, 4x2 ≈ 360x170dp, 4x4 ≈ 360x360dp.
export function CadenceWidget({ tasks, width, height }: CadenceWidgetProps) {
  const isLarge = width >= 220 && height >= 220;
  const isMedium = !isLarge && width >= 220;

  if (isLarge) return <Large tasks={tasks} />;
  if (isMedium) return <Medium tasks={tasks} />;
  return <Small tasks={tasks} />;
}
