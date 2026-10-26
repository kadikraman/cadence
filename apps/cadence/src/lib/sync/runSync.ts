import AsyncStorage from '@react-native-async-storage/async-storage';
import { replaceAll as normalizeTasks } from '../../stores/taskReducers';
import { useTasksStore } from '../../stores/tasks';
import { useTodosStore } from '../../stores/todos';
import { isCloudAvailable, readRemoteDoc, writeRemoteDoc } from './cloud';
import { SyncData, isEmpty, isEqual, planSync, toSyncDoc } from './syncDoc';

const BASE_KEY = 'syncBase';
const FIRST_SYNC_RECHECK_MS = 5000;

export type SyncOutcome = 'synced' | 'unavailable' | 'unsupported';

export class InvalidSyncDocError extends Error {}

function readLocal(): SyncData {
  return {
    tasks: useTasksStore.getState().tasks,
    todos: useTodosStore.getState().todos,
  };
}

async function loadBase(): Promise<SyncData | null> {
  const json = await AsyncStorage.getItem(BASE_KEY);
  return json ? (JSON.parse(json) as SyncData) : null;
}

export async function clearSyncBase(): Promise<void> {
  await AsyncStorage.removeItem(BASE_KEY);
}

export async function hasLocalChanges(): Promise<boolean> {
  const base = await loadBase();
  return !base || !isEqual(base, readLocal());
}

const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

export async function runSync(): Promise<SyncOutcome> {
  if (!(await isCloudAvailable())) return 'unavailable';
  const base = await loadBase();
  let remote = await readRemoteDoc();
  if (remote.type === 'missing' && base === null && !isEmpty(readLocal())) {
    await delay(FIRST_SYNC_RECHECK_MS);
    remote = await readRemoteDoc();
  }
  if (remote.type === 'unsupported') return 'unsupported';
  if (remote.type === 'invalid') throw new InvalidSyncDocError();

  const remoteData =
    remote.type === 'ok'
      ? { tasks: normalizeTasks(remote.doc.tasks), todos: remote.doc.todos }
      : null;
  const plan = planSync(base, readLocal(), remoteData);
  if (plan.writeLocal) {
    await Promise.all([
      useTasksStore.getState().replaceAll(plan.merged.tasks),
      useTodosStore.getState().replaceAll(plan.merged.todos),
    ]);
  }
  if (plan.writeRemote) {
    await writeRemoteDoc(toSyncDoc(plan.merged, Date.now()));
  }
  if (plan.saveBase) {
    await AsyncStorage.setItem(BASE_KEY, JSON.stringify(plan.merged));
  }
  return 'synced';
}
