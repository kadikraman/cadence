import * as Sentry from '@sentry/react-native';
import { Observe, ObserveRoot, useObserve } from 'expo-observe';
import { Stack } from 'expo-router';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as ReactNativeThemeProvider,
} from 'expo-router/react-navigation';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useUnistyles } from 'react-native-unistyles';
import { SyncProvider } from '../contexts/SyncProvider';
import { useSettingsStore } from '../stores/settings';
import { useSyncStore } from '../stores/sync';
import { useTasksStore } from '../stores/tasks';
import { useTodosStore } from '../stores/todos';
import { applyThemeMode } from '../unistyles';

const IOS_HEADER = Platform.OS === 'ios';

SplashScreen.preventAutoHideAsync().catch(() => {});

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: !__DEV__,
  sendDefaultPii: false,
});

Observe.configure({
  environment:
    process.env.EXPO_PUBLIC_OBSERVE_ENVIRONMENT ??
    (__DEV__ ? 'development' : 'production'),
  integrations: {
    'expo-router': true,
  },
});

function RootLayoutNav() {
  const { theme, rt } = useUnistyles();
  const { markInteractive } = useObserve();
  const isDark = rt.themeName === 'dark';

  const tasksLoaded = useTasksStore(s => s.loaded);
  const loadTasks = useTasksStore(s => s.load);
  const todosLoaded = useTodosStore(s => s.loaded);
  const loadTodos = useTodosStore(s => s.load);
  const settingsLoaded = useSettingsStore(s => s.loaded);
  const loadSettings = useSettingsStore(s => s.load);
  const syncLoaded = useSyncStore(s => s.loaded);
  const loadSync = useSyncStore(s => s.load);
  const onboardingSeen = useSettingsStore(s => s.onboardingSeen);
  const themeMode = useSettingsStore(s => s.themeMode);

  useEffect(() => {
    loadTasks();
    loadTodos();
    loadSettings();
    loadSync();
  }, [loadTasks, loadTodos, loadSettings, loadSync]);

  useEffect(() => {
    if (settingsLoaded) applyThemeMode(themeMode);
  }, [settingsLoaded, themeMode]);

  useEffect(() => {
    if (tasksLoaded && todosLoaded && settingsLoaded && syncLoaded) {
      SplashScreen.hideAsync().catch(() => {});
      markInteractive();
    }
  }, [tasksLoaded, todosLoaded, settingsLoaded, syncLoaded, markInteractive]);

  if (!tasksLoaded || !todosLoaded || !settingsLoaded || !syncLoaded) {
    return null;
  }

  return (
    <ReactNativeThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <SyncProvider>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: theme.colors.groupedBackground },
          }}
        >
          <Stack.Protected guard={onboardingSeen}>
            <Stack.Screen name="index" options={{ headerShown: IOS_HEADER }} />
            <Stack.Screen
              name="new"
              options={{
                presentation: 'modal',
                headerTransparent: IOS_HEADER,
              }}
            />
            <Stack.Screen name="task/[taskId]" />
            <Stack.Screen name="stats" options={{ headerShown: IOS_HEADER }} />
            <Stack.Screen
              name="settings"
              options={{ headerShown: IOS_HEADER }}
            />
            <Stack.Screen
              name="archived"
              options={{ headerShown: IOS_HEADER }}
            />
            <Stack.Screen
              name="feedback"
              options={{ headerTransparent: IOS_HEADER }}
            />
          </Stack.Protected>
          <Stack.Screen
            name="onboarding"
            options={{
              headerShown: false,
              presentation: 'modal',
              gestureEnabled: onboardingSeen,
            }}
          />
        </Stack>
      </SyncProvider>
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
