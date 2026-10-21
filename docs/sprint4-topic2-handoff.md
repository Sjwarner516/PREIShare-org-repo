# Sprint 4 Topic 2 Handoff — PREIshare Sponsor Auth & Protected Listings

Stakeholder summary for the next learner. This topic added sponsor email/password login, a session-gated dashboard, and property list/create under Postgres RLS. It did **not** rebuild the investor marketing site or add an admin console.

**Verification snapshot (2026-10-21):** secret hygiene and signed-out route blocking were proven. A live sign-in, create-as-owner, and two-sponsor isolation test were **not-run**. The security checklist verdict is **not ready** until those checks are completed. See `docs/security-verification-checklist.md`.

---

## Client story outcomes

What a **sponsor** (email/password Supabase Auth account) is built to do now:

- Sign in at `/login` and, with a valid session, open the dashboard shell.
- Open `/dashboard/properties` and see a list of **their** `properties` rows (title, city, status, created date), or a safe empty state.
- Create a draft listing at `/dashboard/properties/new`. The server sets `owner_id` from the signed-in user. The form does not choose the owner.
- Sign out; the next visit to `/dashboard` or property routes should go to login.

What an **anonymous visitor** can do:

- Open the public home page and the login/signup pages.
- Must not stay on `/dashboard` or property routes, and must not create listings.

What was **observed** in the last verification pass (not the same as “fully proven”):

- Logged-out requests to `/dashboard`, `/dashboard/properties`, and `/dashboard/properties/new` returned **307** to `/login`.
- Browser code uses only the public URL and anon key names. No live secret values are in git.
- Successful login, a create that appears on the list, and Sponsor B failing to see Sponsor A’s rows were **not run** in that environment.

---

## Architecture decisions (why we built it this way)

- **Auth:** Supabase Auth email/password. Login uses the browser-safe client (`signInWithPassword`). Dashboard `beforeLoad` checks the session on the server (`getCurrentUser`) and redirects to `/login` when it is missing. Sign-out clears the browser session and auth cookies.
- **Data:** Two tables from the matrix/migration: `profiles` (display name, `id = auth.uid()`) and `properties` (listings). Ownership hinge is `properties.owner_id`. There is **no** `sponsors` table. SELECT/INSERT/UPDATE policies use `owner_id = auth.uid()` (WITH CHECK on write). No `USING (true)`, no anon policies on these tables.
- **Clients:** `src/lib/supabase.client.ts` reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only. `src/lib/supabase.server.ts` exposes `createSupabaseServerClient` (anon key + user session, RLS still applies) and a separate `createSupabaseServiceRoleClient` that must never be imported into React or login/list/create. List and create use the session-aware server client, not the service-role helper.
- **Env hygiene:** Names and purposes live in `docs/env-var-checklist.md` and `.env.example` (placeholders only). Real values stay in gitignored `.env` / `.env.local` or host secret storage. There is no `VITE_SUPABASE_SERVICE_ROLE_KEY`.

---

## Source documents (read these first)

| Doc | Path | Purpose |
| --- | --- | --- |
| Requirements | `docs/sponsor-auth-requirements.md` | Who can see/change what; login and listing stories; secret-hygiene rules |
| Data model & RLS | `docs/data-model-and-rls-matrix.md` | `profiles` + `properties`, `owner_id`, policy matrix |
| Env checklist | `docs/env-var-checklist.md` | Public vs server-only variable names |
| Security verification | `docs/security-verification-checklist.md` | What was tested (pass / fail / not-run) and remaining gaps |

Schema SQL that implements the matrix: `supabase/migrations/20250321000000_sponsors_properties_rls.sql`.

---

## Key implementation files

- `src/lib/supabase.client.ts` — browser-safe Supabase client (public URL + anon key)
- `src/lib/supabase.server.ts` — server-only clients (session/RLS vs service-role escape hatch)
- `src/lib/auth/session.server.ts` — server session read from cookies / JWT
- `src/server/auth.ts` — `getCurrentUser` server function used by the dashboard guard
- `src/server/properties.ts` — property **list** loader (`listMyProperties`)
- `src/routes/login.tsx` — sponsor email/password login
- `src/routes/dashboard.tsx` — session-aware dashboard layout
- `src/routes/dashboard/properties.tsx` — protected property list
- `src/routes/dashboard/properties.new.tsx` — create form + `createProperty` (sets `owner_id` from `getUser()`)
- `supabase/migrations/20250321000000_sponsors_properties_rls.sql` — schema + RLS
- `.env.example` — placeholder env names only

An older listings path (`src/routes/dashboard/listings/`, `src/server/listings.ts`) still talks to `property_listings`. The matrix says treat that name as the same listings idea as `properties` — do not add a third listings table. Topic 2 list/create for RLS is `/dashboard/properties`.

---

## Known limitations

Copied from `docs/security-verification-checklist.md` (do not treat these as passed):

- **Not ready for stakeholders** (verdict **no**, 2026-10-21) until live checks are re-run.
- **Not-run:** successful login (2.2), logout after a real session (2.4), signed-in property list (3.1), list vs known owned rows (3.2), create-as-owner insert (4.2), Sponsor B cannot list Sponsor A (5.1), direct cross-sponsor read/update (5.2). Cause: no `.env.local` and no two test sponsor accounts in that verification pass.
- Listing fields are **minimal** (`title`, `city`, `description`, `status` as `draft` on create). Address, photos, prices, and published marketplace read are out of scope.
- **Admin**, public editor, OAuth, and multi-sponsor / team ownership are out of scope.
- **Sponsor invites** and extra roles are not implemented.
- **CI/CD secret injection** (GitHub Actions / host env) is not done here.
- Older `src/lib/supabase/server.ts` can still build a service-role client if called without an access token. Topic 2 property list/create do not use that path; keep `SUPABASE_SERVICE_ROLE_KEY` off `VITE_` on deploy.

This topic is **designed** so RLS isolates rows. Isolation is **not** marked pass until two users are tested.

---

## Recommended next work (next topic / sprint)

1. Re-run the open verification rows with two Supabase Auth test users, then update `docs/security-verification-checklist.md` (do not skip this).
2. Richer property listing fields and validation aligned to PREIshare product needs (address, type, price) — still `owner_id` from the session, still RLS.
3. Sponsor invite or role model if more than one person should manage the same account.
4. CI secret injection and deploy-time env checks so production never uses committed secrets.
5. Automated tests that Sponsor A cannot read or update Sponsor B’s `properties` rows.

---

## Handoff checklist for the next learner

- [ ] Read the four source docs in the table above before changing auth or RLS.
- [ ] Confirm local `.env` / `.env.local` matches `.env.example` **names**; never commit real secret values.
- [ ] Apply `supabase/migrations/20250321000000_sponsors_properties_rls.sql` on the project you test against.
- [ ] Create two test sponsors; re-run checklist rows 2.2, 2.4, 3.1, 3.2, 4.2, 5.1, and 5.2.
- [ ] Keep service-role usage server-only; never add `VITE_SUPABASE_SERVICE_ROLE_KEY`.
- [ ] After any policy or client change, re-run `docs/security-verification-checklist.md` and update statuses honestly.
