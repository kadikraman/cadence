import * as Sentry from '@sentry/react-native';
import ExpoObserve, { ObserveRoot, useObserve } from 'expo-observe';
import { Stack } from 'expo-router';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as ReactNativeThemeProvider,
} from 'expo-router/react-navigation';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useUnistyles } from 'react-native-unistyles';
import { useSettingsStore } from '../stores/settings';
import { useTasksStore } from '../stores/tasks';
import { applyThemeMode } from '../unistyles';

SplashScreen.preventAutoHideAsync().catch(() => {});

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: !__DEV__,
  sendDefaultPii: false,
});

ExpoObserve.configure({
  environment: __DEV__ ? 'development' : 'production',
});

function RootLayoutNav() {
  const { rt } = useUnistyles();
  const { markInteractive } = useObserve();
  const isDark = rt.themeName === 'dark';

  const tasksLoaded = useTasksStore(s => s.loaded);
  const loadTasks = useTasksStore(s => s.load);
  const settingsLoaded = useSettingsStore(s => s.loaded);
  const loadSettings = useSettingsStore(s => s.load);
  const onboardingSeen = useSettingsStore(s => s.onboardingSeen);
  const themeMode = useSettingsStore(s => s.themeMode);

  useEffect(() => {
    loadTasks();
    loadSettings();
  }, [loadTasks, loadSettings]);

  useEffect(() => {
    if (settingsLoaded) applyThemeMode(themeMode);
  }, [settingsLoaded, themeMode]);

  useEffect(() => {
    if (tasksLoaded && settingsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
      markInteractive();
    }
  }, [tasksLoaded, settingsLoaded, markInteractive]);

  if (!tasksLoaded || !settingsLoaded) return null;

  return (
    <ReactNativeThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Protected guard={onboardingSeen}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="new" options={{ presentation: 'modal' }} />
          <Stack.Screen name="task/[taskId]" />
          <Stack.Screen name="stats" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="feedback" />
        </Stack.Protected>
        <Stack.Screen
          name="onboarding"
          options={{ headerShown: false, presentation: 'modal' }}
        />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ReactNativeThemeProvider>
  );
}

function RootLayout(_props: Record<string, unknown>) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <RootLayoutNav />
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(ObserveRoot.wrap(RootLayout));
