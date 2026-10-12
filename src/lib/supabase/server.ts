/**
 * SERVER-ONLY Supabase client.
 * Never import this file from React components, dashboard widgets, or
 * any module that Vite ships to the browser (src/components, client routes).
 *
 * Reads server env names from .env.example / docs/setup/supabase-env-checklist.md:
 *   SUPABASE_URL (fallback VITE_SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY  — bypasses RLS; never prefix with VITE_
 *
 * Listing create/list in later steps should prefer the user session + anon key
 * + RLS. This helper is for trusted server loaders/actions only.
 */
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export function createServerSupabaseClient(options?: { accessToken?: string }) {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL

  // User-scoped queries (listings): anon key + the sponsor JWT so RLS applies.
  // Do not use the service-role key for row reads/writes.
  if (options?.accessToken) {
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
