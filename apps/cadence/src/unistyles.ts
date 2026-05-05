/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Platform } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
import type { ThemeMode } from './stores/settings';

const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

const isAndroid = Platform.OS === 'android';

const lightIOS = {
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
};

const darkIOS = {
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
};

// Material 3 (Material You) color roles for Android. Same semantic shape as
// the iOS palette — keys like `blue`, `surfaceElevated`, etc. map to Material
// equivalents so shared components render natively on both platforms.
const lightAndroid = {
  background: '#FEF7FF',
  groupedBackground: '#FEF7FF',
  surface: '#F7F2FA',
  surfaceElevated: '#F3EDF7',
  text: '#1D1B20',
  white: '#fff',
  textSecondary: '#49454F',
  textTertiary: '#79747E',
  label2: '#49454F',
  label3: '#79747E',
  label4: '#CAC4D0',
  sep: '#CAC4D0',
  sepSubtle: 'rgba(121,116,126,0.18)',
  fill1: 'rgba(29,27,32,0.14)',
  fill2: 'rgba(29,27,32,0.10)',
  fill3: 'rgba(29,27,32,0.07)',
  fill4: 'rgba(29,27,32,0.05)',
  overlay: 'rgba(0,0,0,0.4)',
  border: '#CAC4D0',
  borderLight: '#E7E0EC',
  primary: '#0061A4',
  primaryText: '#fff',
  error: '#BA1A1A',
  warning: '#B35C00',
  success: '#146C2E',
  blue: '#0061A4',
  inputBackground: '#F3EDF7',
  buttonInactive: '#F3EDF7',
  buttonInactiveText: '#49454F',
};

const darkAndroid = {
  background: '#141218',
  groupedBackground: '#141218',
  surface: '#1D1B20',
  surfaceElevated: '#211F26',
  text: '#E6E0E9',
  white: '#fff',
  textSecondary: '#CAC4D0',
  textTertiary: '#938F99',
  label2: '#CAC4D0',
  label3: '#938F99',
  label4: '#49454F',
  sep: '#49454F',
  sepSubtle: 'rgba(147,143,153,0.24)',
  fill1: 'rgba(230,224,233,0.16)',
  fill2: 'rgba(230,224,233,0.12)',
  fill3: 'rgba(230,224,233,0.08)',
  fill4: 'rgba(230,224,233,0.06)',
  overlay: 'rgba(0,0,0,0.6)',
  border: '#49454F',
  borderLight: '#3B3841',
  primary: '#9ECAFF',
  primaryText: '#003258',
  error: '#FFB4AB',
  warning: '#FFB77C',
  success: '#7DDC87',
  blue: '#9ECAFF',
  inputBackground: '#211F26',
  buttonInactive: '#2B2930',
  buttonInactiveText: '#CAC4D0',
};

// Material-only tokens used by Android primitives (FAB, Chip, top app bar).
// iOS gets benign fallbacks so any shared code that references them doesn't
// crash if mistakenly used on iOS.
const m3LightExtras = {
  onPrimary: '#FFFFFF',
  primaryContainer: '#D1E4FF',
  onPrimaryContainer: '#001D36',
  secondaryContainer: '#D7E3F8',
  onSecondaryContainer: '#101C2B',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',
  outline: '#79747E',
  outlineVariant: '#CAC4D0',
};

const m3DarkExtras = {
  onPrimary: '#003258',
  primaryContainer: '#00497D',
  onPrimaryContainer: '#D1E4FF',
  secondaryContainer: '#3B4858',
  onSecondaryContainer: '#D7E3F8',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',
  outline: '#938F99',
  outlineVariant: '#49454F',
};

const lightTheme = {
  colors: { ...(isAndroid ? lightAndroid : lightIOS), ...m3LightExtras },
  shadows,
};

const darkTheme = {
  colors: { ...(isAndroid ? darkAndroid : darkIOS), ...m3DarkExtras },
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

export function applyThemeMode(mode: ThemeMode) {
  if (mode === 'system') {
    UnistylesRuntime.setAdaptiveThemes(true);
  } else {
    UnistylesRuntime.setAdaptiveThemes(false);
    UnistylesRuntime.setTheme(mode);
  }
}
