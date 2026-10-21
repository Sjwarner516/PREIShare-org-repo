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

export type CreatePropertyInput = {
  title: string
  city?: string
  description?: string
}

export type CreatePropertyResult =
  | { ok: true; id: string }
  | { ok: false; error: string }

/** Keep title / city / description only. Ignore any owner_id the client sends. */
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

/**
 * Server mutation: load the signed-in session, then insert.
 * owner_id comes from that user id — never from the form.
 * RLS WITH CHECK is owner_id = auth.uid().
 */
export const createProperty = createServerFn({ method: 'POST' })
  .validator((input: unknown) => parseCreatePropertyInput(input))
  .handler(async ({ data }): Promise<CreatePropertyResult> => {
    const title = data.title.trim()
    if (!title) {
      return { ok: false, error: 'Title is required.' }
    }

    const session = await getSession()
    if (!session?.user || !session.access_token) {
      return { ok: false, error: 'You must be signed in to add a property.' }
    }

    const supabase = createSupabaseServerClient(cookieAdapter())
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token ?? '',
    })
    if (sessionError) {
      return { ok: false, error: 'You must be signed in to add a property.' }
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { ok: false, error: 'You must be signed in to add a property.' }
    }

    const { data: row, error } = await supabase
      .from('properties')
      .insert({
        title,
        city: data.city?.trim() ? data.city.trim() : null,
        description: data.description?.trim() ? data.description.trim() : null,
        status: 'draft',
        owner_id: user.id,
      })
      .select('id')
      .single()

    if (error) {
      return { ok: false, error: error.message }
    }

    if (!row) {
      return { ok: false, error: 'Could not create property. Try again.' }
    }

    return { ok: true, id: row.id }
  })
