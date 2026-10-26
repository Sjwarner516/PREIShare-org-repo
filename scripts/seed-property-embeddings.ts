/**
 * Seed public.properties with sample listings + 1536-d embeddings.
 *
 * Run from the repo root:
 *   npx tsx scripts/seed-property-embeddings.ts
 *   npm run seed:embeddings
 *
 * Required environment variables (placeholders only in .env.example):
 *   SUPABASE_URL or VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   — local seed only; bypasses RLS; never VITE_
 *   EMBEDDING_API_KEY           — unless EMBEDDING_MOCK=1 (dummy vectors, not for ranking)
 *   SEED_OWNER_ID               — uuid of an existing auth.users row (properties.owner_id FK)
 *
 * Re-runs upsert the same sample UUIDs, so duplicates are not created.
 * Embeddings come from src/lib/embeddings/generate.ts (title + description).
 * Column names match supabase/migrations/20250315000000_enable_pgvector_properties.sql.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { createServerSupabaseClient } from '../src/lib/supabase/server'
import {
  assertEmbeddingDimension,
  generateEmbedding,
} from '../src/lib/embeddings/generate'
import { EMBEDDING_DIMENSIONS } from '../src/lib/embeddings/types'

type SampleProperty = {
  id: string
  title: string
  description: string
  city?: string
  status?: 'draft' | 'published'
}

type SampleFile = {
  properties: SampleProperty[]
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function loadLocalEnv() {
  for (const file of ['.env.local', '.env']) {
    try {
      const text = await readFile(path.join(process.cwd(), file), 'utf8')
      for (const rawLine of text.split('\n')) {
        const line = rawLine.trim()
        if (!line || line.startsWith('#')) continue
        const eq = line.indexOf('=')
        if (eq <= 0) continue
        const key = line.slice(0, eq).trim()
        let value = line.slice(eq + 1).trim()
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1)
        }
        if (process.env[key] === undefined) {
          process.env[key] = value
        }
      }
    } catch {
      // File is optional.
    }
  }
}

function requireOwnerId(): string {
  const ownerId = process.env.SEED_OWNER_ID?.trim()
  if (!ownerId) {
    throw new Error(
      'Set SEED_OWNER_ID to an existing auth.users uuid before seeding. properties.owner_id is required by the migration.',
    )
  }
  if (!UUID_RE.test(ownerId)) {
    throw new Error('SEED_OWNER_ID must be a UUID.')
  }
  return ownerId
}

async function main() {
  await loadLocalEnv()

  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRole) {
    throw new Error(
      'Missing SUPABASE_URL (or VITE_SUPABASE_URL) or SUPABASE_SERVICE_ROLE_KEY. Seed uses the server service-role client, not the anon key.',
    )
  }

  const ownerId = requireOwnerId()
  const filePath = path.join(process.cwd(), 'data', 'sample-properties.json')
  const raw = await readFile(filePath, 'utf8')
  const parsed = JSON.parse(raw) as SampleFile
  const properties = parsed.properties

  if (!Array.isArray(properties) || properties.length < 6) {
    throw new Error(
      `Expected at least 6 sample properties in ${filePath}, got ${properties?.length ?? 0}.`,
    )
  }

  const supabase = createServerSupabaseClient()
  let failures = 0

  for (const property of properties) {
    if (!UUID_RE.test(property.id)) {
      console.error('Invalid sample id (must be uuid):', property.id)
      process.exit(1)
    }
    if (!property.title?.trim() || !property.description?.trim()) {
      console.error('Sample is missing title or description:', property.id)
      process.exit(1)
    }

    const result = await generateEmbedding({
      title: property.title,
      description: property.description,
    })

    if (!result.ok) {
      console.error(
        `Embedding failed for ${property.id}: ${result.code} — ${result.message}`,
      )
      process.exit(1)
    }

    if (
      result.dimensions !== EMBEDDING_DIMENSIONS ||
      !assertEmbeddingDimension(result.embedding)
    ) {
      console.error(
        `Dimension mismatch for ${property.id}: expected ${EMBEDDING_DIMENSIONS}, got ${result.embedding.length}. Refusing to insert.`,
      )
      process.exit(1)
    }

    const row = {
      id: property.id,
      owner_id: ownerId,
      title: property.title,
      description: property.description,
      city: property.city ?? null,
      status: property.status === 'draft' ? 'draft' : 'published',
      embedding: result.embedding,
    }

    // Database types currently model property_listings; this seed writes public.properties.
    const { error } = await supabase
      .from('properties' as never)
      .upsert(row as never, { onConflict: 'id' })

    if (error) {
      console.error('Failed to seed', property.id, error.message)
      failures += 1
      continue
    }

    console.log(
      'Seeded',
      property.id,
      property.title,
      'embedding dims:',
      result.embedding.length,
    )
  }

  if (failures > 0) {
    process.exit(1)
  }

  console.log(
    `Done. Upserted ${properties.length} sample properties with vector(${EMBEDDING_DIMENSIONS}) embeddings.`,
  )
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
