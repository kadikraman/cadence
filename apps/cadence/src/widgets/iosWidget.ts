import * as Sentry from '@sentry/react-native';
import { logs } from '../lib/logs';
import type { WidgetTaskPayload } from '../lib/widgetPayloads';
import { getTodayTimestamp, MS_DAY } from '../utils/taskUtils';
import CadenceWidget from './ios/CadenceWidget';
import { buildIosSnapshot } from './iosWidgetSnapshot';

const TIMELINE_DAYS = 30;

let lastPushedSignature: string | null = null;

export function updateIosWidget(tasks: WidgetTaskPayload[]) {
  const todayMidnight = getTodayTimestamp();
  const signature = JSON.stringify([todayMidnight, tasks]);
  if (signature === lastPushedSignature) {
    return;
  }
  const entries = Array.from({ length: TIMELINE_DAYS }, (_, day) => ({
    date: new Date(day === 0 ? Date.now() : todayMidnight + day * MS_DAY),
    props: buildIosSnapshot(tasks, todayMidnight + day * MS_DAY),
  }));
  try {
    CadenceWidget.updateTimeline(entries);
  } catch (err) {
    Sentry.captureException(err);
    logs.widgetTimelineFailed(err);
    return;
  }
  lastPushedSignature = signature;
  logs.widgetTimelineUpdated();
  CadenceWidget.getTimeline()
    .then(stored => {
      if (stored.length === 0) {
        Sentry.captureException(new Error('Widget timeline was not stored'));
        logs.widgetTimelineMissing();
      }
    })
    .catch(err => {
      Sentry.captureException(err);
      logs.widgetTimelineFailed(err);
    });
}

export function reloadIosWidget() {
  CadenceWidget.reload();
}
