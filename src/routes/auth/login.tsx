import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import {
  createBrowserSupabaseClient,
  persistAuthCookies,
} from '../../lib/supabase/client'
import './auth.css'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '')
    const password = String(form.get('password') ?? '')

    try {
      const supabase = createBrowserSupabaseClient()
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password })

      if (signInError) {
        setError(signInError.message)
        return
      }

      if (!data.session) {
        setError('Signed in but no session was returned. Confirm your email, then try again.')
        return
      }

      persistAuthCookies(data.session)
      await navigate({ to: '/dashboard' })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not sign in.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="auth-page">
      <h1>Sponsor sign in</h1>
      <p>Use the email and password for your PREIshare sponsor account.</p>

      <form onSubmit={onSubmit}>
        <label>
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        {error ? (
          <p className="auth-error" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={pending}>
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="auth-switch">
        New sponsor? <Link to="/auth/signup">Create an account</Link>
      </p>
    </main>
  )
}
