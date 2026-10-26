import { CloudStorage } from 'react-native-cloud-storage';

export type ConnectResult =
  | { type: 'success'; account?: string }
  | { type: 'cancelled' }
  | { type: 'unavailable' };

export async function connect(): Promise<ConnectResult> {
  return (await CloudStorage.isCloudAvailable())
    ? { type: 'success' }
    : { type: 'unavailable' };
}

export async function disconnect(): Promise<void> {}

export async function getAccessToken(): Promise<string | null> {
  return null;
}

export async function invalidateAccessToken(): Promise<void> {}
