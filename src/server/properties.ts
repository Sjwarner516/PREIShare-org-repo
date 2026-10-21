/**
 * Server-only list / create of properties for the signed-in sponsor.
 * Uses the anon key + sponsor JWT so Postgres RLS (`owner_id = auth.uid()`)
 * is the access control. Do not import this module's helpers from React
 * components — route files must call the createServerFn RPC only.
 *
 * Ownership is always `session.user.id`. Never trust owner_id / sponsor_id
 * from the form, query string, or request body.
 */
import { isRedirect, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'
import { getSession } from '../lib/auth/session.server'
import { createSupabaseServerClient } from '../lib/supabase.server'

const LOAD_ERROR = 'Could not load properties. Try again.'
const CREATE_ERROR = 'Could not create property. Try again.'
const SIGN_IN_ERROR = 'You must be signed in to add a property.'

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

export type CreatePropertyInput = {
  title: string
  city?: string
  description?: string
}

export type CreatePropertyResult =
  | { ok: true }
  | { ok: false; error: string }

/** Strip anything except title / city / description. Ignore owner fields. */
function parseCreatePropertyInput(input: unknown): CreatePropertyInput {
  const body =
    typeof input === 'object' && input !== null
      ? (input as Record<string, unknown>)
      : {}

  return {
    title: typeof body.title === 'string' ? body.title : '',
    city: typeof body.city === 'string' ? body.city : undefined,
    description:
      typeof body.description === 'string' ? body.description : undefined,
  }
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

      // Login stores AUTH_ACCESS_COOKIE, which createServerClient may not
      // treat as a Supabase session. Attach the sponsor JWT so SELECT is
      // not an anonymous request and RLS can see auth.uid().
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

/** Action: insert a draft property owned by the session user — never trust body.owner_id. */
export const createProperty = createServerFn({ method: 'POST' })
  .validator((input: unknown) => parseCreatePropertyInput(input))
  .handler(async ({ data }): Promise<CreatePropertyResult> => {
    try {
      const title = data.title.trim()
      if (!title) {
        return { ok: false, error: 'Title is required.' }
      }

      const city = data.city?.trim() ? data.city.trim() : null
      const description = data.description?.trim()
        ? data.description.trim()
        : null

      const supabase = createSupabaseServerClient(cookieAdapter())
      const session = await getSession()

      if (!session?.user || !session.access_token) {
        return { ok: false, error: SIGN_IN_ERROR }
      }

      // Login stores AUTH_ACCESS_COOKIE, which createServerClient may not
      // treat as a Supabase session. Attach the sponsor JWT so INSERT is
      // not an anonymous request and RLS can see auth.uid().
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token ?? '',
      })

      if (sessionError) {
        return { ok: false, error: SIGN_IN_ERROR }
      }

      const { data: row, error } = await supabase
        .from('properties')
        .insert({
          title,
          city,
          description,
          status: 'draft',
          owner_id: session.user.id,
        })
        .select('id')
        .single()

      if (error || !row) {
        return { ok: false, error: CREATE_ERROR }
      }

      return { ok: true }
    } catch (cause) {
      if (isRedirect(cause)) {
        throw cause
      }
      return { ok: false, error: CREATE_ERROR }
    }
  })
