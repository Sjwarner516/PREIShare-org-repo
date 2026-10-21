# Security verification checklist — PREIshare sponsor auth & properties

**Date:** 2026-10-21  
**Verifier:** Sydni  
**Build / branch:** `main` at `c0b6c28` (Show session check and session-owned insert in createProperty)  
**Related docs:** docs/sponsor-auth-requirements.md, docs/env-var-checklist.md, docs/data-model-and-rls-matrix.md

Status values: `pass` | `fail` | `not-run`

This file records what was **personally observed** in this environment (file review + local HTTP against the running Vite app). It does not invent passes for flows that were not executed. No secret values are pasted here — only env **names**.

---

## 1. Environment and secret hygiene

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 1.1 | Browser-safe client (`src/lib/supabase.client.ts`) uses only public URL + anon key | Opened the file. `createBrowserSupabaseClient()` reads `import.meta.env.VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only. Login and dashboard sign-out import this module. | pass | No service-role import or env read in this file. |
| 1.2 | Service-role / secret key used only in server module (`src/lib/supabase.server.ts`) or never used in this topic | Opened `src/lib/supabase.server.ts`. `createSupabaseServerClient` uses the anon key + cookies. `createSupabaseServiceRoleClient` reads `SUPABASE_SERVICE_ROLE_KEY` on the server only. Project search: `SERVICE_ROLE` appears in server modules and `.env.example` comments/placeholders, not in `src/routes/`. | pass | List/create paths use `createSupabaseServerClient`, not the service-role helper. Older `src/lib/supabase/server.ts` still has a server-only service-role fallback — see residual risks. |
| 1.3 | No raw secrets committed in source or checklist | `rg` over `src/` and `docs/` found no JWT-like strings. `.env` / `.env.local` are gitignored and were **not present** in this workspace. This checklist contains names only. | pass | Never paste live keys here. |
| 1.4 | `.env.example` documents required vars without real values | Compared to docs/env-var-checklist.md. Placeholders only: `https://your-project-ref.supabase.co`, `your-anon-key-here`, `your-service-role-key-here`. Warns not to name the secret `VITE_SUPABASE_SERVICE_ROLE_KEY`. | pass | Matches the env checklist contract. |

**Section result:** pass

---

## 2. Login and session-aware routing

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 2.1 | Unauthenticated visit to dashboard (or properties) redirects or blocks access | Logged-out `curl --max-redirs 0` against the running app (`npm run dev`, port 43123). `/dashboard`, `/dashboard/properties`, and `/dashboard/properties/new` each returned **307** `location: /login`. `/login` returned **200**. | pass | Matches `src/routes/dashboard.tsx` `beforeLoad` (`getCurrentUser` → redirect `/login`). |
| 2.2 | Valid sponsor credentials reach an authenticated dashboard session | Could not complete a live `signInWithPassword` in this environment: no `.env` / `.env.local` and no Supabase test user configured here. | not-run | Code path is `src/routes/login.tsx` → browser client `signInWithPassword` → persist cookies → `/dashboard`. Re-run after copying `.env.example` and creating a sponsor in Supabase Auth. |
| 2.3 | Invalid credentials do not grant dashboard access | Submitted the login form with a non-sponsor email/password while signed out. Stayed on `/login`; dashboard was not opened. HTML `required` also blocks empty fields. | pass | Error text in this environment was a missing public env message (no live keys), not a Supabase “invalid login” string. Still no session and no dashboard. Re-run with live keys to confirm the Auth error copy. |
| 2.4 | Logout clears session; protected routes no longer load data as that user | Live sign-out after a successful login was not run (blocked by 2.2). Code review: dashboard Sign out calls browser `signOut()`, `clearAuthCookies()`, then navigates to `/login`. Signed-out HTTP already blocks the same URLs (2.1). | not-run | Residual: prove cookie clear after a real session. |

**Section result:** partial (2.1 and 2.3 pass; 2.2 and 2.4 not-run)

---

## 3. Property list isolation (RLS)

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 3.1 | Signed-in sponsor sees property list UI from `src/routes/dashboard/properties.tsx` | Could not reach the list as a signed-in sponsor (no live session). Opened `/dashboard/properties` signed out — redirected to `/login` (no list markup). File review: route loader calls `listMyProperties` (server fn). | not-run | Re-run after 2.2. |
| 3.2 | List shows only rows owned by the current sponsor (per docs/data-model-and-rls-matrix.md) | No signed-in list vs known seed rows. Policy review: migration `properties_select_own` is `USING (owner_id = auth.uid())`. Loader selects `id, title, city, status, created_at` with **no** React filter-by-owner. | not-run | Intended control is Postgres RLS on the server path, not a client `owner_id` filter. |
| 3.3 | Empty state is safe (no error that leaks other tenants’ data) | Read `src/routes/dashboard/properties.tsx`. Empty branch shows “No properties yet” and RLS copy. Error branch uses a fixed user-safe string (`Could not load properties. Try again.`). Signed-out visitors never receive the list (2.1). | pass | Code + logged-out HTTP. Live empty list after login not observed. |

