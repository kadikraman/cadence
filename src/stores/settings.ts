import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'settings';

interface Settings {
  themeMode: ThemeMode;
  onboardingSeen: boolean;
  widgetNudgeDismissed: boolean;
}

interface SettingsStore extends Settings {
  loaded: boolean;
  load: () => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setOnboardingSeen: () => Promise<void>;
  dismissWidgetNudge: () => Promise<void>;
}

const DEFAULTS: Settings = {
  themeMode: 'system',
  onboardingSeen: false,
  widgetNudgeDismissed: false,
};

function pickSettings(store: SettingsStore): Settings {
  return {
    themeMode: store.themeMode,
    onboardingSeen: store.onboardingSeen,
    widgetNudgeDismissed: store.widgetNudgeDismissed,
  };
}

async function persist(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...DEFAULTS,
  loaded: false,

  load: async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (!json) {
        set({ loaded: true });
        return;
      }
      const parsed = JSON.parse(json) as Partial<Settings>;
      set({
        themeMode:
          parsed.themeMode === 'light' ||
          parsed.themeMode === 'dark' ||
          parsed.themeMode === 'system'
            ? parsed.themeMode
            : DEFAULTS.themeMode,
        onboardingSeen: !!parsed.onboardingSeen,
        widgetNudgeDismissed: !!parsed.widgetNudgeDismissed,
        loaded: true,
      });
    } catch {
      set({ loaded: true });
    }
  },

  setThemeMode: async mode => {
    set({ themeMode: mode });
    await persist(pickSettings(get()));
  },

  setOnboardingSeen: async () => {
    set({ onboardingSeen: true });
    await persist(pickSettings(get()));
  },

  dismissWidgetNudge: async () => {
    set({ widgetNudgeDismissed: true });
    await persist(pickSettings(get()));
  },
}));
