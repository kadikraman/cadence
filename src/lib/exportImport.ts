import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
import { Task, normalizeTask, taskStorage } from './storage';

const SCHEMA = 'cadence-v1';

interface ExportEnvelope {
  schema: typeof SCHEMA;
  exportedAt: number;
  tasks: Task[];
}

function todayStamp(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function exportTasks(): Promise<void> {
  const tasks = await taskStorage.getAllTasks();
  const envelope: ExportEnvelope = {
    schema: SCHEMA,
    exportedAt: Date.now(),
    tasks,
  };
  const filename = `cadence-backup-${todayStamp()}.json`;
  const file = new File(Paths.cache, filename);
  if (file.exists) file.delete();
  file.create();
  file.write(JSON.stringify(envelope, null, 2));

  if (!(await Sharing.isAvailableAsync())) {
    Alert.alert('Sharing not available on this device.');
    return;
  }
  await Sharing.shareAsync(file.uri, {
    mimeType: 'application/json',
    UTI: 'public.json',
    dialogTitle: 'Export Cadence tasks',
  });
}

function isValidEnvelope(parsed: unknown): parsed is ExportEnvelope {
  if (!parsed || typeof parsed !== 'object') return false;
  const env = parsed as Partial<ExportEnvelope>;
  if (env.schema !== SCHEMA) return false;
  if (!Array.isArray(env.tasks)) return false;
  return env.tasks.every(
    t =>
      t &&
      typeof t.id === 'string' &&
      typeof t.title === 'string' &&
      t.cadence &&
      Array.isArray(t.completedDates)
  );
}

export interface ImportResult {
  imported: number;
  skipped: number;
  mode: 'replace' | 'merge';
}

async function applyImport(
  envelope: ExportEnvelope,
  mode: 'replace' | 'merge'
): Promise<ImportResult> {
  const normalized = envelope.tasks.map(normalizeTask);
  if (mode === 'replace') {
    const existing = await taskStorage.getAllTasks();
    for (const t of existing) await taskStorage.deleteTask(t.id);
    for (const t of normalized) await taskStorage.saveTask(t);
    return { imported: normalized.length, skipped: 0, mode };
  }
  const existing = await taskStorage.getAllTasks();
  const existingIds = new Set(existing.map(t => t.id));
  let imported = 0;
  let skipped = 0;
  for (const t of normalized) {
    if (existingIds.has(t.id)) {
      skipped++;
      continue;
    }
    await taskStorage.saveTask(t);
    imported++;
  }
  return { imported, skipped, mode };
}

export async function importTasks(): Promise<ImportResult | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type:
      Platform.OS === 'ios'
        ? ['application/json', 'public.json']
        : 'application/json',
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (result.canceled) return null;
  const asset = result.assets[0];
  if (!asset) return null;

  let envelope: ExportEnvelope;
  try {
    const file = new File(asset.uri);
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!isValidEnvelope(parsed)) {
      Alert.alert(
        'Unrecognized file',
        "That doesn't look like a Cadence backup. Pick a JSON file that was exported from Cadence."
      );
      return null;
    }
    envelope = parsed;
  } catch {
    Alert.alert('Import failed', 'Could not read the selected file.');
    return null;
  }

  return new Promise(resolve => {
    Alert.alert(
      `Import ${envelope.tasks.length} task${envelope.tasks.length === 1 ? '' : 's'}?`,
      'Replace overwrites everything. Merge adds only tasks you don\u2019t already have.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve(null),
        },
        {
          text: 'Merge',
          onPress: async () => resolve(await applyImport(envelope, 'merge')),
        },
        {
          text: 'Replace',
          style: 'destructive',
          onPress: async () => resolve(await applyImport(envelope, 'replace')),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(null) }
    );
  });
}
