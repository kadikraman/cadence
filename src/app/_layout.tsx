import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import '../unistyles';

function RootLayoutNav() {
  const { isDark } = useTheme();
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="task/[taskId]" />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </KeyboardProvider>
  );
}
