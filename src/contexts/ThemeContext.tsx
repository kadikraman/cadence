import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const lightTheme: Theme = {
  background: '#fafafa',
  surface: '#fff',
  text: '#000',
  textSecondary: '#666',
  textTertiary: '#999',
  border: '#f0f0f0',
  borderLight: '#f5f5f5',
  primary: '#000',
  primaryText: '#fff',
  error: '#FF3B30',
  inputBackground: '#fafafa',
  buttonInactive: '#f5f5f5',
  buttonInactiveText: '#666',
};

const darkTheme: Theme = {
  background: '#000',
  surface: '#1c1c1e',
  text: '#fff',
  textSecondary: '#a1a1a6',
  textTertiary: '#6e6e73',
  border: '#2c2c2e',
  borderLight: '#3a3a3c',
  primary: '#636366',
  primaryText: '#fff',
  error: '#ff453a',
  inputBackground: '#1c1c1e',
  buttonInactive: '#2c2c2e',
  buttonInactiveText: '#a1a1a6',
};

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    loadThemeMode();
  }, []);

  const loadThemeMode = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setThemeModeState(saved);
      }
    } catch {
    } finally {
      setIsInitialized(true);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
    }
  };

  const isDark =
    themeMode === 'dark' ||
    (themeMode === 'system' && systemColorScheme === 'dark');

  const theme = isDark ? darkTheme : lightTheme;

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

