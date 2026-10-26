import { Task, Todo } from '../types';

export const SYNC_SCHEMA = 'cadence-sync-v1';

export interface SyncData {
  tasks: Task[];
  todos: Todo[];
}

export interface SyncDoc extends SyncData {
  schema: typeof SYNC_SCHEMA;
  updatedAt: number;
}

export type ParsedSyncDoc =
  | { type: 'ok'; doc: SyncDoc }
  | { type: 'unsupported' }
  | { type: 'invalid' };

export interface SyncPlan {
  merged: SyncData;
  writeLocal: boolean;
  writeRemote: boolean;
  saveBase: boolean;
}

type Json = unknown;

export function isEqual(a: Json, b: Json): boolean {
  if (a === b) return true;
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    return a.every((v, i) => isEqual(v, b[i]));
  }
  if (
    a === null ||
    b === null ||
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    Array.isArray(b)
  ) {
    return false;
  }
  const ao = a as Record<string, Json>;
  const bo = b as Record<string, Json>;
  const keys = new Set([...Object.keys(ao), ...Object.keys(bo)]);
  for (const k of keys) {
    if (!isEqual(ao[k], bo[k])) return false;
  }
  return true;
}

function mergeFields<T extends object>(
  base: T | undefined,
  local: T,
  remote: T
): T {
  const b = base as Record<string, Json> | undefined;
  const l = local as Record<string, Json>;
  const r = remote as Record<string, Json>;
  const keys = new Set([...Object.keys(l), ...Object.keys(r)]);
  const out: Record<string, Json> = {};
  for (const k of keys) {
    const lv = l[k];
    const rv = r[k];
    let v: Json;
    if (isEqual(lv, rv)) v = lv;
    else if (b && isEqual(lv, b[k])) v = rv;
    else v = lv;
    if (v !== undefined) out[k] = v;
  }
  return out as T;
}

function mergeDateSets(
  base: number[] | undefined,
  local: number[],
  remote: number[]
): number[] {
  const b = new Set(base ?? []);
  const l = new Set(local);
  const r = new Set(remote);
  const out = new Set<number>();
  for (const d of b) if (l.has(d) && r.has(d)) out.add(d);
  for (const d of l) if (!b.has(d)) out.add(d);
  for (const d of r) if (!b.has(d)) out.add(d);
  return [...out].sort((x, y) => y - x);
}

function mergeTask(base: Task | undefined, local: Task, remote: Task): Task {
  const merged = mergeFields(base, local, remote);
  const localDates = local.completedDates ?? [];
  const remoteDates = remote.completedDates ?? [];
  if (isEqual(localDates, remoteDates)) return merged;
  const baseDates = base?.completedDates;
  const bothChanged =
    !baseDates ||
    (!isEqual(localDates, baseDates) && !isEqual(remoteDates, baseDates));
  if (!bothChanged) return merged;
  const completedDates = mergeDateSets(baseDates, localDates, remoteDates);
  const dueDates = [local.nextDueDate, remote.nextDueDate].filter(
    (d): d is number => d !== undefined
  );
  const result: Task = {
    ...merged,
    completedDates,
    lastCompletedAt: completedDates[0],
    nextDueDate: dueDates.length > 0 ? Math.max(...dueDates) : undefined,
  };
  if (result.lastCompletedAt === undefined) delete result.lastCompletedAt;
  if (result.nextDueDate === undefined) delete result.nextDueDate;
  return result;
}

function mergeRecords<T extends { id: string }>(
  base: T[] | null,
  local: T[],
  remote: T[],
  merge: (base: T | undefined, local: T, remote: T) => T
): T[] {
  const baseById = new Map((base ?? []).map(x => [x.id, x]));
  const localById = new Map(local.map(x => [x.id, x]));
  const remoteById = new Map(remote.map(x => [x.id, x]));
  const out: T[] = [];

  for (const l of local) {
    const b = baseById.get(l.id);
    const r = remoteById.get(l.id);
    if (r) {
      if (isEqual(l, r)) out.push(l);
      else if (b && isEqual(l, b)) out.push(r);
      else if (b && isEqual(r, b)) out.push(l);
      else out.push(merge(b, l, r));
    } else if (!b || !isEqual(l, b)) {
      out.push(l);
    }
  }

  for (const r of remote) {
    if (localById.has(r.id)) continue;
    const b = baseById.get(r.id);
    if (!b || !isEqual(r, b)) out.push(r);
  }

  return out;
}

export function mergeSyncData(
  base: SyncData | null,
  local: SyncData,
  remote: SyncData
): SyncData {
  return {
    tasks: mergeRecords(
      base?.tasks ?? null,
      local.tasks,
      remote.tasks,
      mergeTask
    ),
    todos: mergeRecords(
      base?.todos ?? null,
      local.todos,
      remote.todos,
      mergeFields
    ),
  };
}

export function isEmpty(data: SyncData): boolean {
  return data.tasks.length === 0 && data.todos.length === 0;
}

export function planSync(
  base: SyncData | null,
  local: SyncData,
  remote: SyncData | null
): SyncPlan {
  if (!remote) {
    const writeRemote = !(base === null && isEmpty(local));
    return {
      merged: local,
      writeLocal: false,
      writeRemote,
      saveBase: writeRemote,
    };
  }
  const merged = mergeSyncData(base, local, remote);
  return {
    merged,
    writeLocal: !isEqual(merged, local),
    writeRemote: !isEqual(merged, remote),
    saveBase: true,
  };
}

export function toSyncDoc(data: SyncData, now: number): SyncDoc {
  return {
    schema: SYNC_SCHEMA,
    updatedAt: now,
    tasks: data.tasks,
    todos: data.todos,
  };
}

export function parseSyncDoc(text: string): ParsedSyncDoc {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { type: 'invalid' };
  }
  if (!parsed || typeof parsed !== 'object') return { type: 'invalid' };
  const doc = parsed as Partial<SyncDoc>;
  if (typeof doc.schema !== 'string') return { type: 'invalid' };
  if (doc.schema !== SYNC_SCHEMA) return { type: 'unsupported' };
  const validTasks =
    Array.isArray(doc.tasks) &&
    doc.tasks.every(
      t =>
        t &&
        typeof t.id === 'string' &&
        typeof t.title === 'string' &&
        t.cadence &&
        Array.isArray(t.completedDates)
    );
  const validTodos =
    Array.isArray(doc.todos) &&
    doc.todos.every(
      t => t && typeof t.id === 'string' && typeof t.title === 'string'
    );
  if (!validTasks || !validTodos) return { type: 'invalid' };
  return { type: 'ok', doc: doc as SyncDoc };
}
