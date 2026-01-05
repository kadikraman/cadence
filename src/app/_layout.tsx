import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  ThemeProvider as UnistylesThemeProvider,
  useTheme,
} from '../contexts/ThemeContext';
import {
  ThemeProvider as ReactNativeThemeProvider,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import '../unistyles';

function RootLayoutNav() {
  const { isDark } = useTheme();
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

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <UnistylesThemeProvider>
        <RootLayoutNav />
      </UnistylesThemeProvider>
    </KeyboardProvider>
  );
}
