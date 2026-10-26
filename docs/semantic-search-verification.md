# Semantic search verification report (PREIshare)

## Scope checked
- Requirements source: `docs/semantic-search-requirements.md`
- UI: `src/routes/search.tsx`
- API: `src/routes/api/properties/search.ts`
- Search helper: `src/lib/property-search.ts`
- Seed inputs: `data/sample-properties.json`, `scripts/seed-property-embeddings.ts`

## Environment
- Date tested: 2026-10-26 (America/Denver)
- Supabase project (name or ref only, no secrets): **not connected in this Cloud Agent VM** — no `.env` / `.env.local`, no `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `EMBEDDING_API_KEY`, or `SEED_OWNER_ID`
- App run method: local Vite/TanStack Start `npm run dev` on `http://127.0.0.1:43123`
- Embedding model / dimension expected: `text-embedding-3-small` / **1536** (`src/lib/embeddings/types.ts`, `vector(1536)` in `supabase/migrations/20250315000000_enable_pgvector_properties.sql`)

These results were **actually run**. Ranked titles were **not invented**.

## Data checks
| Check | Result | Notes |
| --- | --- | --- |
| Sample properties present | PASS (repo) / FAIL (live DB) | Repo JSON has **8** listings in `data/sample-properties.json`. Live `public.properties` could not be queried (no Supabase credentials in this environment). |
| Embeddings non-null for all samples | FAIL | Live null count: **unknown**. Seed script was **not** run here. Without non-null `embedding vector(1536)` rows, ranking cannot be judged. |
| Seed script re-runnable without breaking search | SKIPPED | `npx tsx scripts/seed-property-embeddings.ts` needs `SUPABASE_*`, `EMBEDDING_API_KEY`, and `SEED_OWNER_ID`. Not available on this VM. |

**Keyword-trap design check (text only, not ranking):** the intended query-1 winner `Cedar hideaway beside a private lake` (`11111111-1111-4111-8111-111111111111`) does **not** contain `cabin`, `water`, `quiet`, `rental`, or `upside`. Query 5 words `peaceful`, `rent out`, and `weekends` are also absent. An `ILIKE` / exact-word search on those buyer phrases should miss it.

## Query results (semantic)

All five requirements queries were POSTed to `/api/properties/search`. The live ranked list was empty because the helper could not embed or call `match_properties`.

| # | Query | Top 3 results (title or id) | Sensible neighbors? | Notes |
| --- | --- | --- | --- | --- |
| 1 | `quiet cabin near water with good rental upside` | *(none)* HTTP **503** `{ error: "Search is not configured", results: [] }` | NO | Could not judge meaning rank. Designed winner: Cedar hideaway (lake, dock, Saturday-to-Sunday guests). Designed losers: nightlife loft, warehouse, farmland. |
| 2 | `family-friendly home close to good schools` | *(none)* HTTP **503** | NO | Designed winners: Three-bed cul-de-sac / Four-bedroom near district campus. |
| 3 | `downtown condo walkable to restaurants` | *(none)* HTTP **503** | NO | Designed winner: Sunlit loft in the core business district (`dining on the block`, `on foot`). |
| 4 | `flat irrigated farmland for row crops` | *(none)* HTTP **503** | NO | Designed winner: Eighty acres of tiled cropland. Fail if a cabin or loft is first. |
| 5 | `peaceful place I can rent out on weekends` | *(none)* HTTP **503** | NO | Paraphrase of query 1. Designed same winner as #1. |

UI (`/search`, HTTP 200): empty submit shows **Type a description of the property you want.** A cabin-near-water submit shows **Search failed** / after the refine, API is **503 Search is not configured**. No hardcoded fake listings appeared.

## Keyword-trap check
- Trap query (paraphrase, not exact listing text): `peaceful place I can rent out on weekends` (requirements query 5); also query 1 `quiet cabin near water with good rental upside`
- Expected kind of property: calm lodging with guest/short-stay income (Cedar hideaway / lakeside cottage), **not** the nightlife loft, inland duplex, or farm
- Actual top results: **none** — API 503, no ranked JSON
- Did semantic search beat exact-keyword matching? **NO** (not proven in this environment)
- Evidence (one sentence): The sample **text** is written so exact buyer words are missing from the intended winner, but live similarity ranking never ran, so this demo cannot yet show a teammate a meaning match without keywords.

## Safety / edge cases
| Case | Expected | Actual | PASS / FAIL |
| --- | --- | --- | --- |
| Empty query | Clear error or empty list, no crash | API `POST {"query":""}` and whitespace → **400** `{ error: "Query is required", results: [] }`. UI empty submit → alert copy, no crash. | PASS |
| Nonsense tokens | Low similarity or empty, no crash | `zzzzqwerty123 not-a-property asdf` → **503** configured-missing (did not reach ranking). No crash, no fake rows. | PARTIAL |
| Very short query | Stable response | `"a"` → **503**, same as other real queries. Stable, not a crash. | PARTIAL |

