/**
 * POST /api/properties/search
 * Server door for semantic property search. Ranking lives in
 * src/lib/property-search.ts — this file only validates input and returns JSON.
 */
import { createFileRoute } from '@tanstack/react-router'

type SearchBody = {
  query?: unknown
  matchCount?: unknown
}

function publicError(status: number, message: string) {
  return Response.json({ error: message, results: [] }, { status })
}

function toPublicResult(row: {
  id: string
  title: string
  description: string | null
  city: string | null
  similarity: number
}) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    city: row.city,
    similarity: row.similarity,
  }
}

export const Route = createFileRoute('/api/properties/search')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json().catch(() => ({}))) as SearchBody
          const query = typeof body.query === 'string' ? body.query.trim() : ''

          if (!query) {
            return publicError(400, 'Query is required')
          }

          const matchCount =
            typeof body.matchCount === 'number' ? body.matchCount : undefined
          const { searchPropertiesByText } = await import(
            '../../../lib/property-search'
          )
          const matches = await searchPropertiesByText(query, matchCount)
          const results = matches.map(toPublicResult)

          return Response.json({ query, results })
        } catch (err) {
          console.error('property search failed', err)
          const code =
            typeof err === 'object' && err !== null && 'code' in err
              ? String((err as { code: unknown }).code)
              : ''
          if (code === 'MISSING_API_KEY') {
            return publicError(503, 'Search is not configured')
          }
          return publicError(500, 'Search failed')
        }
      },
    },
  },
})
