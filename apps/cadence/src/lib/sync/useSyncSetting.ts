import * as Sentry from '@sentry/react-native';
import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useSyncStore } from '../../stores/sync';
import { formatCompletionDate } from '../../utils/taskUtils';
import { logs } from '../logs';
import { connect, disconnect } from './account';
import { clearSyncBase } from './runSync';

export const SYNC_PROVIDER_NAME = Platform.select({
  android: 'Google Drive',
  default: 'iCloud',
});

export function useSyncSetting() {
  const enabled = useSyncStore(s => s.enabled);
  const status = useSyncStore(s => s.status);
  const account = useSyncStore(s => s.account);
  const lastSyncedAt = useSyncStore(s => s.lastSyncedAt);
  const enable = useSyncStore(s => s.enable);
  const disable = useSyncStore(s => s.disable);
  const [busy, setBusy] = useState(false);

  const setEnabled = useCallback(
    async (value: boolean) => {
      if (busy) return;
      setBusy(true);
      try {
        if (!value) {
          await disconnect();
          await clearSyncBase();
          await disable();
          logs.syncDisabled();
          return;
        }
        const result = await connect();
        if (result.type === 'unavailable') {
          Alert.alert(
            'iCloud is off',
            'Sign in to iCloud in the Settings app, then turn on sync again.'
          );
          return;
        }
        if (result.type === 'cancelled') return;
        await clearSyncBase();
        await enable(result.account);
        logs.syncEnabled();
      } catch (err) {
        Sentry.captureException(err);
        Alert.alert(
          value ? 'Could not turn on sync' : 'Could not turn off sync',
          'Try again in a moment.'
        );
      } finally {
        setBusy(false);
      }
    },
    [busy, enable, disable]
  );

  const statusText = !enabled
    ? `Off. Data is stored on this device only.`
    : status === 'syncing'
      ? 'Syncing…'
      : status === 'error'
        ? `Could not reach ${SYNC_PROVIDER_NAME}. Cadence will try again.`
        : status === 'unavailable'
          ? `${SYNC_PROVIDER_NAME} is not available on this device.`
          : status === 'unsupported'
            ? 'Update Cadence to keep syncing.'
            : lastSyncedAt
              ? `Last synced ${formatCompletionDate(lastSyncedAt)}`
              : 'Waiting to sync';

  return {
    enabled,
    status,
    account,
    statusText,
    busy,
    setEnabled,
  };
}
