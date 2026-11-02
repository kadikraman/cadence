import * as Sentry from '@sentry/react-native';
import * as Application from 'expo-application';
import * as StoreReview from 'expo-store-review';
import { AppState, Linking, Platform } from 'react-native';
import { useReviewPromptStore } from '../stores/reviewPrompt';
import { shouldRequestReview } from '../stores/reviewPromptReducers';
import { useSyncStore } from '../stores/sync';
import { getTodayTimestamp } from '../utils/taskUtils';
import { logs } from './logs';

const PROMPT_DELAY_MS = 1500;
const MIN_SESSION_MS = 10000;

let requestedThisSession = false;

async function requestReviewIfDue(onTime: boolean): Promise<void> {
  if (requestedThisSession) return;
  if (AppState.currentState !== 'active') return;
  if (useSyncStore.getState().status === 'error') return;

  const store = useReviewPromptStore.getState();
  if (
    store.sessionStartedAt === null ||
    Date.now() - store.sessionStartedAt < MIN_SESSION_MS
  ) {
    return;
  }

  const today = getTodayTimestamp();
  const version = Application.nativeApplicationVersion;
  if (!shouldRequestReview(store, { today, version, onTime })) return;

  requestedThisSession = true;
  if (!(await StoreReview.isAvailableAsync())) return;
  await store.recordPrompt(today, version);
  logs.reviewRequested();
  await StoreReview.requestReview();
}

export function noteTaskCompletedForReview(onTime: boolean): void {
  useReviewPromptStore
    .getState()
    .recordCompletion()
    .then(() => {
      setTimeout(() => {
        requestReviewIfDue(onTime).catch(err => {
          Sentry.captureException(err);
          logs.reviewRequestFailed(err);
        });
      }, PROMPT_DELAY_MS);
    })
    .catch(err => Sentry.captureException(err));
}

export async function openStoreReviewPage(): Promise<void> {
  const url = StoreReview.storeUrl();
  if (!url) return;
  await Linking.openURL(
    Platform.OS === 'ios' ? `${url}?action=write-review` : url
  );
  await useReviewPromptStore.getState().recordRated();
}
