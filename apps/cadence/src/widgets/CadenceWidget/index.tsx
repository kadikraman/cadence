'use no memo';

import { FlexWidget } from 'react-native-android-widget';
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
  const isLarge = width >= 220 && height >= 300;
  const isMedium = !isLarge && width >= 220;

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{ width: 'match_parent', height: 'match_parent' }}
    >
      {isLarge ? (
        <Large tasks={tasks} />
      ) : isMedium ? (
        <Medium tasks={tasks} />
      ) : (
        <Small tasks={tasks} />
      )}
    </FlexWidget>
  );
}
