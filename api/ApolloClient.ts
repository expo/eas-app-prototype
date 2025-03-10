import {
  ApolloClient,
  FieldFunctionOptions,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { HttpLink } from '@apollo/client/link/http';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageWrapper, persistCache } from 'apollo3-cache-persist';
import { useEffect, useState } from 'react';

import Config from './Config';

const httpLink = new HttpLink({
  uri: `${Config.api.origin}/--/graphql`,
});

const mergeBasedOnOffset = (existing: any[], incoming: any[], { args }: FieldFunctionOptions) => {
  const merged = existing ? existing.slice(0) : [];

  for (let i = 0; i < incoming.length; ++i) {
    merged[i + args.offset] = incoming[i];
  }
  return merged;
};

const cache = new InMemoryCache({
  typePolicies: {
    AppQuery: {
      keyFields: ['byId', ['id']],
    },
    AccountQuery: {
      keyFields: ['byId', ['id']],
    },
    Account: {
      fields: {
        apps: {
          keyArgs: ['limit'],
          merge: mergeBasedOnOffset,
        },
      },
    },
    App: {
      keyFields: ['id'],
      fields: {
        builds: {
          keyArgs: ['limit', 'platform'],
          merge: mergeBasedOnOffset,
        },
      },
    },
  },
});

interface UseApolloClientParams {
  sessionSecret: string;
}
export const useApolloClient = ({ sessionSecret }: UseApolloClientParams) => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  useEffect(() => {
    async function init() {
      await persistCache({
        cache,
        storage: new AsyncStorageWrapper(AsyncStorage),
        key: 'apollo-cache-persist',
      });

      const authMiddlewareLink = setContext(() => {
        if (sessionSecret) {
          return {
            headers: { 'expo-session': sessionSecret },
          };
        }
      });

      setClient(
        new ApolloClient({
          link: authMiddlewareLink.concat(httpLink),
          cache,
        })
      );
    }

    init();
  }, [sessionSecret]);

  return {
    client,
  };
};
