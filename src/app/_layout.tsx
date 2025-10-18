import { Stack } from 'expo-router';
import { db } from '../lib/db';

export default function RootLayout() {
  const { isLoading, user } = db.useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Protected guard={!user}>
        <Stack.Screen
          name="login"
          options={{
            title: 'Login',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="verify"
          options={{
            title: 'Verify Code',
            headerShown: false,
          }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!!user}>
        <Stack.Screen
          name="(authenticated)"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