**Section result:** partial (3.3 pass from code + logged-out block; 3.1–3.2 not-run)

---

## 4. Property create under RLS

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 4.1 | Create form on `src/routes/dashboard/properties.new.tsx` requires an authenticated session | Logged-out `curl` to `/dashboard/properties/new` → **307** `/login`. Handler also returns “You must be signed in to add a property.” when `getSession` / `getUser` has no user — no insert. | pass | Signed-in form render not observed (depends on 2.2). |
| 4.2 | Successful create inserts a row owned by the current sponsor | No live insert. Code review: `createProperty` sets `owner_id: user.id` after `getUser()`; form validator keeps only title/city/description. INSERT policy is `WITH CHECK (owner_id = auth.uid())`. | not-run | Re-run: sign in, submit title + city, confirm the row appears only for that user and `owner_id` matches `auth.users.id`. |
| 4.3 | Create failure (validation or RLS) does not expose secret keys or raw DB internals in the UI | File review: empty title returns `Title is required.` Insert failures return `error.message` into `role="alert"`. Title input is `required`. No service-role names in the route file. Did not trigger a live RLS denial. | pass | Notes: `error.message` is the Supabase message (needed so a policy reject is visible). It must not include secrets; rotate if a deploy ever leaks a key into that string. |

**Section result:** partial (4.1 and 4.3 pass; 4.2 not-run)

---

## 5. Cross-sponsor access attempt

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 5.1 | Sponsor B cannot list Sponsor A’s properties in the UI | Not run. This environment has **no** second sponsor account (and no first live login). | not-run | See residual risks. Do not treat policy text as a UI pass. |
| 5.2 | Direct read/update of another sponsor’s row is denied by RLS (UI and/or Supabase policy behavior) | Policy review only: `properties_select_own` / `properties_update_own` / `properties_insert_own` all hinge on `owner_id = auth.uid()`. No second-user UI or Table Editor attempt. | not-run | Matrix requires this as a sign-off gate. Re-run with User A and User B. |

**Section result:** not-run

---

## 6. Gaps found and fixes applied

| Gap (checklist #) | What was wrong | Fix applied (files) | Re-test status |
|-------------------|----------------|---------------------|----------------|
| | | | |

None — every check that was **run** passed. Several required demo checks remain **not-run** (no local Supabase env, no test sponsors). Those are residual risks, not silent passes.

---

## 7. Residual risks (honest leftovers)

- **No live sponsor session in this environment.** `.env` / `.env.local` were absent. 2.2, 2.4, 3.1, 3.2, and 4.2 are not-run until a test user signs in against a real project.
- **Cross-sponsor isolation (5.1, 5.2) not-run.** Only policy text was reviewed. A second sponsor account is required before claiming User B cannot see User A’s rows.
- **Logout after a real session not proven (2.4).** Signed-out HTTP is blocked; cookie-clear after `signOut()` still needs a live loop.
- **Older server helper** `src/lib/supabase/server.ts` can still construct a service-role client when no access token is passed. Sponsor list/create on `properties` do not use that path. Keep `SUPABASE_SERVICE_ROLE_KEY` off `VITE_` and out of the browser on deploy.
- **Create UI may surface `error.message` from Supabase (4.3).** Useful for RLS/constraint failures; watch that it never includes secret material.

---

## 8. Stakeholder verdict

**Ready to show stakeholders?** no

**Summary (3–5 sentences):**  
File review of `src/lib/supabase.client.ts` vs `src/lib/supabase.server.ts` shows the browser path uses only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The service-role name appears in server modules and `.env.example` placeholders, not in login or properties routes, and no live keys are in git. Logged-out HTTP on 2026-10-21 proved `/dashboard`, `/dashboard/properties`, and `/dashboard/properties/new` redirect to `/login`. I did **not** complete a successful sponsor login, a create-as-owner insert, or a two-user isolation test, so list isolation and create-under-RLS are not proven in a running session. Re-run 2.2, 2.4, 3.1, 3.2, 4.2, 5.1, and 5.2 with two Supabase Auth test users before changing this verdict to yes.

**Sign-off:** Sydni, 2026-10-21
