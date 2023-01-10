import { ApolloProvider } from '@apollo/client';
import { useExpoTheme } from 'expo-dev-client-components';
import { useFonts } from 'expo-font';
import { Layout, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useApolloClient } from '../api/ApolloClient';

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
    'Inter-Bold': require('../assets/Inter/Inter-Bold.otf'),
    'Inter-Medium': require('../assets/Inter/Inter-Medium.otf'),
    'Inter-Regular': require('../assets/Inter/Inter-Regular.otf'),
    'Inter-SemiBold': require('../assets/Inter/Inter-SemiBold.otf'),
  });

  useEffect(() => {
    if (client) {
      SplashScreen.hideAsync();
    }
  }, [client]);

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
