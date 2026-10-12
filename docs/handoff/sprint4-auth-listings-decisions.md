# Sprint 4 Handoff — Sponsor Auth & Postgres Property Listings

**Project:** PREIshare dashboard  
**Sprint:** 4 (Topic 1) — Supabase auth & database  
**Audience:** Sponsors and the next-sprint implementer  
**Status date:** 2026-10-12  
**Verification overall:** FAIL (see Known limitations). Code and secret-hygiene checks passed; live signup, create, Table Editor, and two-user RLS were **not** run.

## 1. Client story recap

PREIshare sponsors need a secure way to sign in and manage **real** property listings stored in PostgreSQL—not mock cards in the browser. A visitor who is not signed in must not see listing rows. The service-role key and other privileged secrets stay on the server and must never ship in the page.

This sprint does not rebuild the investor marketing site, payments, or live portfolio balances. The signed-in person who creates listings is the **sponsor**.

## 2. Delivered vs original request

| Client need | Delivered? | Where / evidence |
| --- | --- | --- |
| Secure sponsor login | **Partial** | `/auth/signup` and `/auth/login` exist (HTTP 200). Dashboard `beforeLoad` sends signed-out users to login (**307** observed). Live signup, login, and sign-out were **not** completed (`docs/verification/sprint4-auth-listings-checklist.md` 2.1, 2.2, 2.4 FAIL). |
| Postgres-backed listings (create/read/display) | **Partial** | UI at `/dashboard/listings` and `/dashboard/listings/new` calls `listMyListings` / `createListing` in `src/server/listings.ts` (checklist 3.4 PASS). No mock arrays in those pages. Live create + Table Editor match **not** run (3.1–3.3 FAIL). Migration file exists; table **not** confirmed in the hosted project (1.1 FAIL). |
| Row-level security so sponsors only see their own rows | **Partial** | Design + SQL: `owner_id` → `auth.users`, policies `owner_id = auth.uid()` for SELECT/INSERT/UPDATE/DELETE. Server list/create also set/filter `owner_id` from the session. **User B isolation was not run** (checklist §4 all FAIL). |
| Secrets kept out of the client bundle | **Partial** | `.env` ignored; `.env.example` placeholders only; browser client reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only (checklist 5.1–5.4 PASS). Signed-in Network tab **not** inspected (5.5 FAIL). |

**Gaps in one paragraph (from the verification checklist):** The sprint **wrote** the contract, migration, clients, auth pages, server listings functions, and listings UI. It did **not** prove on a live Supabase project that a sponsor can sign up, save a row, or that a second sponsor cannot see the first’s listings. Until those clicks pass, do not treat the client story as closed.

## 3. Architecture decisions (keep short)

- **Auth:** Supabase email/password. Session cookies after browser sign-in. Protected `/dashboard/*` (including listings) checks the user on the **server** and redirects to `/auth/login` if none.
- **Data:** One Postgres table `property_listings` (`docs/data-model/property-listings-schema.md`): `id`, `owner_id`, `title`, `summary`, `property_type`, address fields, optional `asking_price`/`currency`, `status` (`draft`, `published`, `under_offer`, `sold`, `archived`), timestamps. Create/read this sprint; edit/delete UI deferred.
- **Authorization:** RLS on that table; no public catalog. Identity is `auth.uid()`. The app must not trust `owner_id` from the form body.
- **Clients:** `src/lib/supabase/client.ts` — public URL + anon key only. `src/lib/supabase/server.ts` — server-only; listing queries should use the **user JWT** so RLS still runs. The **service-role** key (`SUPABASE_SERVICE_ROLE_KEY`) bypasses RLS and must **never** use a `VITE_` prefix or appear in React.
- **Env hygiene:** Copy `.env.example` → `.env.local`. Public: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Server-only: `SUPABASE_SERVICE_ROLE_KEY` (and optional `SUPABASE_URL`). Never commit real values (`docs/setup/supabase-env-checklist.md`).

## 4. How to run locally (sponsor-friendly)

Do **not** paste real keys into chat, email, or this file.

1. Copy `.env.example` to `.env.local` (or `.env`). Fill names from Supabase → **Project Settings → API** using `docs/setup/supabase-env-checklist.md`. Database password stays in a password manager.
2. Apply `supabase/migrations/20250321000000_property_listings.sql` in the Supabase SQL Editor (steps in `docs/data-model/rls-policy-review.md`). Confirm Table Editor shows `property_listings` with RLS on.
3. In the project folder: `npm install` then `npm run dev` (this repo uses port **43123**).
4. Open `/auth/signup`, create a test sponsor, then `/dashboard/listings` → **Add listing** → confirm the row after save. Sign out and open `/dashboard` — you should return to login.
5. Optional but required before calling the sprint done: a second browser (private window), second email — that person must **not** see the first sponsor’s listing.

## 5. Known limitations

From the brief (never claimed as built): payments, document uploads, social login, admin roles, investor public browse, live portfolio/deals/profile mocks, branded email templates, password-reset UX.

From verification (**honest FAIL / not run**):

- Hosted table + RLS lock not confirmed.
- No User A signup/login/create recorded.
- No User B test — RLS is **designed**, not **proven**.
- Sign-out and Network-tab secret check not exercised with a live session.

Also true of the product as designed: listing **edit/delete** UI is out of scope; contacts and photos are not stored yet; statuses exist in the table but there is no approvals workflow; no search.

## 6. Recommended next-sprint work (pick with stakeholders)

All three **keep** current login, `owner_id` RLS, and the public vs service-role split. Do not replace that with a new Hobby project or a service-role key in the browser.

1. **Richer listing fields** — persist contacts and ownership (already in TypeScript types), add edit/delete **through the same server actions**, tighten required fields. Depends on a passing User A create/list check first.
2. **Approvals workflow** — who may move `draft` → `published` (or reject). New RLS/UI on the **same** table and session; still no public catalog unless the brief changes.
3. **pgvector search** — embeddings + similar listings **after** auth + own-row CRUD are verified. Search must not leak another sponsor’s drafts.

## 7. Open questions for stakeholders

- Who may create listings vs only view them? (Today the design is: signed-in sponsor creates and sees **their** rows only.)
- Is two-sponsor isolation (User B cannot see User A) required to **sign off** this sprint? The checklist says yes before claiming done.
- Preferred next theme: richer fields, approvals, or search?
- Confirm email on/off for local vs production signup?

## 8. Source artifacts

- `docs/requirements/sponsor-auth-and-listings-brief.md`
- `docs/verification/sprint4-auth-listings-checklist.md`
- `docs/data-model/property-listings-schema.md`
- `docs/setup/supabase-env-checklist.md`

Related (not invented here): `docs/data-model/rls-policy-review.md`, `supabase/migrations/20250321000000_property_listings.sql`.
