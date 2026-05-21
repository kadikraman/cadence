import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'settings';

interface Settings {
  themeMode: ThemeMode;
  onboardingSeen: boolean;
  widgetNudgeDismissed: boolean;
  weekStartsOnMonday: boolean;
}

interface SettingsStore extends Settings {
  loaded: boolean;
  load: () => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setOnboardingSeen: () => Promise<void>;
  dismissWidgetNudge: () => Promise<void>;
  setWeekStartsOnMonday: (value: boolean) => Promise<void>;
}

const DEFAULTS: Settings = {
  themeMode: 'system',
  onboardingSeen: false,
  widgetNudgeDismissed: false,
  weekStartsOnMonday: true,
};

function pickSettings(store: SettingsStore): Settings {
  return {
    themeMode: store.themeMode,
    onboardingSeen: store.onboardingSeen,
    widgetNudgeDismissed: store.widgetNudgeDismissed,
    weekStartsOnMonday: store.weekStartsOnMonday,
  };
}

async function persist(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export const useSettingsStore = create<SettingsStore>((set, get) => {
  const updateAndPersist = async (patch: Partial<Settings>): Promise<void> => {
    set(patch);
    await persist(pickSettings(get()));
  };

  return {
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
          weekStartsOnMonday:
            typeof parsed.weekStartsOnMonday === 'boolean'
              ? parsed.weekStartsOnMonday
              : DEFAULTS.weekStartsOnMonday,
          loaded: true,
        });
      } catch {
        set({ loaded: true });
      }
    },

    setThemeMode: mode => updateAndPersist({ themeMode: mode }),
    setOnboardingSeen: () => updateAndPersist({ onboardingSeen: true }),
    dismissWidgetNudge: () => updateAndPersist({ widgetNudgeDismissed: true }),
    setWeekStartsOnMonday: value =>
      updateAndPersist({ weekStartsOnMonday: value }),
  };
});
