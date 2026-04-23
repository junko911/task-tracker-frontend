import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const graphqlUri =
  import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:3001/graphql'

const httpLink = new HttpLink({
  uri: graphqlUri,
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
  },
})

export default client
