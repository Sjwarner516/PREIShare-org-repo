/**
 * SERVER-ONLY Supabase client.
 * Never import this file from React components, dashboard widgets, or
 * any module that Vite ships to the browser (src/components, client routes).
 *
 * Reads server env names from .env.example / docs/setup/supabase-env-checklist.md:
 *   SUPABASE_URL (fallback VITE_SUPABASE_URL)
 *   VITE_SUPABASE_ANON_KEY — user-scoped queries + session checks
 *   SUPABASE_SERVICE_ROLE_KEY  — bypasses RLS; never prefix with VITE_
 *
 * Listing create/list and session reads use the user JWT + anon key + RLS.
 * Do not use the service-role key for those paths.
 */
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

function projectUrl() {
  return process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
}

/** Anon key only. Use with a sponsor JWT so RLS still applies. */
export function createAnonServerClient() {
  const url = projectUrl()
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    throw new Error(
      'Missing SUPABASE_URL (or VITE_SUPABASE_URL) or VITE_SUPABASE_ANON_KEY. See docs/setup/supabase-env-checklist.md',
    )
  }

  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export function createServerSupabaseClient(options?: { accessToken?: string }) {
  // User-scoped queries (listings): anon key + the sponsor JWT so RLS applies.
  // Do not use the service-role key for row reads/writes.
  if (options?.accessToken) {
    const url = projectUrl()
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY
    if (!url || !anonKey) {
      throw new Error(
        'Missing SUPABASE_URL (or VITE_SUPABASE_URL) or VITE_SUPABASE_ANON_KEY. See docs/setup/supabase-env-checklist.md',
      )
    }

    return createClient<Database>(url, anonKey, {
      global: {
        headers: { Authorization: `Bearer ${options.accessToken}` },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }

  const url = projectUrl()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Missing SUPABASE_URL (or VITE_SUPABASE_URL) or SUPABASE_SERVICE_ROLE_KEY. See docs/setup/supabase-env-checklist.md',
    )
  }

  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
