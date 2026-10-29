/**
 * In-process ranking that mirrors match_properties SQL:
 * ORDER BY embedding <=> query_embedding (cosine distance, smaller closer)
 * similarity = 1 - distance (higher better)
 * skip null embeddings, LIMIT K.
 *
 * Used when Supabase/pgvector is not configured (Hobby demo) so /search can
 * still return live ranks on the bundled sample listings.
 */
import sampleFile from '../../data/sample-properties.json' with { type: 'json' }
import {
  assertEmbeddingDimension,
  generateEmbedding,
} from './embeddings/generate'
import { EMBEDDING_DIMENSIONS } from './embeddings/types'

export type LocalPropertyMatch = {
  id: string
  title: string
  description: string | null
  city: string | null
  similarity: number
}

type SampleProperty = {
  id: string
  title: string
  description: string
  city?: string
  status?: string
}

type SampleFile = {
  properties: SampleProperty[]
}

type EmbeddedSample = SampleProperty & { embedding: number[] }

let cached: EmbeddedSample[] | null = null

function cosineDistance(a: number[], b: number[]): number {
  let dot = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
  }
  return 1 - dot
}

async function loadEmbeddedSamples(): Promise<EmbeddedSample[]> {
  if (cached) return cached

  const properties = (sampleFile as SampleFile).properties
  const rows: EmbeddedSample[] = []

  for (const property of properties) {
    const result = await generateEmbedding({
      title: property.title,
      description: property.description,
    })
    if (!result.ok) {
      throw new Error(
        `Sample embedding failed for ${property.id}: ${result.code} ${result.message}`,
      )
    }
    if (!assertEmbeddingDimension(result.embedding)) {
      throw new Error(
        `Sample embedding dimension mismatch for ${property.id}: ${result.embedding.length}`,
      )
    }
    rows.push({ ...property, embedding: result.embedding })
  }

  cached = rows
  return rows
}

export async function matchSampleProperties(
  queryEmbedding: number[],
  matchCount: number,
): Promise<LocalPropertyMatch[]> {
  if (
    queryEmbedding.length !== EMBEDDING_DIMENSIONS ||
    !assertEmbeddingDimension(queryEmbedding)
  ) {
    throw new Error(
      `Query embedding dimension mismatch: expected ${EMBEDDING_DIMENSIONS}, got ${queryEmbedding.length}.`,
    )
  }

  const rows = await loadEmbeddedSamples()
  const ranked = rows
    .filter((row) => row.embedding != null)
    .map((row) => {
      const distance = cosineDistance(queryEmbedding, row.embedding)
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        city: row.city ?? null,
        similarity: 1 - distance,
        distance,
      }
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, matchCount)

  return ranked.map(({ distance: _distance, ...match }) => match)
}
