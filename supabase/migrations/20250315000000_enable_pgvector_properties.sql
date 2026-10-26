-- Enable pgvector so PostgreSQL can store and compare embedding vectors.
-- pgvector is an optional add-on: without this line, type vector does not exist.
-- IF NOT EXISTS: safe to re-run if the extension is already on.
-- Source: docs/pgvector-setup-plan.md, docs/embedding-data-model.md
CREATE EXTENSION IF NOT EXISTS vector;

-- PREIshare listings (one catalog — do not create a second listings table).
-- CREATE IF NOT EXISTS covers a fresh database where this file runs first.
-- id is the stable primary key. title + description are the human-readable
-- listing fields later concatenated for embedding. city is display-only.
-- embedding is a meaning-number list, NOT a copy of the listing text.
-- Dimension 1536 must match the TypeScript embedding module.
-- embedding may be NULL until seed/backfill (insert text, then generate the vector).
-- Do not DROP this table. Do not change 1536 without updating the data model and app together.
CREATE TABLE IF NOT EXISTS public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  city text,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  embedding vector(1536),
  CONSTRAINT properties_status_check CHECK (status IN ('draft', 'published'))
);

-- If properties already existed (sponsor RLS migration applied first), only add embedding.
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS embedding vector(1536);

COMMENT ON TABLE public.properties IS
  'PREIshare investment listings. Readable title/description stay on the row; embedding powers semantic search.';

COMMENT ON COLUMN public.properties.embedding IS
  'pgvector embedding of title + description (not the raw sentence). vector(1536). Null until backfill. Later rank with <=> cosine distance (smaller is closer).';

-- No vector index here: tens of sample rows can use an exact scan.
-- Seed embeddings and match_properties are later steps — not this migration.
