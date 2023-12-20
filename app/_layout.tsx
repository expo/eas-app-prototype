import { ApolloProvider } from '@apollo/client';
import { useExpoTheme } from 'expo-dev-client-components';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useApolloClient } from '../api/ApolloClient';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import { UserAccountProvider, useUserAccount } from '../utils/UserAccountContext';

export default function Root() {
  const theme = useExpoTheme();

  return (
    <UserAccountProvider>
      <StatusBar backgroundColor={theme.background.default} translucent={false} />
      <RootLayout />
    </UserAccountProvider>
  );
}

function RootLayout() {
  const { sessionSecret } = useUserAccount();
  const { client } = useApolloClient({ sessionSecret });

  const [fontsLoaded] = useFonts({
    'Inter-Bold': Inter_700Bold,
    'Inter-Medium': Inter_500Medium,
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  if (!fontsLoaded || !client) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(app)" redirect={!sessionSecret} />
        <Stack.Screen name="(login)" redirect={Boolean(sessionSecret)} />
      </Stack>
    </ApolloProvider>
  );
}
