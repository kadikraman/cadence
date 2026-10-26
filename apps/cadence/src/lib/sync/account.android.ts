import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import type { ConnectResult } from './account';

export type { ConnectResult } from './account';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/drive.appdata'],
});

export async function connect(): Promise<ConnectResult> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();
  if (!isSuccessResponse(response)) return { type: 'cancelled' };
  return { type: 'success', account: response.data.user.email };
}

export async function disconnect(): Promise<void> {
  await GoogleSignin.signOut();
}

export async function getAccessToken(): Promise<string | null> {
  if (!GoogleSignin.getCurrentUser()) {
    const silent = await GoogleSignin.signInSilently();
    if (silent.type !== 'success') return null;
  }
  const { accessToken } = await GoogleSignin.getTokens();
  return accessToken;
}

export async function invalidateAccessToken(): Promise<void> {
  const { accessToken } = await GoogleSignin.getTokens();
  await GoogleSignin.clearCachedAccessToken(accessToken);
}
