-- Rank properties by meaning vs a query embedding (pgvector cosine).
-- Table/column/dimension: supabase/migrations/20250315000000_enable_pgvector_properties.sql
-- Metric: docs/pgvector-setup-plan.md + docs/vector-search-learner-notes.md
--
-- Operator <=> is cosine DISTANCE: smaller is closer / more similar.
-- We still ORDER BY that distance ASC so the nearest listing is first.
-- The returned column is similarity = 1 - distance so HIGHER means a better match.
-- Do not ORDER BY similarity ASC — that would invert the ranking.
-- Null embeddings are skipped; they are not "close to everything."

create or replace function public.match_properties(
  query_embedding vector(1536),
  match_count int default 5
)
returns table (
  id uuid,
  title text,
  description text,
  city text,
  similarity float
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    p.id,
    p.title,
    p.description,
    p.city,
    -- 1 - cosine distance => similarity in [0, 2] theoretically; near 1 is close.
    -- Higher similarity = closer meaning. ORDER BY still uses raw <=> (lower better).
    (1 - (p.embedding <=> query_embedding))::float as similarity
  from public.properties p
  where p.embedding is not null
  order by p.embedding <=> query_embedding
  limit least(greatest(coalesce(match_count, 5), 1), 50);
$$;

comment on function public.match_properties(vector(1536), int) is
  'Top-K semantic matches. query_embedding must be vector(1536). Score column similarity is 1 - cosine distance (higher is better). Rows ordered by <=> ascending (best first). SECURITY INVOKER: RLS of the caller still applies.';

revoke all on function public.match_properties(vector(1536), int) from public;
grant execute on function public.match_properties(vector(1536), int) to authenticated;
grant execute on function public.match_properties(vector(1536), int) to service_role;
