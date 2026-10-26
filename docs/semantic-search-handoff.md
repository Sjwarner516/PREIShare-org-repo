# PREIshare semantic search — handoff

This file is for a teammate or mentor. It only uses facts from the four source docs listed in §9. It does not invent a new product.

## 1. Client story recap

PREIshare helps people find investment properties. Buyers type **intent**, not listing jargon: lifestyle (“quiet,” “near water”), use (“weekend stays”), and money (“rental upside”). Source: `docs/semantic-search-requirements.md`.

**Keyword search** only keeps a row when the **same words** appear in the listing. A lakeside cottage written as “peaceful short-term income, dock on the lake” can miss `quiet cabin near water with good rental upside` if those exact words never appear together.

**Semantic search** in this tutorial means: turn listing text into a list of numbers (an **embedding**), store that list next to the property, turn the buyer’s phrase into the **same kind** of list, then rank listings whose numbers sit **nearest** the query. Source: `docs/semantic-search-requirements.md`, `docs/embedding-data-model.md`.

The searcher is a **buyer** looking at **sample** listings. This slice does not add sponsor login or listing-create tools. Source: `docs/semantic-search-requirements.md` (Actors).

**Stakeholder one-minute version** (from the requirements brief): Buyers type intent, not listing jargon. Keyword search misses homes that use different words for the same idea. We demo meaning-aware ranking on a **small sample** in Postgres—not a map, not a marketplace, not a production pipeline.

## 2. Stakeholder goals ↔ deliverables

| Stakeholder goal | What we delivered | Where to look |
| --- | --- | --- |
| Search by meaning, not only exact words | TypeScript embedding helper + similarity search helper | `src/lib/embeddings/`, `src/lib/property-search.ts` |
| Store vectors next to property data | pgvector on existing `public.properties`, column `embedding vector(1536)` | `supabase/migrations/20250315000000_enable_pgvector_properties.sql` (`docs/pgvector-setup-plan.md`, `docs/embedding-data-model.md`) |
| Rankable matches for demo queries | SQL function `match_properties` (cosine distance `<=>`, best-first) + TS helper | `supabase/migrations/20250315000001_match_properties_function.sql`, `src/lib/property-search.ts` |
| Something a human can try without login or maps | API route + simple search page | `src/routes/api/properties/search.ts`, `src/routes/search.tsx` (`docs/semantic-search-verification.md`: `GET /search` → 200) |
| Proof on sample listings | 8 sample rows in git + a verification report | `data/sample-properties.json`, `scripts/seed-property-embeddings.ts`, `docs/semantic-search-verification.md` |

**Honesty on “proof”:** verification on 2026-10-26 showed the **page and empty-query safety work**. It did **not** prove live ranking. Queries 1–5 returned HTTP **503** `Search is not configured` because this environment had no Supabase or embedding keys. Source: `docs/semantic-search-verification.md`.

## 3. Architectural decisions (what we actually chose)

Filled from the source docs. Nothing here is a guessed default.

