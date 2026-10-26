import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type SyncStatus =
  | 'idle'
  | 'syncing'
  | 'error'
  | 'unavailable'
  | 'unsupported';

const STORAGE_KEY = 'sync';

interface SyncSettings {
  enabled: boolean;
  account?: string;
  lastSyncedAt?: number;
}

interface SyncStore extends SyncSettings {
  status: SyncStatus;
  loaded: boolean;
  load: () => Promise<void>;
  enable: (account?: string) => Promise<void>;
  disable: () => Promise<void>;
  markSynced: (at: number) => Promise<void>;
  setStatus: (status: SyncStatus) => void;
}

const DEFAULTS: SyncSettings = {
  enabled: false,
};

function pickSettings(store: SyncStore): SyncSettings {
  return {
    enabled: store.enabled,
    account: store.account,
    lastSyncedAt: store.lastSyncedAt,
  };
}

async function persist(settings: SyncSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export const useSyncStore = create<SyncStore>((set, get) => {
  const updateAndPersist = async (
    patch: Partial<SyncSettings> & { status?: SyncStatus }
  ): Promise<void> => {
    set(patch);
    await persist(pickSettings(get()));
  };

  return {
    ...DEFAULTS,
    status: 'idle',
    loaded: false,

    load: async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (!json) {
          set({ loaded: true });
          return;
        }
        const parsed = JSON.parse(json) as Partial<SyncSettings>;
        set({
          enabled: !!parsed.enabled,
          account:
            typeof parsed.account === 'string' ? parsed.account : undefined,
          lastSyncedAt:
            typeof parsed.lastSyncedAt === 'number'
              ? parsed.lastSyncedAt
              : undefined,
          loaded: true,
        });
      } catch {
        set({ loaded: true });
      }
    },

    enable: account =>
      updateAndPersist({ enabled: true, account, status: 'idle' }),
    disable: () =>
      updateAndPersist({
        enabled: false,
        account: undefined,
        lastSyncedAt: undefined,
        status: 'idle',
      }),
    markSynced: at => updateAndPersist({ lastSyncedAt: at, status: 'idle' }),
    setStatus: status => set({ status }),
  };
});
