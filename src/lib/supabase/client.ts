/**
 * BROWSER-SAFE Supabase client.
 * Reads only VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (.env.example).
 * Never read a service-role or other server-only secret here. A public
 * prefix on that key would ship in the bundle and bypass RLS.
 *
 * React components and client routes may import this file.
 * They must not import ./server.
 */
import { createClient, type Session } from '@supabase/supabase-js'
import { AUTH_ACCESS_COOKIE, AUTH_REFRESH_COOKIE } from '../auth/cookie-names'
import type { Database } from './types'

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax; Max-Age=${maxAgeSeconds}`
}

/** Persist tokens so the server session helpers can read them on the next request. */
export function persistAuthCookies(session: Session) {
  const maxAge = session.expires_in ?? 3600
  writeCookie(AUTH_ACCESS_COOKIE, session.access_token, maxAge)
  writeCookie(AUTH_REFRESH_COOKIE, session.refresh_token, maxAge * 24)
}

export function clearAuthCookies() {
  writeCookie(AUTH_ACCESS_COOKIE, '', 0)
  writeCookie(AUTH_REFRESH_COOKIE, '', 0)
}

export function createBrowserSupabaseClient() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. See docs/setup/supabase-env-checklist.md',
    )
  }

  return createClient<Database>(url, anonKey)
}
