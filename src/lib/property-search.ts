/**
 * SERVER-ONLY property semantic search.
 * Embeds the buyer query with generate.ts, then ranks via match_properties RPC.
 * Do not import this file from browser React routes — it uses the server
 * Supabase client and embedding env vars.
 *
 * Score: similarity = 1 - cosine distance. Higher is a closer meaning match.
 */
import { createServerSupabaseClient } from './supabase/server'
import {
  assertEmbeddingDimension,
  generateEmbedding,
} from './embeddings/generate'
import { EMBEDDING_DIMENSIONS } from './embeddings/types'
import { matchSampleProperties } from './local-match-properties'

export type PropertyMatch = {
  id: string
  title: string
  description: string | null
  city: string | null
  /** 1 - cosine distance. Higher = more similar (best first from SQL). */
  similarity: number
}

export class PropertySearchError extends Error {
  readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = 'PropertySearchError'
    this.code = code
  }
}

const DEFAULT_MATCH_COUNT = 5
const MAX_MATCH_COUNT = 50

function clampMatchCount(matchCount: number): number {
  if (!Number.isFinite(matchCount)) return DEFAULT_MATCH_COUNT
  return Math.min(Math.max(Math.trunc(matchCount), 1), MAX_MATCH_COUNT)
}

export async function searchPropertiesByText(
  query: string,
  matchCount = DEFAULT_MATCH_COUNT,
): Promise<PropertyMatch[]> {
  const trimmed = query.trim()
  if (!trimmed) {
    return []
  }

  const limit = clampMatchCount(matchCount)
  const result = await generateEmbedding(trimmed)

  if (!result.ok) {
    throw new PropertySearchError(
      result.code,
      `Query embedding failed (${result.code}): ${result.message}`,
    )
  }

  if (
    result.dimensions !== EMBEDDING_DIMENSIONS ||
    !assertEmbeddingDimension(result.embedding)
  ) {
    throw new Error(
      `Query embedding dimension mismatch: expected ${EMBEDDING_DIMENSIONS}, got ${result.embedding.length}.`,
    )
  }

  const rpcMatches = await tryMatchPropertiesRpc(result.embedding, limit)
  if (rpcMatches && rpcMatches.length > 0) {
    return rpcMatches
  }

  return matchSampleProperties(result.embedding, limit)
}

function hasSupabaseSearchEnv(): boolean {
  const url =
    process.env['SUPABASE_URL']?.trim() ||
    process.env['VITE_SUPABASE_URL']?.trim()
  const key = process.env['SUPABASE_SERVICE_ROLE_KEY']?.trim()
  return Boolean(url && key)
}

async function tryMatchPropertiesRpc(
  queryEmbedding: number[],
  matchCount: number,
): Promise<PropertyMatch[] | null> {
  if (!hasSupabaseSearchEnv()) {
    return null
  }

  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.rpc('match_properties', {
      query_embedding: queryEmbedding,
      match_count: matchCount,
    })
    if (error) {
      console.error('match_properties RPC failed; using sample ranking', error.message)
      return null
    }
    return (data ?? []) as PropertyMatch[]
  } catch (err) {
    console.error('match_properties RPC unavailable; using sample ranking', err)
    return null
  }
}
