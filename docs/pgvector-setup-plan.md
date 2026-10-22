# PREIshare pgvector setup plan

## Purpose

Enable **storage** for semantic property search in Supabase PostgreSQL using **pgvector**, aligned with `docs/embedding-data-model.md`.

This plan is the contract for the **SQL migration** step. It is not the migration file, not seed embeddings, and not the search UI. Two later agents following this file should produce the **same shape**: enable `vector`, then add **one** `embedding` column on existing `properties`, same dimension token as the model.

---

## Source of truth

Copied from `docs/embedding-data-model.md` — **do not invent replacements** in SQL.

| Decision | Value |
| --- | --- |
| Table | `public.properties` (extend the existing listing catalog; **no** second table) |
| Embedding column | `embedding` |
| Embedding type | `vector(DIMENSION_TODO)` |
| Dimension | **`DIMENSION_TODO`** only (same placeholder as the data model; one integer will replace it in a **single pass** when the model is chosen) |
| Listing fields already on the table | `id` (UUID PK), `owner_id`, `title`, `description`, `city`, `status`, `created_at`, `updated_at` |
| Text that will be embedded later | `{title}\n\n{description}` — **not** done in this migration |
| Null embeddings | **Allowed** on the column until seed/backfill |
| Distance / ranking style for later search SQL | Cosine-style via pgvector operator **`<=>`** (cosine **distance**: **smaller is closer**) |

If a draft migration uses a different table name, column name, or a second size (for example a hard-coded `1536` while this plan still says `DIMENSION_TODO`), reject it or update **this plan and the data model together**.

`properties` **already exists** (`supabase/migrations/20250321000000_sponsors_properties_rls.sql`). This migration is an **ALTER**, not a greenfield `CREATE TABLE properties`.

---

## Migration goals (what “done” means)

1. pgvector extension is available (`extname = 'vector'`).
2. `public.properties` still has the listing fields from the data model, **plus** `embedding vector(DIMENSION_TODO)` that does not overwrite `title` / `description`.
3. `embedding` **may be null** until a backfill/seed job runs (insert-then-embed lifecycle).
4. Existing RLS on `properties` is **left as-is** (no new auth tables, no `USING (true)`).
5. A beginner can prove extension + column **shape** with SQL-editor checks below.
6. A similarity **function** / search API is a **follow-up** — out of scope for this migration.

---

## Safe migration order (must not be reordered)

| Order | Step | Why this order |
| ---: | --- | --- |
| 1 | Enable extension `vector` (pgvector) | The `vector` type and operators (`<=>`, `<->`, `<#>`) **do not exist** until the extension is on. Creating `embedding vector(...)` first **fails**. |
| 2 | `ALTER TABLE public.properties ADD COLUMN` `embedding vector(DIMENSION_TODO)` (nullable) | The column type depends on step 1. Alter the **existing** table; do not `CREATE TABLE properties` again; do not add `property_listings`. Do not drop `owner_id` or listing text. |
| 3 | Vector **index** | **Out of scope for this migration** (see Index recommendation). If a later change adds one, it must come **after** the column exists. |
| 4 | Run verification SQL in the Supabase SQL editor | Confirms extension + column **before** seed or app code. |

**Do not** create vector columns before enabling the extension.  
**Do not** invent a second dimension or a second embedding column name.  
**Do not** put seed `INSERT`s of real embedding numbers in this migration.  
**Do not** create `match_properties` in this migration.

When SQL is written, replace `DIMENSION_TODO` with **one** integer in the same commit that updates `docs/embedding-data-model.md` and this plan. Until that integer exists, the migration author still has only **one** size token: `DIMENSION_TODO`.

---

## Similarity approach (beginner demo)

- **Choice:** Later search SQL will rank with pgvector **cosine distance** operator **`<=>`**. Closest listing = **smallest** `embedding <=> query_embedding`. That is **ORDER BY … ASC**, then **LIMIT K** (try **K = 5** from the vector-search notes).
- **Why:** Buyers care about meaning closeness. Cosine-style scoring is the reminder already in the data model. `<=>` is the operator we will standardize on so we do not sort the wrong way.
- **Read the score correctly:** `<=>` is a **distance** (lower better), **not** a similarity (higher better). Treating it as “bigger is better” would show the **worst** match first (`docs/vector-search-learner-notes.md`).
- **Tradeoff:** For a handful of sample rows, an **exact scan** of `properties` is simple and correct enough to learn. Approximate indexes (IVFFlat / HNSW) help when the table is large; they add operator-class setup and usually want many non-null vectors first. This tutorial prefers **clear SQL and a correct schema** over micro-optimization.

Query embeddings (later) must use the **same model and `DIMENSION_TODO`** as stored rows. This migration only makes storage possible.

