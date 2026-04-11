import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as ReactNativeThemeProvider,
} from '@react-navigation/native';
import { AppMetrics, AppMetricsRoot } from 'expo-observe';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
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
        <Stack.Screen name="task/[taskId]" />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ReactNativeThemeProvider>
  );
}

function RootLayout() {
  return (
    <KeyboardProvider>
      <UnistylesThemeProvider>
        <RootLayoutNav />
      </UnistylesThemeProvider>
    </KeyboardProvider>
  );
}


export default AppMetricsRoot.wrap(RootLayout);