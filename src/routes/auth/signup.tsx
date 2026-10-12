import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import {
  createBrowserSupabaseClient,
  persistAuthCookies,
} from '../../lib/supabase/client'
import './auth.css'

export const Route = createFileRoute('/auth/signup')({
  component: SignupPage,
})

function SignupPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setNote(null)
    setPending(true)

    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '')
    const password = String(form.get('password') ?? '')

    try {
      const supabase = createBrowserSupabaseClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data.session) {
        persistAuthCookies(data.session)
        await navigate({ to: '/dashboard' })
        return
      }

      setNote(
        'Account created. If your project requires email confirmation, open the link in your inbox, then sign in. Otherwise try signing in now.',
      )
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create an account.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="auth-page">
      <h1>Create a sponsor account</h1>
      <p>Register with email and password. You will manage only your own listings.</p>

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
            autoComplete="new-password"
            required
            minLength={6}
          />
        </label>
        {error ? (
          <p className="auth-error" role="alert">
            {error}
          </p>
        ) : null}
        {note ? <p className="auth-note">{note}</p> : null}
        <button type="submit" disabled={pending}>
          {pending ? 'Creating account…' : 'Sign up'}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/auth/login">Sign in</Link>
      </p>
    </main>
  )
}
