import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';
export type HomeTab = 'tasks' | 'todo';
export type StatsRange = '7' | '30' | '90' | '365';

const STATS_RANGES: StatsRange[] = ['7', '30', '90', '365'];

const STORAGE_KEY = 'settings';

interface Settings {
  themeMode: ThemeMode;
  onboardingSeen: boolean;
  widgetNudgeDismissed: boolean;
  weekStartsOnMonday: boolean;
  todosEnabled: boolean;
  homeTab: HomeTab;
  statsRange: StatsRange;
}

interface SettingsStore extends Settings {
  loaded: boolean;
  load: () => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setOnboardingSeen: () => Promise<void>;
  dismissWidgetNudge: () => Promise<void>;
  setWeekStartsOnMonday: (value: boolean) => Promise<void>;
  setTodosEnabled: (value: boolean) => Promise<void>;
  setHomeTab: (tab: HomeTab) => Promise<void>;
  setStatsRange: (range: StatsRange) => Promise<void>;
}

const DEFAULTS: Settings = {
  themeMode: 'system',
  onboardingSeen: false,
  widgetNudgeDismissed: false,
  weekStartsOnMonday: true,
  todosEnabled: false,
  homeTab: 'tasks',
  statsRange: '30',
};

function pickSettings(store: SettingsStore): Settings {
  return {
    themeMode: store.themeMode,
    onboardingSeen: store.onboardingSeen,
    widgetNudgeDismissed: store.widgetNudgeDismissed,
    weekStartsOnMonday: store.weekStartsOnMonday,
    todosEnabled: store.todosEnabled,
    homeTab: store.homeTab,
    statsRange: store.statsRange,
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
          todosEnabled: !!parsed.todosEnabled,
          homeTab: parsed.homeTab === 'todo' ? 'todo' : DEFAULTS.homeTab,
          statsRange: STATS_RANGES.includes(parsed.statsRange as StatsRange)
            ? (parsed.statsRange as StatsRange)
            : DEFAULTS.statsRange,
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
    setTodosEnabled: value => updateAndPersist({ todosEnabled: value }),
    setHomeTab: tab => updateAndPersist({ homeTab: tab }),
    setStatsRange: range => updateAndPersist({ statsRange: range }),
  };
});
