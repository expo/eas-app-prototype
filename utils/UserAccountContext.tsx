import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, createContext, useContext, useEffect, useMemo } from 'react';
import { AccountFragment } from '../generated/graphql';

type AccountNameContextValue = {
  account?: AccountFragment;
  sessionSecret?: string;
  setAccount: (account?: AccountFragment) => void;
  setSessionSecret: (sessionSecret?: string) => void;
};

const UserAccountContext = createContext<AccountNameContextValue | null>(null);

export function useUserAccount() {
  const context = useContext(UserAccountContext);

  if (context === null) {
    throw new Error('useUserAccount must be used within a AccountNameProvider');
  }

  return context;
}

export function UserAccountProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<AccountFragment>(undefined);
  const [sessionSecret, setSessionSecret] = useState<string>(undefined);

  useEffect(() => {
    AsyncStorage.getItem('sessionSecret').then(setSessionSecret);
  }, []);

  useEffect(() => {
    const loadAccount = async () => {
      if (account === undefined) {
        const storedAccount = await AsyncStorage.getItem('currentAccount');
        setAccount(storedAccount ? JSON.parse(storedAccount) : null);
      }
    };
    loadAccount();
  }, [account]);

  useEffect(() => {
    if (account) {
      AsyncStorage.setItem('currentAccount', JSON.stringify(account));
    } else {
      AsyncStorage.removeItem('currentAccount');
    }
  }, [account]);

  useEffect(() => {
    if (sessionSecret) {
      AsyncStorage.setItem('sessionSecret', sessionSecret);
    } else {
      AsyncStorage.removeItem('sessionSecret');
    }
  }, [sessionSecret]);

  const value = useMemo(
    () => ({ account, sessionSecret, setAccount, setSessionSecret }),
    [account, sessionSecret]
  );

  if (account === undefined) {
    return null;
  }

  return <UserAccountContext.Provider value={value}>{children}</UserAccountContext.Provider>;
}
