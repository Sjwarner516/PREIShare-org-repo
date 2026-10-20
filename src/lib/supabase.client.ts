// src/lib/supabase.client.ts
// Browser-safe module. Login forms and React routes may import this file.
// Only public env names from .env.example / docs/env-var-checklist.md.
// Do not import src/lib/supabase.server.ts from this side of the app.
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check .env and docs/env-var-checklist.md.',
  )
}

export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey)
