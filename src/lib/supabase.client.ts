// src/lib/supabase.client.ts
// Browser-safe module. Login forms and React routes may import this file.
// Only public env names from .env.example / docs/env-var-checklist.md.
// Do not import src/lib/supabase.server.ts from this side of the app.
import { createClient, type Session } from '@supabase/supabase-js'
import { AUTH_ACCESS_COOKIE, AUTH_REFRESH_COOKIE } from './auth/cookie-names'

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax; Max-Age=${maxAgeSeconds}`
}

/** Persist tokens so the server session guard can read them on the next request. */
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
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check .env and docs/env-var-checklist.md.',
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}
