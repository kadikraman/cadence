import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as ReactNativeThemeProvider,
} from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { AppMetrics, AppMetricsRoot } from 'expo-observe';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  OnboardingProvider,
  useOnboarding,
} from '../contexts/OnboardingContext';
import {
  ThemeProvider as UnistylesThemeProvider,
  useTheme,
} from '../contexts/ThemeContext';
import '../unistyles';

SplashScreen.preventAutoHideAsync().catch(() => {});

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: !__DEV__,
  sendDefaultPii: false,
});

function RootLayoutNav() {
  const { isDark } = useTheme();
  const { hasSeen } = useOnboarding();

  useEffect(() => {
    AppMetrics.markInteractive();
  }, []);

  if (hasSeen === null) return null;

  return (
    <ReactNativeThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Protected guard={hasSeen}>
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

function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <UnistylesThemeProvider>
          <OnboardingProvider>
            <RootLayoutNav />
          </OnboardingProvider>
        </UnistylesThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(AppMetricsRoot.wrap(RootLayout));
