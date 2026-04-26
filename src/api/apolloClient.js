import { ApolloClient, InMemoryCache,HttpLink  } from '@apollo/client';

const cache = new InMemoryCache({
  possibleTypes: {
    Product: ['SimpleProduct', 'VariableProduct', 'ExternalProduct', 'GroupProduct'],
    ProductUnion: ['SimpleProduct', 'VariableProduct', 'ExternalProduct', 'GroupProduct'],
    NodeWithTitle: ['SimpleProduct', 'VariableProduct', 'ExternalProduct', 'GroupProduct', 'Post', 'Page'],
  }
});

const client = new ApolloClient({
   link: new HttpLink({ 
    uri: import.meta.env.VITE_WP_GRAPHQL_URL || 'http://agrambio.local/graphql',
  }),
  cache: cache,
});

export default client;
