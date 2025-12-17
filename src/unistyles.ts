/* eslint-disable @typescript-eslint/no-empty-object-type */
import { StyleSheet } from 'react-native-unistyles';

const lightTheme = {
  colors: {
    background: '#fafafa',
    surface: '#fff',
    text: '#000',
    textSecondary: '#666',
    textTertiary: '#999',
    border: '#e0e0e0',
    borderLight: '#f5f5f5',
    primary: '#000',
    primaryText: '#fff',
    error: '#FF3B30',
    inputBackground: '#ededed',
    buttonInactive: '#f5f5f5',
    buttonInactiveText: '#666',
  },
};

const darkTheme = {
  colors: {
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
  },
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
