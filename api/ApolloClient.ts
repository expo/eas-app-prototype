import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { HttpLink } from "@apollo/client/link/http";

import Config from "./Config";

const httpLink = new HttpLink({
  uri: `${Config.api.origin}/--/graphql`,
});

const authMiddlewareLink = setContext(() => {
  if (Config.sessionSecret) {
    return {
      headers: { "expo-session": Config.sessionSecret },
    };
  }
});

const link = authMiddlewareLink.concat(httpLink);

export default new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
