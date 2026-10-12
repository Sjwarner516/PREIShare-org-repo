/**
 * SERVER-ONLY session helpers (`.server.ts` so Vite never ships this to the browser).
 * Import from `src/server/*.ts` createServerFn handlers only — never from
 * React cards, login/signup forms, or route modules.
 *
 * Session identity uses the sponsor JWT + anon key. This file does not
 * read the service-role key into the UI or into listing queries.
 */
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'
import { createAnonServerClient } from '../supabase/server'
import { AUTH_ACCESS_COOKIE, AUTH_REFRESH_COOKIE } from './cookie-names'

export async function getSession() {
  const accessToken = getCookie(AUTH_ACCESS_COOKIE)
  const refreshToken = getCookie(AUTH_REFRESH_COOKIE)

  if (!accessToken && !refreshToken) {
    return null
  }

  const supabase = createAnonServerClient()

  if (accessToken) {
    const { data, error } = await supabase.auth.getUser(accessToken)
    if (!error && data.user) {
      return {
        access_token: accessToken,
        refresh_token: refreshToken ?? '',
        user: data.user,
      }
    }
  }

  if (refreshToken) {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    })
    if (!error && data.session) {
      setCookie(AUTH_ACCESS_COOKIE, data.session.access_token, {
        path: '/',
        sameSite: 'lax',
        maxAge: data.session.expires_in,
      })
      setCookie(AUTH_REFRESH_COOKIE, data.session.refresh_token, {
        path: '/',
        sameSite: 'lax',
        maxAge: data.session.expires_in * 24,
      })
      return data.session
    }
  }

  return null
}

export async function getUser() {
  const session = await getSession()
  return session?.user ?? null
}

export async function signOut() {
  deleteCookie(AUTH_ACCESS_COOKIE, { path: '/' })
  deleteCookie(AUTH_REFRESH_COOKIE, { path: '/' })
}
