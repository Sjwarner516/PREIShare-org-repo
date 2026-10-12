/**
 * Server-only list / create / update for property_listings.
 * Session from getSession(); ownership from session.user.id only.
 * Queries use createServerSupabaseClient({ accessToken }) so RLS applies
 * (anon key + sponsor JWT). Do not import the browser client here.
 */
import { createServerFn } from '@tanstack/react-start'
import { getSession } from '../lib/auth/session'
import {
  createListingSchema,
  fieldErrorsFromZod,
  updateListingSchema,
} from '../lib/listings/schema'
import { createServerSupabaseClient } from '../lib/supabase/server'
import type { PropertyListingRow } from '../lib/supabase/types'

export type ListingRow = PropertyListingRow

export type ListingsResult =
  | { ok: true; listings: ListingRow[] }
  | { ok: false; error: string }

export type ListingMutationResult =
  | { ok: true; listing: ListingRow }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

async function requireListingSession() {
  const session = await getSession()
  if (!session?.user) {
    return null
  }
  return session
}

function listingsClient(accessToken: string) {
  return createServerSupabaseClient({ accessToken })
}

/** Loader: listings for the signed-in sponsor only (session + RLS + owner filter). */
export const listMyListings = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ListingsResult> => {
    const session = await requireListingSession()
    if (!session) {
      return { ok: false, error: 'You must be signed in to view listings.' }
    }

    const supabase = listingsClient(session.access_token)
    const { data, error } = await supabase
      .from('property_listings')
      .select('*')
      .eq('owner_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return { ok: false, error: 'Could not load listings. Try again.' }
    }

    return { ok: true, listings: data ?? [] }
  },
)

/** Action: create a listing owned by the session user — never trust body.owner_id. */
export const createListing = createServerFn({ method: 'POST' })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<ListingMutationResult> => {
    const session = await requireListingSession()
    if (!session) {
      return { ok: false, error: 'You must be signed in to create a listing.' }
    }

    const parsed = createListingSchema.safeParse(data)
    if (!parsed.success) {
      return {
        ok: false,
        error: 'Check the highlighted fields and try again.',
        fieldErrors: fieldErrorsFromZod(parsed.error),
      }
    }

    const supabase = listingsClient(session.access_token)
    const { data: row, error } = await supabase
      .from('property_listings')
      .insert({
        title: parsed.data.title,
        summary: parsed.data.summary ?? null,
        property_type: parsed.data.property_type,
        address_line1: parsed.data.address_line1,
        address_line2: parsed.data.address_line2 ?? null,
        city: parsed.data.city,
        region: parsed.data.region,
        postal_code: parsed.data.postal_code,
        country: parsed.data.country,
        asking_price: parsed.data.asking_price ?? null,
        currency: parsed.data.currency ?? null,
        status: parsed.data.status,
        owner_id: session.user.id,
      })
      .select('*')
      .single()

    if (error || !row) {
      return {
        ok: false,
        error: 'Could not create listing. Check your input and try again.',
      }
    }

    return { ok: true, listing: row }
  },
)

/** Action: update only if the row is visible under RLS for this sponsor. */
export const updateListing = createServerFn({ method: 'POST' })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<ListingMutationResult> => {
    const session = await requireListingSession()
    if (!session) {
      return { ok: false, error: 'You must be signed in to update a listing.' }
    }

    const parsed = updateListingSchema.safeParse(data)
    if (!parsed.success) {
      return {
        ok: false,
        error: 'Check the highlighted fields and try again.',
        fieldErrors: fieldErrorsFromZod(parsed.error),
      }
    }

    const { id, ...patch } = parsed.data
    if (Object.keys(patch).length === 0) {
      return { ok: false, error: 'No fields to update.' }
    }

    const supabase = listingsClient(session.access_token)
    const { data: row, error } = await supabase
      .from('property_listings')
      .update(patch)
      .eq('id', id)
      .eq('owner_id', session.user.id)
      .select('*')
      .single()

    if (error || !row) {
      return {
        ok: false,
        error: 'Could not update listing. It may not exist or you may not own it.',
      }
    }

    return { ok: true, listing: row }
  },
)
