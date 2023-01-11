import { ApolloProvider } from '@apollo/client';
import { useExpoTheme } from 'expo-dev-client-components';
import { Layout } from 'expo-router';
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
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded || !client) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <Layout>
        <Layout.Screen name="(app)" redirect={!sessionSecret} />
        <Layout.Screen name="(login)" redirect={Boolean(sessionSecret)} />
        <Layout.Children />
      </Layout>
    </ApolloProvider>
  );
}
