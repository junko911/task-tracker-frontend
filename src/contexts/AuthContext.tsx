import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { ApolloProvider } from '@apollo/client'
import { createApolloClient } from '@/lib/apollo-client'

interface AuthUser {
  email: string
}

interface AuthContextValue {
  token: string | null
  user: AuthUser | null
  login: (token: string, user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('api_token')
  )
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('auth_user')
    return stored ? (JSON.parse(stored) as AuthUser) : null
  })

  const handleAuthError = useCallback(() => {
    localStorage.removeItem('api_token')
    localStorage.removeItem('auth_user')
    setToken(null)
    setUser(null)
  }, [])

  const onAuthErrorRef = useRef(handleAuthError)
  onAuthErrorRef.current = handleAuthError

  const client = useMemo(
    () => createApolloClient(() => onAuthErrorRef.current()),
    []
  )

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem('api_token', newToken)
    localStorage.setItem('auth_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('api_token')
    localStorage.removeItem('auth_user')
    setToken(null)
    setUser(null)
    client.resetStore().catch(() => {})
  }, [client])

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
