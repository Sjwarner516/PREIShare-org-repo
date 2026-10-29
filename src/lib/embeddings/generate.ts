/**
 * Property text → fixed-length embedding (or a typed failure).
 * Secrets: EMBEDDING_API_KEY (and optional EMBEDDING_MODEL) from the environment only.
 * Recipe: docs/embedding-data-model.md — `{title}\n\n{description}`, dimension 1536.
 */
import {
  EMBEDDING_DIMENSIONS,
  type EmbeddingResult,
  type PropertyEmbeddingInput,
} from './types'
import { LOCAL_EMBEDDING_MODEL, localSemanticEmbedding } from './local'

const DEFAULT_MODEL = 'text-embedding-3-small'
const DEFAULT_API_URL = 'https://api.openai.com/v1/embeddings'

/**
 * Combine property fields into one string for the embedding model.
 * Same title + description → same text. City/id/price are not included.
 */
export function buildEmbeddingText(input: PropertyEmbeddingInput): string {
  const title = input.title.trim()
  const description = input.description.trim()
  if (!title && !description) {
    return ''
  }
  if (!title) {
    return description
  }
  if (!description) {
    return title
  }
  return `${title}\n\n${description}`
}

/** True when the vector is a finite number[] of the expected length (1536). */
export function assertEmbeddingDimension(
  embedding: number[],
  expected = EMBEDDING_DIMENSIONS,
): boolean {
  return (
    Array.isArray(embedding) &&
    embedding.length === expected &&
    embedding.every((n) => typeof n === 'number' && Number.isFinite(n))
  )
}

/**
 * Local check that a sample vector matches the data-model dimension.
 * Does not call the provider. Run this before seeding.
 */
export function embeddingDimensionSelfCheck(): {
  ok: boolean
  expected: number
  actual: number
} {
  const sample = Array.from({ length: EMBEDDING_DIMENSIONS }, (_, i) =>
    i === 0 ? 1 : 0,
  )
  return {
    ok: assertEmbeddingDimension(sample),
    expected: EMBEDDING_DIMENSIONS,
    actual: sample.length,
  }
}

function envFlag(name: string): string | undefined {
  // Dynamic key so Vite does not replace process.env.NAME with undefined at build.
  return process.env[name]?.trim()
}

function isMockEnabled(): boolean {
  const flag = envFlag('EMBEDDING_MOCK')?.toLowerCase()
  return flag === '1' || flag === 'true' || flag === 'yes'
}

function asEmbeddingSuccess(
  embedding: number[],
  model: string,
): EmbeddingResult {
  if (!assertEmbeddingDimension(embedding)) {
    return {
      ok: false,
      code: 'DIMENSION_MISMATCH',
      message: `Expected ${EMBEDDING_DIMENSIONS} numbers, got ${embedding.length}.`,
    }
  }
  return {
    ok: true,
    embedding,
    model,
    dimensions: embedding.length,
  }
}

function localMeaningEmbedding(text: string): EmbeddingResult {
  return asEmbeddingSuccess(localSemanticEmbedding(text), LOCAL_EMBEDDING_MODEL)
}

async function embedText(text: string): Promise<EmbeddingResult> {
  const model = envFlag('EMBEDDING_MODEL') || DEFAULT_MODEL

  if (isMockEnabled()) {
    return asEmbeddingSuccess(mockEmbedding(text), `mock:${model}`)
  }

  const apiKey = envFlag('EMBEDDING_API_KEY')
  if (!apiKey) {
    // Hobby / classroom fallback: real meaning vector, not a dummy sine wave.
    return localMeaningEmbedding(text)
  }

  try {
    const embedding = await callEmbeddingProvider(text, apiKey, model)
    return asEmbeddingSuccess(embedding, model)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown provider error'
    return { ok: false, code: 'PROVIDER_ERROR', message }
  }
}

/**
 * Generate an embedding for property title + description.
 * Empty title or empty description is EMPTY_INPUT (data model: both are required
 * for a searchable listing). Missing EMBEDDING_API_KEY uses the local 1536-d
 * meaning embedding (synonym groups + hashed unigrams). EMBEDDING_MOCK=1 is
 * the dummy sine vector and must not be used to judge ranking.
 */
export async function generatePropertyEmbedding(
  input: PropertyEmbeddingInput,
): Promise<EmbeddingResult> {
  const title = input.title.trim()
  const description = input.description.trim()
  if (!title || !description) {
    return {
      ok: false,
      code: 'EMPTY_INPUT',
      message:
        'Title and description are both required to embed a listing. Empty description is not searchable.',
    }
  }

  return embedText(buildEmbeddingText(input))
}

/**
 * Embed a buyer query as typed (not the listing `{title}\n\n{description}` recipe).
 * Same model and dimension 1536 as stored property vectors.
 */
export async function generateQueryEmbedding(
  query: string,
): Promise<EmbeddingResult> {
  const text = query.trim()
  if (!text) {
    return {
      ok: false,
      code: 'EMPTY_INPUT',
      message: 'Search query is empty; nothing to embed.',
    }
  }
  return embedText(text)
}

/** Listings pass { title, description }; search passes the raw query string. */
export async function generateEmbedding(
  input: PropertyEmbeddingInput | string,
): Promise<EmbeddingResult> {
  if (typeof input === 'string') {
    return generateQueryEmbedding(input)
  }
  return generatePropertyEmbedding(input)
}

/** Offline practice only — not a real meaning vector. Length is 1536. */
function mockEmbedding(text: string): number[] {
  const seed = text.length + 1
  return Array.from({ length: EMBEDDING_DIMENSIONS }, (_, i) =>
    Math.sin((i + 1) * seed) * 0.01,
  )
}

type ProviderResponse = {
  data?: Array<{ embedding?: number[] }>
  error?: { message?: string }
}

async function callEmbeddingProvider(
  text: string,
  apiKey: string,
  model: string,
): Promise<number[]> {
  const url = envFlag('EMBEDDING_API_URL') || DEFAULT_API_URL
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: text,
      dimensions: EMBEDDING_DIMENSIONS,
    }),
  })

  let body: ProviderResponse = {}
  try {
    body = (await response.json()) as ProviderResponse
  } catch {
    throw new Error(
      `Embedding provider returned non-JSON (HTTP ${response.status}).`,
    )
  }

  if (!response.ok) {
    const detail = body.error?.message || `HTTP ${response.status}`
    throw new Error(detail)
  }

  const embedding = body.data?.[0]?.embedding
  if (!Array.isArray(embedding)) {
    throw new Error('Embedding provider response did not include a vector.')
  }
  return embedding
}
