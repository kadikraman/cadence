import * as Sentry from '@sentry/react-native';
import { ReactNode, useEffect } from 'react';
import { AppState } from 'react-native';
import { logs } from '../lib/logs';
import { hasLocalChanges, runSync } from '../lib/sync/runSync';
import { useSyncStore } from '../stores/sync';
import { useTasksStore } from '../stores/tasks';
import { useTodosStore } from '../stores/todos';

const LOCAL_CHANGE_DELAY_MS = 3000;

function createSyncRunner() {
  let running: Promise<void> | null = null;
  let rerun = false;
  let disposed = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const syncOnce = async () => {
    const { setStatus, markSynced } = useSyncStore.getState();
    setStatus('syncing');
    try {
      const outcome = await runSync();
      if (disposed) return;
      if (outcome === 'synced') {
        await markSynced(Date.now());
        logs.syncCompleted();
      } else {
        setStatus(outcome);
      }
    } catch (err) {
      if (disposed) return;
      setStatus('error');
      Sentry.captureException(err);
      logs.syncFailed(err);
    }
  };

  const request = () => {
    if (disposed) return;
    if (running) {
      rerun = true;
      return;
    }
    running = (async () => {
      do {
        rerun = false;
        await syncOnce();
      } while (rerun && !disposed);
      running = null;
    })();
  };

  const requestIfChanged = async () => {
    timer = null;
    if (await hasLocalChanges()) request();
  };

  const requestSoon = () => {
    if (disposed) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(requestIfChanged, LOCAL_CHANGE_DELAY_MS);
  };

  const flush = () => {
    if (!timer) return;
    clearTimeout(timer);
    requestIfChanged();
  };

  const dispose = () => {
    disposed = true;
    if (timer) clearTimeout(timer);
  };

  return { request, requestSoon, flush, dispose };
}

export function SyncProvider({ children }: { children: ReactNode }) {
  const enabled = useSyncStore(s => s.enabled);

  useEffect(() => {
    if (!enabled) return;
    const runner = createSyncRunner();
    runner.request();

    const appState = AppState.addEventListener('change', state => {
      if (state === 'active') runner.request();
      else runner.flush();
    });
    const unsubscribeTasks = useTasksStore.subscribe((s, prev) => {
      if (s.tasks !== prev.tasks) runner.requestSoon();
    });
    const unsubscribeTodos = useTodosStore.subscribe((s, prev) => {
      if (s.todos !== prev.todos) runner.requestSoon();
    });

    return () => {
      runner.dispose();
      appState.remove();
      unsubscribeTasks();
      unsubscribeTodos();
    };
  }, [enabled]);

  return children;
}
