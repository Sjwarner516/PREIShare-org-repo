# Sprint 4 — Auth & Listings Verification Checklist

**Project:** PREIshare dashboard  
**Date:** 2026-10-12  
**Verifier:** Sydni Warner (repo review + local HTTP; live Supabase session tests blocked)  
**Environment:** local TanStack Start (`npm run dev`, port 43123). No local `.env` / `.env.local` was present, so signup, create-listing, Table Editor, and User B isolation against a live project were **not run**.

## How to use this doc

Mark each row **PASS** or **FAIL**. Under Evidence, write what you did and what you saw.  
If FAIL, note the fix prompt used and re-test before marking PASS.

This file was filled only from checks actually performed. Live dashboard/auth/RLS rows are FAIL until a human applies the migration, adds a local env file, and repeats those clicks.

---

## 1. Database & migration

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 1.1 | `property_listings` exists in Supabase | FAIL | Could not open Table Editor. No `.env.local` and no linked Supabase CLI in this environment. Table is defined in repo SQL only. |
| 1.2 | RLS is **enabled** on the listings table | FAIL | Not confirmed in the live project. Repo SQL contains `alter table public.property_listings enable row level security;` — apply per `docs/data-model/rls-policy-review.md` then re-check the lock icon. |
| 1.3 | Policies match `docs/data-model/rls-policy-review.md` (select/insert/update scoped to owner) | FAIL | **In-repo SQL matches the review** (`property_listings_select_own`, `_insert_own` WITH CHECK, `_update_own` USING+WITH CHECK, `_delete_own`; `to authenticated`; `owner_id = auth.uid()`; no `USING (true)`; no anon policies). **Not verified** that those policies exist on the hosted project. |
| 1.4 | Migration file present: `supabase/migrations/20250321000000_property_listings.sql` | PASS | Path exists on `main`. Searched file for `create table`, `enable row level security`, four `create policy` blocks. |

## 2. Authentication & session

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 2.1 | Sponsor can sign up with email/password | FAIL | `/auth/signup` returns HTTP 200 (heading “Create a sponsor account”). Did **not** submit a form: no Supabase keys in local env. No User A email recorded. |
| 2.2 | Sponsor can log in via `src/routes/auth/login.tsx` | FAIL | `/auth/login` returns HTTP 200 (“Sponsor sign in”). File uses `createBrowserSupabaseClient()` + `signInWithPassword` only (no service-role string). Did **not** complete a login. |
| 2.3 | Signed-out user hitting `/dashboard` (or listings) is redirected to login | PASS | `curl --max-redirs 0` on `http://127.0.0.1:43123/dashboard` → **307** `location: /auth/login`. Same for `/dashboard/listings`. |
| 2.4 | Sign-out clears session; protected pages no longer load data | FAIL | Header “Sign out” in `src/routes/dashboard/route.tsx` calls browser `signOut()` + `clearAuthCookies()` then `/auth/login`. Not exercised with a live session. |

## 3. Listings happy path (User A)

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 3.1 | Create listing via UI succeeds | FAIL | `/dashboard/listings/new` exists and calls `createListing` from `src/server/listings.ts`. No signed-in submit. No listing title/id to record. |
| 3.2 | New row visible on `src/routes/dashboard/listings/index.tsx` | FAIL | Index loader is `listMyListings()` (not a mock array). Search of listings UI: no `sampleInvestorListings` / `MOCK_`. Not loaded as a signed-in user. |
| 3.3 | Data matches Postgres, not mock arrays in the client | FAIL | Code path is server → `property_listings`. Cannot compare Table Editor without apply + create. |
| 3.4 | Server path used: create/read go through `src/server/listings.ts` | PASS | `index.tsx` imports `listMyListings`; `new.tsx` imports `createListing`. Components do not import `createBrowserSupabaseClient` or a DB client. |

## 4. Row Level Security (User B)

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 4.1 | Second account User B can sign up / log in | FAIL | No second account created. No User B email. |
| 4.2 | User B **cannot** see User A’s listings in the UI | FAIL | **Not run.** Required next: private window, second email, open `/dashboard/listings`. |
| 4.3 | Direct read as User B shows no foreign rows | FAIL | **Not run.** In-repo query also filters `.eq('owner_id', session.user.id)` and uses `createServerSupabaseClient({ accessToken })` so RLS should apply; that is code review, not a second-user proof. |
| 4.4 | User B can create their own listing and only see their own | FAIL | **Not run.** |

## 5. Secret-hygiene audit

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 5.1 | `.env` with real values is **not** committed | PASS | `git check-ignore -v .env` → `.gitignore:7:.env`. `git check-ignore -v .env.local` → `.gitignore:8:.env.local`. `git ls-files` tracks `.env.example` only. No local real env file existed in this workspace. |
| 5.2 | `.env.example` has placeholder values only | PASS | Values are `https://your-project-ref.supabase.co`, `your-anon-or-publishable-key`, `your-service-role-key`. No live project ref or JWT-shaped string. |
| 5.3 | Repo search: no `service_role` **key material** in source, docs, or client config | PASS | `git grep` hits are **names and warnings** in `.env.example`, checklist, schema/RLS docs, and `src/lib/supabase/server.ts` (`process.env.SUPABASE_SERVICE_ROLE_KEY`). No eyJ… / live key strings. Auth UI and listings UI: **zero** hits. |
| 5.4 | Browser-exposed env only uses public anon/URL names | PASS | `src/lib/supabase/client.ts` reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only. No `VITE_SUPABASE_SERVICE_ROLE_KEY` variable. Matches `docs/setup/supabase-env-checklist.md`. |
| 5.5 | Client bundle / Network tab does not send service-role header | FAIL | Logged-out pages load without a session. Did **not** inspect Network as a signed-in sponsor. Re-test after 2.2. |

## 6. Gaps fixed this session

| Gap | Agent fix summary | Re-test result |
|-----|-------------------|----------------|
| Live Supabase apply + two-user RLS not executed (no `.env.local`) | No code change this session. Follow-up: apply `20250321000000_property_listings.sql` in SQL Editor; `cp .env.example .env.local` and paste keys locally; User A create; incognito User B list. Do **not** weaken RLS or add `USING (true)`. | FAIL (blocked) |

## 7. Sign-off

- [ ] Client story covered: sponsors can log in; listings load from Postgres under RLS; secrets kept out of the client bundle
- [x] Failed live rows are honest FAIL with follow-up (not auto-PASS)
- [x] No real secrets written into this markdown file

**Overall:** FAIL  

**Notes for handoff (Step 12):**

- Repo/code checks that passed: migration file + policy text, listings UI wired to `src/server/listings.ts`, signed-out 307 to `/auth/login`, `.env` ignored, `.env.example` placeholders, no service-role in client/listings UI.
- **Must re-run before claiming the sprint:** (1) apply migration, confirm RLS on in Table Editor; (2) User A signup/login/create/list; (3) User B incognito cannot see User A’s row; (4) Network tab as User A shows no service-role header.
- If User B sees User A rows: review `property_listings_select_own` and `src/server/listings.ts` list query; keep user-scoped `accessToken` client; do not use service-role for list/create.
