import React, { createContext, useContext, useEffect } from 'react';
import { UnistylesRuntime, useUnistyles } from 'react-native-unistyles';
import { ThemeMode, useSettingsStore } from '../stores/settings';

interface Theme {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderLight: string;
  primary: string;
  primaryText: string;
  error: string;
  inputBackground: string;
  buttonInactive: string;
  buttonInactiveText: string;
}

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeMode(mode: ThemeMode) {
  if (mode === 'system') {
    UnistylesRuntime.setAdaptiveThemes(true);
  } else {
    UnistylesRuntime.setAdaptiveThemes(false);
    UnistylesRuntime.setTheme(mode);
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme: unistylesTheme } = useUnistyles();
  const themeMode = useSettingsStore(s => s.themeMode);
  const loaded = useSettingsStore(s => s.loaded);
  const setThemeModeInStore = useSettingsStore(s => s.setThemeMode);

  useEffect(() => {
    if (loaded) applyThemeMode(themeMode);
  }, [loaded, themeMode]);

  const setThemeMode = (mode: ThemeMode) => {
    applyThemeMode(mode);
    setThemeModeInStore(mode);
  };

  const isDark = UnistylesRuntime.themeName === 'dark';

  const theme: Theme = {
    background: unistylesTheme.colors.background,
    surface: unistylesTheme.colors.surface,
    text: unistylesTheme.colors.text,
    textSecondary: unistylesTheme.colors.textSecondary,
    textTertiary: unistylesTheme.colors.textTertiary,
    border: unistylesTheme.colors.border,
    borderLight: unistylesTheme.colors.borderLight,
    primary: unistylesTheme.colors.primary,
    primaryText: unistylesTheme.colors.primaryText,
    error: unistylesTheme.colors.error,
    inputBackground: unistylesTheme.colors.inputBackground,
    buttonInactive: unistylesTheme.colors.buttonInactive,
    buttonInactiveText: unistylesTheme.colors.buttonInactiveText,
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
