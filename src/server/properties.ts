/**
 * Server-only list of properties for the signed-in sponsor.
 * Uses the anon key + sponsor JWT so Postgres RLS (`owner_id = auth.uid()`)
 * is the access control. Do not import this module's helpers from React
 * components — route files must call the createServerFn RPC only.
 */
import { isRedirect, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'
import { getSession } from '../lib/auth/session.server'
import { createSupabaseServerClient } from '../lib/supabase.server'

const LOAD_ERROR = 'Could not load properties. Try again.'

export type PropertyListItem = {
  id: string
  title: string
  city: string | null
  status: 'draft' | 'published'
  created_at: string
}

export type PropertiesLoaderData = {
  properties: PropertyListItem[]
  error: string | null
}

function cookieAdapter() {
  return {
    get: (key: string) => {
      const value = getCookie(key)
      return value ? { value } : undefined
    },
    set: (key: string, value: string) => {
      setCookie(key, value, { path: '/' })
    },
    remove: (key: string) => {
      deleteCookie(key, { path: '/' })
    },
  }
}

export const listMyProperties = createServerFn({ method: 'GET' }).handler(
  async (): Promise<PropertiesLoaderData> => {
    try {
      const supabase = createSupabaseServerClient(cookieAdapter())
      const session = await getSession()

      if (!session?.user || !session.access_token) {
        throw redirect({ to: '/login' })
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token ?? '',
      })

      if (sessionError) {
        return { properties: [], error: LOAD_ERROR }
      }

      const { data, error } = await supabase
        .from('properties')
        .select('id, title, city, status, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        return { properties: [], error: LOAD_ERROR }
      }

      return {
        properties: (data ?? []) as PropertyListItem[],
        error: null,
      }
    } catch (cause) {
      if (isRedirect(cause)) {
        throw cause
      }
      return { properties: [], error: LOAD_ERROR }
    }
  },
)
