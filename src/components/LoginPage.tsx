import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ClipboardList, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { SIGN_IN, SIGN_UP } from '@/lib/graphql/mutations'

interface AuthPayload {
  apiToken: string | null
  errors: string[]
  user: { email: string } | null
}

interface SignInData {
  signIn: AuthPayload
}

interface SignUpData {
  signUp: AuthPayload
}

interface AuthVars {
  email: string
  password: string
}

export function LoginPage() {
  const { login } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formErrors, setFormErrors] = useState<string[]>([])

  const [signIn, { loading: signingIn }] = useMutation<SignInData, AuthVars>(SIGN_IN)
  const [signUp, { loading: signingUp }] = useMutation<SignUpData, AuthVars>(SIGN_UP)

  const loading = signingIn || signingUp

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrors([])

    try {
      if (mode === 'signin') {
        const { data } = await signIn({ variables: { email, password } })
        const payload = data?.signIn
        if (!payload) return
        if (payload.errors.length > 0) { setFormErrors(payload.errors); return }
        if (payload.apiToken && payload.user) login(payload.apiToken, payload.user)
      } else {
        const { data } = await signUp({ variables: { email, password } })
        const payload = data?.signUp
        if (!payload) return
        if (payload.errors.length > 0) { setFormErrors(payload.errors); return }
        if (payload.apiToken && payload.user) login(payload.apiToken, payload.user)
      }
    } catch {
      setFormErrors(['Something went wrong. Please try again.'])
    }
  }

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    setFormErrors([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Task Tracker</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="········"
              />
            </div>

            {formErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                {formErrors.map((err) => (
                  <p key={err} className="text-sm text-red-700">{err}</p>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-1"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'signin' ? 'Sign in' : 'Sign up'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={switchMode}
              className="text-indigo-600 font-medium hover:underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
