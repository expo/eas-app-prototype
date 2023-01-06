import { Stack } from "expo-router";
import { ApolloProvider } from "@apollo/client";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import ApolloClient from "../api/ApolloClient";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/Inter/Inter-Regular.otf"),
    "Inter-SemiBold": require("../assets/Inter/Inter-SemiBold.otf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ApolloProvider client={ApolloClient}>
      <Stack screenOptions={{ headerBackTitleVisible: false }} />
    </ApolloProvider>
  );
}
