import { Stack } from "expo-router";
import { ApolloProvider } from "@apollo/client";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { useApolloClient } from "../api/ApolloClient";
import { UserAccountProvider } from "../utils/UserAccountContext";

export default function Layout() {
  const { client } = useApolloClient();
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/Inter/Inter-Regular.otf"),
    "Inter-SemiBold": require("../assets/Inter/Inter-SemiBold.otf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, []);

  if (!fontsLoaded || !client) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <UserAccountProvider>
        <Stack
          screenOptions={{
            headerBackTitleVisible: false,
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen
            name="account"
            options={{
              presentation: "modal",
              headerShown: false,
              animation: "slide_from_bottom",
            }}
          />
        </Stack>
      </UserAccountProvider>
    </ApolloProvider>
  );
}
