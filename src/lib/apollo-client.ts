import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

const graphqlUri =
  import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:3001/graphql'

export function createApolloClient(onAuthError: () => void) {
  const httpLink = new HttpLink({ uri: graphqlUri })

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('api_token')
    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  })

  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      const isAuthError = graphQLErrors.some((e) =>
        e.message.includes('Authentication required')
      )
      if (isAuthError) {
        onAuthError()
      }
    }
  })

  return new ApolloClient({
    link: errorLink.concat(authLink).concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'cache-and-network' },
    },
  })
}