- **What text is embedded (listings):** `{title}` then a blank line then `{description}` (`{title}\n\n{description}`). Trim each part. Do **not** embed `id`, `city`, `status`, `owner_id`, timestamps, or prices. Title-only is a bug. Source: `docs/embedding-data-model.md`.
- **What text is embedded (queries):** the buyer’s string **as typed**. Same model and size as listings. Not forced through the title+description recipe. Source: `docs/embedding-data-model.md`.
- **Embedding dimensions:** **1536** only. Column type `vector(1536)`. Query vectors and stored vectors must match. Source: `docs/embedding-data-model.md`, `docs/pgvector-setup-plan.md`.
- **Expected model name (app, not SQL):** `text-embedding-3-small` (must still output 1536). Source: `docs/semantic-search-verification.md`. The setup plan does **not** lock a vendor in the migration.
- **Distance / similarity metric:** pgvector operator **`<=>`** = cosine **distance**. **Smaller is closer.** SQL should `ORDER BY embedding <=> query_embedding` (ascending), then `LIMIT K`. The search path also exposes **similarity = 1 − distance** so a higher score means a closer match. Do not treat raw `<=>` as “bigger is better.” Source: `docs/pgvector-setup-plan.md`; score conversion noted in `docs/semantic-search-verification.md` (refine cycle).
- **Top-K / match count:** try **K = 5**. Top-K is a query/API concern, not a column on the property. Source: `docs/embedding-data-model.md`, `docs/pgvector-setup-plan.md`.
- **Where embeddings are created:** **outside the database**, in TypeScript (then a model API). The migration only stores the vector. Null embeddings are skipped in ranking; they are not “close to everything.” Source: `docs/embedding-data-model.md`, `docs/pgvector-setup-plan.md`.
- **Table:** `public.properties` (extend the existing catalog). **No** second listings table. Column: `embedding`. Source: `docs/pgvector-setup-plan.md`.
- **Seed / backfill path:** `data/sample-properties.json` (**8** listings) + `scripts/seed-property-embeddings.ts`. Needs `SUPABASE_URL` or `VITE_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `EMBEDDING_API_KEY`, and `SEED_OWNER_ID`. After seed, every searchable sample should have a **non-null** `embedding`. Source: `docs/semantic-search-verification.md`, `docs/embedding-data-model.md`.
- **Demo searcher auth:** the buyer in this slice does **not** need to be signed in. Earlier-sprint sponsor auth is unchanged. Source: `docs/semantic-search-requirements.md`. The search helper is meant to use the **server** service-role client for this demo; RLS on `properties` is still owner-only. Source: `docs/semantic-search-verification.md`, `docs/pgvector-setup-plan.md` (RLS left as-is).

## 4. In scope vs out of scope (this tutorial)

**In scope (this demo slice)** — from `docs/semantic-search-requirements.md`:

- Explain embeddings vs exact words
- One `properties` row shape with `title` / `description` plus `embedding vector(1536)`
- pgvector migration (enable `vector`, then add the column)
- TypeScript helper that turns **text** into an embedding
- Small seed set (enough for the example queries, including a farm **control** listing)
- Similarity search (SQL function + TypeScript helper)
- One minimal API route and one simple React search page
- Verification notes and this handoff, using the same example queries

Sample listings may be seeded fiction. They do not have to be live sponsor rows.

**Out of scope (explicit non-goals)** — from `docs/semantic-search-requirements.md` and `docs/pgvector-setup-plan.md`:

- Production embedding billing, keys in git, rate limits, or marketplace-scale batch jobs
- Map search, “near me,” or a new Vercel app
- Filters (price, beds, baths, property type) mixed with vectors
- Hybrid keyword + vector ranking
- Auth / RLS redesign, payments, messaging, saved searches
- “Boost featured listings,” personalization, or autocomplete
- Photo / PDF embeddings, multilingual models, or re-embed on every sponsor edit
- A second listings table (`property_listings` fork)
- A vector index (IVFFlat / HNSW) in the first migration—tens of rows use an exact scan
- CI that regenerates embeddings on every PR

If a later prompt asks for those “while we are here,” the answer is **no** for this slice.

## 5. Demo limitations (be honest)

From `docs/semantic-search-verification.md` (2026-10-26) and the requirements brief:

- **Not ready to demo ranking to a stakeholder yet.** Sign-off: **NO**. Live Supabase was not connected. Seed was not run. Embedding null count is **unknown**.
- Requirements queries 1–5 POSTed to `/api/properties/search` returned **503** `{ error: "Search is not configured", results: [] }`. No top-3 titles were observed. Do not claim the Cedar hideaway “won” query 1 in a live run.
- **Keyword-trap is designed, not proven.** The intended winner `Cedar hideaway beside a private lake` does **not** contain `cabin`, `water`, `quiet`, `rental`, or `upside`. Exact-word search *should* miss it. Similarity ranking never ran, so we cannot show that meaning match in the UI yet.
- Quality will depend on a **small sample** (8 JSON listings). Odd rankings later may mean thin coverage, not a broken `<=>`.
- Search needs **env keys**. Without them, generate/search fail in a safe way (empty query still **400**; missing embedding key **503**; no fake listings).
- No claim of production latency, cost control, or full PREIshare catalog coverage.
- Explainability is a similarity number plus listing text—not a “why this matched” UI.
- After seed, watch the inland duplex (monthly yield vs weekend guests) and the warehouse (logistics vs lodging) so they stay below waterfront for queries 1 and 5.

**What did work in verification:** `/search` loads (HTTP 200). Empty query: API **400** `Query is required`; UI shows a clear alert. No crash. No hardcoded fake results.

## 6. How to re-run the demo (handoff checklist)

Source: `docs/semantic-search-verification.md` follow-ups + `docs/pgvector-setup-plan.md`.

1. Apply migrations in order: enable pgvector + `properties.embedding vector(1536)` (`20250315000000_enable_pgvector_properties.sql`), then `match_properties` (`20250315000001_match_properties_function.sql`). Confirm `vector` in `pg_extension` and dimension **1536**.
2. Set env (names only; real values stay out of git): `VITE_SUPABASE_URL` or `SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (never `VITE_`), `EMBEDDING_API_KEY`, `SEED_OWNER_ID` (existing `auth.users` uuid).
3. Run `npx tsx scripts/seed-property-embeddings.ts`. In SQL, count rows vs `count(*) filter (where embedding is null)`. Need **8** sample rows and **0** null embeddings before judging rank.
4. Start the app (`npm run dev`). Open `/search`. Try the queries in `docs/semantic-search-requirements.md`:
   - `quiet cabin near water with good rental upside`
   - `family-friendly home close to good schools`
   - `downtown condo walkable to restaurants`
   - `flat irrigated farmland for row crops` (control—farm first, not cabin/loft)
   - `peaceful place I can rent out on weekends` (paraphrase of query 1)
