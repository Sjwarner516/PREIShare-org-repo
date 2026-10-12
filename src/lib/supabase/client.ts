/**
 * BROWSER-SAFE Supabase client.
 * Reads only VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (.env.example).
 * Never read a service-role or other server-only secret here. A public
 * prefix on that key would ship in the bundle and bypass RLS.
 *
 * React components and client routes may import this file.
 * They must not import ./server.
 */
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

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
