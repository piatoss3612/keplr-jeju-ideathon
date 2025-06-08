import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// The Graph subgraph endpoint
const httpLink = createHttpLink({
  uri:
    process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
    "https://api.studio.thegraph.com/query/71401/orbit-chronicle/version/latest",
});

// Apollo Client instance
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "ignore",
    },
    query: {
      errorPolicy: "all",
    },
  },
});
