import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, createContext, useContext, useEffect } from "react";
import { AccountFragment, useGetCurrentUserQuery } from "../generated/graphql";

type AccountNameContextValue = {
  account?: AccountFragment;
  setAccount: (account?: AccountFragment) => void;
};

const UserAccountContext = createContext<AccountNameContextValue | null>(null);

export function useUserAccount() {
  const context = useContext(UserAccountContext);

  if (context === null) {
    throw new Error("useUserAccount must be used within a AccountNameProvider");
  }

  return context;
}

export function UserAccountProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [account, setAccount] = useState<AccountFragment>(undefined);
  useGetCurrentUserQuery({
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setAccount(data.viewer?.accounts[0]);
    },
    skip: account === undefined,
  });

  useEffect(() => {
    const loadAccount = async () => {
      if (account === undefined) {
        const storedAccount = await AsyncStorage.getItem("currentAccount");
        setAccount(storedAccount ? JSON.parse(storedAccount) : null);
      }
    };
    loadAccount();
  }, []);

  useEffect(() => {
    if (account) {
      AsyncStorage.setItem("currentAccount", JSON.stringify(account));
    } else {
      AsyncStorage.removeItem("currentAccount");
    }
  }, [account]);

  if (account === undefined) {
    return null;
  }

  return (
    <UserAccountContext.Provider value={{ account, setAccount }}>
      {children}
    </UserAccountContext.Provider>
  );
}
