import { ApolloClient, InMemoryCache,HttpLink  } from '@apollo/client';

const client = new ApolloClient({
   link: new HttpLink({ 
    uri: import.meta.env.VITE_WP_GRAPHQL_URL || 'http://agrambio.local/graphql',
  }),
  cache: new InMemoryCache(),
});

export default client;