5. Paste real top-3 titles into `docs/semantic-search-verification.md`. Do not invent ranks. Then decide if a stakeholder demo is allowed.

## 7. Next actions for later Sprint 5 work

These are **not** done. Each item is a verb + artifact another learner can pick up.

1. **Filters + vector search** — Add optional structured filters (for example max price, beds) as extra `WHERE` clauses on `match_properties` and on `POST /api/properties/search`, without replacing `ORDER BY embedding <=> query_embedding`.
2. **Hybrid search** — Combine a keyword or Postgres full-text signal with vector similarity. Document in one short note how the two scores are merged (weights, or filter-then-rank). Keep one dimension: **1536**.
3. **Re-embed on update** — When `title` or `description` changes, regenerate `{title}\n\n{description}` through the existing generate helper and upsert `embedding`. Add an idempotent backfill for `embedding IS NULL` rows (reuse `scripts/seed-property-embeddings.ts` or a sibling script).
4. **Grow the evaluation set** — Add more sample listings to `data/sample-properties.json` and a fixed query list with expected “good” ids for queries 1–5. Re-run after seed and record top-3 in `docs/semantic-search-verification.md`.
5. **CI considerations** — Run migration lint / `tsc` / helper unit tests in CI. Do **not** call the live embedding API on every PR (cost and keys). Keep seed + live rank as a manual demo checklist.
6. **Observability** — Log (carefully) truncated query text, helper latency, and top similarity scores from `match_properties`. Never log API keys. Use this to debug bad neighbors after seed exists.

## 8. Open questions for mentor / next owner

From the four source docs (unresolved on purpose):

- Confirm the **production** embedding model name. Dimension stays **1536** unless the data model, TypeScript constant, and `vector(n)` column all change together. Source: `docs/embedding-data-model.md`, `docs/pgvector-setup-plan.md`.
- Confirm cosine `<=>` stays the app-wide distance standard (do not mix `<->` / `<#>` without a new contract). Source: `docs/pgvector-setup-plan.md`.
- Who owns embedding **cost** and **key rotation**? Keys must stay out of git. Source: `docs/semantic-search-requirements.md` (out of scope: billing / keys in git), `docs/pgvector-setup-plan.md`.
- How should demo seed rows satisfy `owner_id NOT NULL` in a shared project (one `SEED_OWNER_ID` vs a dedicated demo user)? Source: `docs/embedding-data-model.md`, `docs/pgvector-setup-plan.md`.
- After a successful seed, which **filter set** (if any) is first for the next stakeholder demo? Filters were out of scope here. Source: `docs/semantic-search-requirements.md`.
- Failed embed: keep the row visible in other UIs but **omit** it from semantic rank while `embedding` is null (recommended). Confirm that product rule. Source: `docs/embedding-data-model.md`.

## 9. Sources used for this handoff

- `docs/semantic-search-requirements.md`
- `docs/embedding-data-model.md`
- `docs/pgvector-setup-plan.md`
- `docs/semantic-search-verification.md`