## Refine cycle (required)
- Failing or weak example (query + bad ranking or error):
  1. **Live:** `quiet cabin near water with good rental upside` returned opaque **500 Search failed** (before refine), so a tester could not tell “not configured” from “RPC/SQL bug.”
  2. **Data (suspected neighbor pollution, not live-ranked):** duplex copy said “No dock, no shoreline” and the warehouse said “dock-high loading.” Those phrases can pull non-waterfront rows toward a waterfront query because embeddings still see *dock* / *shoreline*.
- Suspected layer (seed data / embedding text / SQL distance / helper / API / UI): **API error mapping** + **seed embedding text** (not SQL `<=>` direction — that still matches the notes: distance ASC, `similarity = 1 - distance`, higher better)
- Change made (files touched):
  - `src/lib/property-search.ts` — `PropertySearchError` with `code` (`MISSING_API_KEY`, `RPC_ERROR`, …)
  - `src/routes/api/properties/search.ts` — map `MISSING_API_KEY` to **503** `Search is not configured` (still no secrets in JSON)
  - `data/sample-properties.json` — duplex/warehouse no longer mention dock/shoreline; only the Cedar hideaway keeps waterfront dock language
- Re-test result: empty query still **400**. Cabin/family/downtown/farm/paraphrase/nonsense/short queries now **503** `{ error: "Search is not configured", results: [] }` instead of 500. Winner listing still lacks `cabin`/`water`/`quiet`/`rental`/`upside`. Live ranking still **not** re-run (no embeddings).
- Keep or revert decision: **Keep** both changes. They do not fake ranking. Re-seed on a machine with keys after this JSON change.

## Requirements traceability
| Requirement / success criterion | Met? | Evidence |
| --- | --- | --- |
| Sample properties exist, each with description **and** a stored embedding | NO | 8 descriptions exist in git. Stored vectors in Supabase were not verified (null count unknown). |
| Natural-language query returns a ranked list, best meaning first | NO | API never returned a `results` array of matches; 503 instead. |
| Query 1 top result is waterfront lodging even without `cabin`+`water` in the listing | NO | Ranking not observed. Text of intended winner omits those words (design PASS, runtime FAIL). |
| Query 5 paraphrase also returns calm lodging-with-income near the top | NO | Same 503; no ranked list. |
| Query 4 does not put a cabin or downtown condo first as a strong farm match | NO | Farm listing exists in JSON; live order unknown. |
| Beginner can say why keyword search would miss query 1 | PARTIAL | Can say it from seed text (“listing never uses the buyer’s words”). Cannot show it in the UI yet. |
| Demo `/search` is reachable without maps, login, or payment | YES | `GET /search` → 200. Home links to Search sample properties. Form + loading/error/empty handling exist. |
| Slice stays in scope (no maps, auth redesign, payments, production embedding ops) | YES | Route + helper + samples only; no filters or boost hacks added. |

## Remaining limitations (honest handoff)
- What this tutorial slice does **not** do yet (filters, auth, production embedding jobs, etc.): no price/beds filters, no map, no signed-in buyer, no production embedding batch, no vector index (sample-scale exact scan only). RLS still owner-only on `properties`; the search helper is meant to use the **server** service-role client for this demo.
- Known ranking weaknesses on the sample set: **unmeasured**. Until seed+RPC run, do not claim the Cedar hideaway wins query 1. After seed, watch the inland duplex (monthly yield vs weekend guests) and warehouse (logistics vs lodging) so they stay below waterfront for queries 1 and 5.
- Follow-ups for the next topic:
  1. Put real env on the machine that will demo (`SUPABASE_URL` / `VITE_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `EMBEDDING_API_KEY`, `SEED_OWNER_ID`).
  2. Apply `20250315000000_enable_pgvector_properties.sql` and `20250315000001_match_properties_function.sql`.
  3. Run `npx tsx scripts/seed-property-embeddings.ts` and SQL-check `count(*)` vs `count(*) filter (where embedding is null)` — need **8** rows, **0** null embeddings.
  4. Re-run queries 1–5 against `/api/properties/search` and paste real top-3 titles into this table before stakeholder demo.

## Sign-off
- Verified by: Sydni Warner (Cloud Agent assisted), 2026-10-26
- Ready to demo to a stakeholder? **NO**
- Blockers before demo: live Supabase + embedding key + seed with non-null `vector(1536)` + `match_properties` applied; then fill in the query table with observed titles and scores.
