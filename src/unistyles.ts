/* eslint-disable @typescript-eslint/no-empty-object-type */
import { StyleSheet } from 'react-native-unistyles';

const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

const lightTheme = {
  colors: {
    background: '#ffffff',
    surface: '#fafaff',
    text: '#000',
    white: '#fff',
    textSecondary: '#666',
    textTertiary: '#999',
    border: '#e0e0e0',
    borderLight: '#f5f5f5',
    primary: '#000',
    primaryText: '#fff',
    error: '#FF3B30',
    warning: '#FF9500',
    success: '#34C759',
    blue: '#007AFF',
    inputBackground: '#ededed',
    buttonInactive: '#f5f5f5',
    buttonInactiveText: '#666',
  },
  shadows,
};

const darkTheme = {
  colors: {
    background: '#000000',
    surface: '#1c1c1e',
    text: '#fff',
    white: '#fff',
    textSecondary: '#a1a1a6',
    textTertiary: '#6e6e73',
    border: '#2c2c2e',
    borderLight: '#3a3a3c',
    primary: '#636366',
    primaryText: '#fff',
    error: '#ff453a',
    warning: '#FF9F0A',
    success: '#30D158',
    blue: '#0A84FF',
    inputBackground: '#1c1c1e',
    buttonInactive: '#2c2c2e',
    buttonInactiveText: '#a1a1a6',
  },
  shadows,
};

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};

const breakpoints = {
  xs: 0,
  sm: 300,
  md: 500,
  lg: 800,
  xl: 1200,
};

type AppThemes = typeof appThemes;
type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  themes: appThemes,
  breakpoints,
  settings: {
    adaptiveThemes: true,
  },
});