---

## Index recommendation

- **Demo scale (tens of rows):** **No vector index in this migration.** Sequential scan is enough. “No index required for sample seed.”
- **If adding an index in a later change:** only after `embedding` exists; prefer waiting until seed/backfill has filled most vectors; operator class must match cosine / `<=>` and **`vector(DIMENSION_TODO)`**. Do not add btree indexes on the vector column as a substitute.

---

## Environment values (high level — no secrets in this file)

Names only. Real values stay in gitignored `.env` / `.env.local` or the Supabase dashboard. Enabling pgvector **does not** need an embedding vendor.

| Name | When it is needed | Notes |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | App later | Public project URL. Already in `.env.example`. |
| `VITE_SUPABASE_ANON_KEY` | App later | Anon key; RLS still applies. Not a bypass. |
| `SUPABASE_URL` | Optional server duplicate | Same URL without `VITE_`. |
| `SUPABASE_SERVICE_ROLE_KEY` | Trusted seed/backfill later | Server only. **Never** `VITE_`. **Not** required to `CREATE EXTENSION`. |
| `DATABASE_URL` (or the Supabase DB connection string) | If migrations run via CLI | Server/CI only. Placeholder name only here. |
| Embedding provider key (example name: `OPENAI_API_KEY`) | **Generating** vectors later | **Not** required to enable pgvector or add the column. Do not lock a vendor in this migration. |

There is **no** `VITE_SUPABASE_SERVICE_ROLE_KEY`. Do not paste live URLs, JWTs, or passwords into this file or into SQL comments.

---

## Verification queries (run after migration)

Intents a human can run in the **Supabase SQL editor** without the React app. Exact SQL may be tightened in the migration step; dimension on `properties.embedding` must remain **`DIMENSION_TODO`** (or the single integer that replaced it).

1. **Extension installed** — `vector` appears in `pg_extension`.
2. **Column shape** — `properties.embedding` exists, type/udt is `vector`, atttypmod / dimension matches **`DIMENSION_TODO`** (not a different size).
3. **Null allowed** — a row can exist (or be selected) with `embedding IS NULL`. Do not add `NOT NULL` on `embedding` in this migration.
4. **Operator smoke test** — pgvector `<=>` runs on two **literal** tiny vectors (for example dimension 3) **only** to prove the extension operators work. That toy size is **not** the `properties.embedding` size.

Sketches (illustrative):

```sql
-- 1) extension present
select * from pg_extension where extname = 'vector';

-- 2) column present (shape)
select column_name, data_type, udt_name
from information_schema.columns
where table_schema = 'public' and table_name = 'properties'
order by ordinal_position;

-- 2b) vector dimension on embedding (must match DIMENSION_TODO once substituted)
select a.attname, format_type(a.atttypid, a.atttypmod) as formatted_type
from pg_attribute a
join pg_class c on c.oid = a.attrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = 'properties'
  and a.attname = 'embedding'
  and a.attnum > 0
  and not a.attisdropped;

-- 3) null embeddings allowed (0 is OK before seed)
select count(*) as rows_with_null_embedding
from public.properties
where embedding is null;

-- 4) operator exists (toy literals ONLY — not the properties column size)
select '[1,2,3]'::vector(3) <=> '[1,2,4]'::vector(3) as cosine_distance;
```

Pass: (1) returns the `vector` extension; (2) lists `embedding` as vector; (3) does not error because of NOT NULL; (4) returns a number. Fail: missing extension, `embedding` is `text`/`json`, or dimension ≠ the data-model size.

---

## Out of scope for this migration plan

- Generating real embeddings or calling a vendor API
- Seed data that fills `embedding` (later seed/backfill)
- `match_properties` SQL function, search API routes, React search page
- Changing RLS, adding `USING (true)`, or new user/saved-search tables
- Hybrid keyword + vector ranking, price/beds filters, maps, payments
- IVFFlat / HNSW indexes in the **first** migration
- Replacing `DIMENSION_TODO` with several different integers across files
- Photo embeddings or a second vector column

---

## Open from the data model (do not “fix” them in SQL)

- Integer that replaces **`DIMENSION_TODO`** (model-choice step)
- How demo seed rows satisfy existing `owner_id` NOT NULL (seed step, not this migration)
- Whether failed embeds stay `NULL` and are excluded from ranking (recommended: yes)

---

## Handoff to next step

The coding agent must implement **only ordered goals 1–2**:

1. `CREATE EXTENSION IF NOT EXISTS vector`
2. `ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS embedding vector(DIMENSION_TODO)` with **null allowed**

No index. No seed. No search function. Use table **`properties`**, column **`embedding`**, size **`DIMENSION_TODO`**. Do not silently change vector size or table name.
