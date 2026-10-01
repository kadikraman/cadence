import type { WidgetTaskPayload } from '../lib/widgetPayloads';
import { getTodayTimestamp, MS_DAY } from '../utils/taskUtils';
import CadenceWidget from './ios/CadenceWidget';
import { buildIosSnapshot } from './iosWidgetSnapshot';

const TIMELINE_DAYS = 30;

export function updateIosWidget(tasks: WidgetTaskPayload[]) {
  const todayMidnight = getTodayTimestamp();
  const entries = Array.from({ length: TIMELINE_DAYS }, (_, day) => ({
    date: new Date(day === 0 ? Date.now() : todayMidnight + day * MS_DAY),
    props: buildIosSnapshot(tasks, todayMidnight + day * MS_DAY),
  }));
  CadenceWidget.updateTimeline(entries);
}

export function reloadIosWidget() {
  CadenceWidget.reload();
}
