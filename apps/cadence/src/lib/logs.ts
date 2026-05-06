// Structured-log helpers for analytics-grade events.
//
// Privacy contract (apps/marketing/app/privacy.tsx):
//   - We collect anonymous crash reports + aggregate performance metrics.
//   - We do NOT collect task names, contents, schedules (cadence), or the
//     history of when tasks are ticked off. Settings stay on device.
//
// Therefore: bare event firings here act as aggregate counters, but the
// per-event `attributes` map MUST NOT include cadence type/value, color,
// glyph, completion timing, task counts, or settings values. Helpers in this
// file are the only path that should call AppMetrics.logEvent so the policy
// can be reviewed in one place.

import { AppMetrics } from 'expo-observe';

type FeedbackKind = 'feedback' | 'feature' | 'bug';
type WidgetDismissReason = 'dismiss' | 'learn_more';

function errorReason(err: unknown): string {
  if (err instanceof Error) return err.constructor.name;
  return 'Unknown';
}

export const logs = {
  onboardingCompleted: (replayed: boolean) =>
    AppMetrics.logEvent('onboarding.completed', {
      attributes: { replayed },
    }),

  onboardingSkipped: (step: number) =>
    AppMetrics.logEvent('onboarding.skipped', {
      attributes: { step },
    }),

  taskCreated: (fromStarter: boolean) =>
    AppMetrics.logEvent('task.created', {
      attributes: { fromStarter },
    }),

  taskCompleted: () => AppMetrics.logEvent('task.completed'),

  taskUncompleted: () => AppMetrics.logEvent('task.uncompleted'),

  taskDeleted: () => AppMetrics.logEvent('task.deleted'),

  widgetNudgeDismissed: (via: WidgetDismissReason) =>
    AppMetrics.logEvent('widget.nudge_dismissed', {
      attributes: { via },
    }),

  settingsExportCompleted: () =>
    AppMetrics.logEvent('settings.export_completed'),

  settingsImportCompleted: () =>
    AppMetrics.logEvent('settings.import_completed'),

  feedbackSendFailed: (kind: FeedbackKind, err: unknown) =>
    AppMetrics.logEvent('feedback.send_failed', {
      severity: 'warn',
      attributes: { kind, reason: errorReason(err) },
    }),

  settingsRateFailed: (err: unknown) =>
    AppMetrics.logEvent('settings.rate_failed', {
      severity: 'warn',
      attributes: { reason: errorReason(err) },
    }),

  settingsExportFailed: (err: unknown) =>
    AppMetrics.logEvent('settings.export_failed', {
      severity: 'warn',
      attributes: { reason: errorReason(err) },
    }),

  settingsImportFailed: (err: unknown) =>
    AppMetrics.logEvent('settings.import_failed', {
      severity: 'warn',
      attributes: { reason: errorReason(err) },
    }),
};
