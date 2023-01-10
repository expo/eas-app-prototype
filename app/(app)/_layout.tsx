import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitleVisible: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="account"
        options={{
          presentation: 'modal',
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}
