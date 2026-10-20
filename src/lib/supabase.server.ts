// src/lib/supabase.server.ts
// Server-only module. Do not import this file from pure client components,
// login/signup forms, or dashboard widgets.
// Env names match .env.example and docs/env-var-checklist.md.
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing server env ${name}. See docs/env-var-checklist.md.`)
  }
  return value
}

function projectUrl() {
  return requireEnv(
    'SUPABASE_URL (or VITE_SUPABASE_URL)',
    process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL,
  )
}

function anonKey() {
  return requireEnv('VITE_SUPABASE_ANON_KEY', process.env.VITE_SUPABASE_ANON_KEY)
}

/** Session-aware server client for sponsor auth + RLS (uses anon key + cookies). */
export function createSupabaseServerClient(cookieStore: {
  get: (key: string) => { value: string } | undefined
  set?: (key: string, value: string, options?: Record<string, unknown>) => void
  remove?: (key: string, options?: Record<string, unknown>) => void
}) {
  const url = projectUrl()
  const key = anonKey()

  return createServerClient(url, key, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        cookieStore.set?.(name, value, options)
      },
      remove(name, options) {
        cookieStore.remove?.(name, options)
      },
    },
  })
}

/**
 * Privileged admin client — ONLY on the server, ONLY when you truly need to
 * bypass RLS (migrations, trusted admin jobs). Prefer createSupabaseServerClient
 * for normal sponsor dashboard reads/writes so RLS still applies.
 * Do not use this for list/create of a sponsor's own properties.
 */
export function createSupabaseServiceRoleClient() {
  const url = projectUrl()
  const serviceRoleKey = requireEnv(
    'SUPABASE_SERVICE_ROLE_KEY',
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
