import { Stack } from "expo-router";

export default function AuthenticatedLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
