import { Stack } from "expo-router";
import { ApolloProvider } from "@apollo/client";
import React from "react";

import ApolloClient from "../api/ApolloClient";

export default function Layout() {
  return (
    <ApolloProvider client={ApolloClient}>
      <Stack />
    </ApolloProvider>
  );
}
