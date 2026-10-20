import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { createClientOnlyFn } from '@tanstack/react-start'
import { useState, type FormEvent } from 'react'
import {
  createBrowserSupabaseClient,
  persistAuthCookies,
} from '../lib/supabase.client'
import './auth/auth.css'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

const signInWithPassword = createClientOnlyFn(
  async (email: string, password: string) => {
    const supabase = createBrowserSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error && data.session) {
      persistAuthCookies(data.session)
    }

    return { data, error }
  },
)

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const { data, error } = await signInWithPassword(email, password)

      if (error) {
        setErrorMessage(
          error.message || 'Sign-in failed. Check your email and password.',
        )
        return
      }

      if (!data.session) {
        setErrorMessage(
          'Signed in but no session was returned. Confirm your email, then try again.',
        )
        return
      }

      await navigate({ to: '/dashboard' })
    } catch (cause) {
      setErrorMessage(
        cause instanceof Error ? cause.message : 'Could not sign in.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <h1>Sponsor sign in</h1>
      <p>
        Sign in with your sponsor email and password to manage PREIshare
        properties you are allowed to see.
      </p>

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {errorMessage ? (
          <p className="auth-error" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="auth-switch">
        New sponsor? <Link to="/auth/signup">Create an account</Link>
      </p>
    </main>
  )
}
