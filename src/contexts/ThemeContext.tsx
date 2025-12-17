import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UnistylesRuntime, useUnistyles } from 'react-native-unistyles';

type ThemeMode = 'light' | 'dark' | 'system';

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

const THEME_STORAGE_KEY = 'theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme: unistylesTheme } = useUnistyles();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    loadThemeMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadThemeMode = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setThemeModeState(saved);
        applyThemeMode(saved);
      }
    } catch {
    } finally {
      setIsInitialized(true);
    }
  };

  const applyThemeMode = (mode: ThemeMode) => {
    if (mode === 'system') {
      UnistylesRuntime.setAdaptiveThemes(true);
    } else {
      UnistylesRuntime.setAdaptiveThemes(false);
      UnistylesRuntime.setTheme(mode);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    applyThemeMode(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {}
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

  if (!isInitialized) {
    return null;
  }

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
