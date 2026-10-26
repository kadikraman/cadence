import {
  CloudStorage,
  CloudStorageError,
  CloudStorageErrorCode,
  CloudStorageProvider,
  CloudStorageScope,
} from 'react-native-cloud-storage';
import { getAccessToken, invalidateAccessToken } from './account';
import { ParsedSyncDoc, SyncDoc, parseSyncDoc } from './syncDoc';

const DOC_PATH = 'cadence-sync.json';
const REQUEST_TIMEOUT_MS = 15000;

export type RemoteDoc = ParsedSyncDoc | { type: 'missing' };

if (CloudStorage.getProvider() === CloudStorageProvider.GoogleDrive) {
  CloudStorage.setProviderOptions({
    accessToken: getAccessToken,
    timeout: REQUEST_TIMEOUT_MS,
  });
}

function hasCode(err: unknown, code: CloudStorageErrorCode): boolean {
  return err instanceof CloudStorageError && err.code === code;
}

async function withAuthRetry<T>(op: () => Promise<T>): Promise<T> {
  try {
    return await op();
  } catch (err) {
    if (!hasCode(err, CloudStorageErrorCode.AUTHENTICATION_FAILED)) throw err;
    await invalidateAccessToken();
    return op();
  }
}

export function isCloudAvailable(): Promise<boolean> {
  return CloudStorage.isCloudAvailable();
}

export async function readRemoteDoc(): Promise<RemoteDoc> {
  return withAuthRetry(async () => {
    if (!(await CloudStorage.exists(DOC_PATH, CloudStorageScope.AppData))) {
      return { type: 'missing' };
    }
    try {
      const text = await CloudStorage.readFile(
        DOC_PATH,
        CloudStorageScope.AppData
      );
      return parseSyncDoc(text);
    } catch (err) {
      if (hasCode(err, CloudStorageErrorCode.FILE_NOT_FOUND)) {
        return { type: 'missing' };
      }
      throw err;
    }
  });
}

export async function writeRemoteDoc(doc: SyncDoc): Promise<void> {
  await withAuthRetry(() =>
    CloudStorage.writeFile(
      DOC_PATH,
      JSON.stringify(doc),
      CloudStorageScope.AppData
    )
  );
}
