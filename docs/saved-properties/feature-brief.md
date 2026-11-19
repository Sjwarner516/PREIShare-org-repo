# Saved Properties feature brief

Status: topic 1 draft. This topic builds the shortlist. It does not merge.
Branch: feature/saved-properties

## Actor

The only actor is the signed-in investor: the person who is logged in and chooses to save a property.

- That person may read and change only their own shortlist.
- Another investor must not see or edit those saved rows.
- A visitor who is not signed in must not open the shortlist.
- Login screens I opened (`src/routes/login.tsx` and `src/routes/auth/login.tsx`) say "Sponsor sign in" and "New sponsor?". If login screens say "sponsor", that word still means one signed-in account. The shortlist key is that account's user id (`auth.uid()`), not a shared company list. The app shell title in `src/routes/__root.tsx` is "PREIshare Investor Dashboard"; that is the same one account, not a second actor.

Hiding a Save button in the browser is not enough. The database must refuse other people's rows.

## What the investor needs

- Save a property that already exists in a listings table named in the inspection log (`properties` or `property_listings`). Do not create another listings table to hold those rows.
- Remove a property from their own shortlist.
- Open a `/saved` page that requires sign-in.
- From a saved property, see More like this by reusing the existing `match_properties` similarity search. That function already ranks `properties` with the embedding column that is already on that table. Do not add a new embedding column or a new match function.

## Do not recreate

Leave these alone. They already exist in this repo:

- The TanStack Start app (`package.json`, routes under `src/routes/`, including `src/routes/__root.tsx`). Do not scaffold a new app.
- The existing listings tables recorded below: `property_listings` and `properties`. Do not rename either table and do not create a second listings table.
- pgvector and the existing embedding column on `properties` (`supabase/migrations/20250315000000_enable_pgvector_properties.sql`). Do not enable pgvector again and do not add a second embedding column.
- The existing `match_properties` function and search page. Reuse them. Do not replace `match_properties` and do not add a new match function.
- `.github/workflows/pr-ci.yml`. Do not add a second continuous integration workflow and do not edit that file in topic 1.
- The one Vercel Hobby project recorded in `docs/vercel-hobby-setup.md`. Do not create a new hosting project. Do not paste secrets, passwords, or `.env` lines into this brief.

## Topic split

- Topic 1 (this work): inspect the repo and build the shortlist on branch `feature/saved-properties`. Stop before the merge pull request.
- Topic 2: demo, open a pull request, wait for a human review and a green `pr-ci` check, merge, then confirm the same Production URL. Do not merge early and do not create a second host.

## Inspection log

Each path below is a file opened in this repo. `src/lib/search/vector-search.ts` is not found; the search helper on disk is `src/lib/property-search.ts`.

| Area | Path I opened | What it already does (one sentence) | Decision |
| --- | --- | --- | --- |
| App shell or routes | `src/routes/__root.tsx` | TanStack Start root route that wraps the existing pages; `package.json` already depends on `@tanstack/react-start`. | Extend, do not replace |
| Supabase server or browser client | `src/lib/supabase/server.ts` and `src/lib/supabase/client.ts` | Folder pair of server and browser Supabase clients; the server client keeps user-scoped reads on the anon key plus the signed-in session so existing row rules still apply. | Reuse |
| Supabase session client pair | `src/lib/supabase.server.ts` and `src/lib/supabase.client.ts` | Flat pair already used for sponsor session cookies on the server and for browser sign-in. | Reuse |
| Listings table and row rules | `supabase/migrations/20250321000000_property_listings.sql` | Creates `property_listings` and turns on row rules so a signed-in account can reach only rows they own. Table name: `property_listings`. | Do not recreate this table |
| Listings table and row rules | `supabase/migrations/20250321000000_sponsors_properties_rls.sql` | Creates `profiles` and `properties`, and limits `properties` rows to the signed-in account that owns them. Table name: `properties`. | Do not recreate this table |
| Listings row-rule notes | `docs/data-model/rls-policy-review.md` | Reviews the `property_listings` policies already written in the migration above. | Do not write a replacement policy file for listings |
| Listings row-rule notes | `docs/data-model-and-rls-matrix.md` | Describes `properties` ownership as `owner_id` matching the signed-in user, and says not to add another listings table. | Do not recreate `properties` |
| Search or match_properties | `supabase/migrations/20250315000001_match_properties_function.sql` | Defines `match_properties`, which ranks `properties` by the existing embedding column. | Reuse for More like this |
| Search or match_properties | `src/routes/search.tsx` | Existing semantic search page that asks the current search API for property matches. | Reuse |
| Search or match_properties | `src/lib/property-search.ts` | Server helper that calls the existing `match_properties` function. | Reuse for More like this |
| Embedding column | `supabase/migrations/20250315000000_enable_pgvector_properties.sql` | Enables pgvector and stores one embedding column on `properties`. | Do not add a second embedding column |
| CI workflow | `.github/workflows/pr-ci.yml` | Runs install, typecheck, build, lint, and test on pull requests. | Do not add a second workflow |
| Hosting notes | `docs/vercel-hobby-setup.md` | One Hobby project and a Production URL already exist. | Same project; no secrets copied here |

## Planned pieces (requirements only — no code in this file)

- A later `saved_properties` table, keyed to the signed-in user id, with row rules so each investor sees only their own rows. This is a new shortlist table. It is not a new `properties` table and not a new `property_listings` table.
- Save and remove controls on existing property cards and search results.
- A `/saved` route that requires sign-in.
- More like this that calls the existing similarity helper (`match_properties` via `src/lib/property-search.ts`).

## Out of scope for topic 1

- Merging to main.
- Opening the pull request (that is topic 2).
- A new Vercel project.
- New secrets in git.
- Rewriting listings, embeddings, `match_properties`, or `pr-ci.yml`.
- A second embedding column, a second match function, or a second continuous integration workflow.

## Check before commit

- I opened every path in the inspection log.
- No API keys, passwords, or environment-variable values are in this file.
- This commit adds this brief only.
