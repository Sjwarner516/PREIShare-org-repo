/**
 * Embedding contract for PREIshare property search.
 * Review this file before generate.ts: it is types only, no network calls.
 *
 * Dimension and fields must match docs/embedding-data-model.md:
 * - vector length 1536
 * - embedded text is title + description (not city, id, or price)
 */

/** Must match properties.embedding vector(1536) in the pgvector migration. */
export const EMBEDDING_DIMENSIONS = 1536

/** Text fields from a PREIshare property used to build one embedding. */
export type PropertyEmbeddingInput = {
  title: string
  description: string
}

export type EmbeddingSuccess = {
  embedding: number[]
  /** Provider/model id for handoff notes (not used in the distance math). */
  model: string
  dimensions: number
}

export type EmbeddingErrorCode =
  | 'EMPTY_INPUT'
  | 'MISSING_API_KEY'
  | 'PROVIDER_ERROR'
  | 'DIMENSION_MISMATCH'

export type EmbeddingFailure = {
  ok: false
  code: EmbeddingErrorCode
  message: string
}

export type EmbeddingResult =
  | ({ ok: true } & EmbeddingSuccess)
  | EmbeddingFailure
