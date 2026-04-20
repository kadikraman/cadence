import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as ReactNativeThemeProvider,
} from '@react-navigation/native';
import { AppMetrics, AppMetricsRoot } from 'expo-observe';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  ThemeProvider as UnistylesThemeProvider,
  useTheme,
} from '../contexts/ThemeContext';
import '../unistyles';

function RootLayoutNav() {
  const { isDark } = useTheme();

  useEffect(() => {
    AppMetrics.markInteractive();
  }, []);

  return (
    <ReactNativeThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="task/[taskId]" options={{ headerShown: false }} />
        <Stack.Screen name="stats" options={{ headerShown: false }} />
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
          <RootLayoutNav />
        </UnistylesThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export default AppMetricsRoot.wrap(RootLayout);
