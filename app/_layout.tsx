import { Stack } from 'expo-router';
import { ApolloProvider } from '@apollo/client';
import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { useApolloClient } from '../api/ApolloClient';
import { UserAccountProvider } from '../utils/UserAccountContext';
import { StatusBar } from 'react-native';
import { useExpoTheme } from 'expo-dev-client-components';

export default function Layout() {
  const { client } = useApolloClient();
  const theme = useExpoTheme();
  const [fontsLoaded] = useFonts({
    'Inter-Bold': require('../assets/Inter/Inter-Bold.otf'),
    'Inter-Medium': require('../assets/Inter/Inter-Medium.otf'),
    'Inter-Regular': require('../assets/Inter/Inter-Regular.otf'),
    'Inter-SemiBold': require('../assets/Inter/Inter-SemiBold.otf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !client) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <UserAccountProvider>
        <StatusBar backgroundColor={theme.background.default} translucent={false} />
        <Stack
          screenOptions={{
            headerBackTitleVisible: false,
            animation: 'slide_from_right',
          }}>
          <Stack.Screen
            name="account"
            options={{
              presentation: 'modal',
              headerShown: false,
              animation: 'slide_from_bottom',
            }}
          />
        </Stack>
      </UserAccountProvider>
    </ApolloProvider>
  );
}
