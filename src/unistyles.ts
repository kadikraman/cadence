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
    groupedBackground: '#F2F2F7',
    surface: '#fafaff',
    surfaceElevated: '#FFFFFF',
    text: '#000',
    white: '#fff',
    textSecondary: '#666',
    textTertiary: '#999',
    label2: 'rgba(60,60,67,0.85)',
    label3: 'rgba(60,60,67,0.6)',
    label4: 'rgba(60,60,67,0.3)',
    sep: 'rgba(60,60,67,0.18)',
    sepSubtle: 'rgba(60,60,67,0.09)',
    fill1: 'rgba(120,120,128,0.20)',
    fill2: 'rgba(120,120,128,0.16)',
    fill3: 'rgba(120,120,128,0.12)',
    fill4: 'rgba(120,120,128,0.08)',
    overlay: 'rgba(0,0,0,0.35)',
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
    groupedBackground: '#000000',
    surface: '#1c1c1e',
    surfaceElevated: '#2C2C2E',
    text: '#fff',
    white: '#fff',
    textSecondary: '#a1a1a6',
    textTertiary: '#6e6e73',
    label2: 'rgba(235,235,245,0.85)',
    label3: 'rgba(235,235,245,0.6)',
    label4: 'rgba(235,235,245,0.3)',
    sep: 'rgba(84,84,88,0.65)',
    sepSubtle: 'rgba(84,84,88,0.35)',
    fill1: 'rgba(120,120,128,0.36)',
    fill2: 'rgba(120,120,128,0.32)',
    fill3: 'rgba(118,118,128,0.24)',
    fill4: 'rgba(118,118,128,0.18)',
    overlay: 'rgba(0,0,0,0.6)',
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
