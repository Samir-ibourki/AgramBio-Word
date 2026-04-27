import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const SESSION_KEY = 'woo-session';

const cache = new InMemoryCache({
  possibleTypes: {
    Product: ['SimpleProduct', 'VariableProduct', 'ExternalProduct', 'GroupProduct'],
    ProductUnion: ['SimpleProduct', 'VariableProduct', 'ExternalProduct', 'GroupProduct'],
    NodeWithTitle: ['SimpleProduct', 'VariableProduct', 'ExternalProduct', 'GroupProduct', 'Post', 'Page'],
  }
});

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_WP_GRAPHQL_URL,
  fetch: (uri, options) => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      options.headers['woocommerce-session'] = `Session ${session}`;
    }
    return fetch(uri, options).then(response => {
      const newSession = response.headers.get('woocommerce-session');
      if (newSession) {
        if (newSession === 'false') localStorage.removeItem(SESSION_KEY);
        else localStorage.setItem(SESSION_KEY, newSession);
      }
      return response;
    });
  }
});

const client = new ApolloClient({
  link: httpLink,
  cache,
});

export default client;