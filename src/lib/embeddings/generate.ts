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

function isMockEnabled(): boolean {
  const flag = process.env.EMBEDDING_MOCK?.trim().toLowerCase()
  return flag === '1' || flag === 'true' || flag === 'yes'
}

async function embedText(text: string): Promise<EmbeddingResult> {
  const model = process.env.EMBEDDING_MODEL?.trim() || DEFAULT_MODEL

  if (isMockEnabled()) {
    const embedding = mockEmbedding(text)
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
      model: `mock:${model}`,
      dimensions: embedding.length,
    }
  }

  const apiKey = process.env.EMBEDDING_API_KEY?.trim()
  if (!apiKey) {
    return {
      ok: false,
      code: 'MISSING_API_KEY',
      message:
        'Set EMBEDDING_API_KEY in your environment before generating embeddings.',
    }
  }

  try {
    const embedding = await callEmbeddingProvider(text, apiKey, model)
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
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown provider error'
    return { ok: false, code: 'PROVIDER_ERROR', message }
  }
}

/**
 * Generate an embedding for property title + description.
 * Empty title or empty description is EMPTY_INPUT (data model: both are required
 * for a searchable listing). Missing EMBEDDING_API_KEY is MISSING_API_KEY unless
 * EMBEDDING_MOCK=1 (offline practice vector of length 1536).
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
  const url = process.env.EMBEDDING_API_URL?.trim() || DEFAULT_API_URL
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
