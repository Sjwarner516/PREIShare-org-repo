# PREIshare — Data model and RLS policy matrix

## Purpose

Design-only blueprint for sponsor auth and property listings.  
**No `CREATE TABLE` / `CREATE POLICY` scripts in this file.** Step 6 migrations must follow this document; do not invent extra tables or open policies (`USING (true)` for all listings) without updating this file first.

Plain-language plan: who owns each row, which columns a listing needs, and which **database** rules (not React conditionals) keep sponsor A off sponsor B’s properties.

## Source requirements

Consumed from: `docs/sponsor-auth-requirements.md`

That brief already decided: email/password sign-in; listing `owner_id` is the signed-in `auth.users` id (`auth.uid()`); admin and public marketplace are out of scope. This matrix **adds** a `profiles` row so the dashboard can store a display name without changing that ownership hinge.

## Actors and identities

| Actor | How identity is established | Notes |
|-------|----------------------------|-------|
| Anonymous visitor | No Supabase session | Must not read or write sponsor properties. Home and `/auth/login` are app routes, not table grants. |
| Sponsor (authenticated) | Supabase Auth user; `auth.uid()` is their user id | May **list** and **create** only rows they own. Form body must not pick a different `owner_id`. |
| Admin | — | **Out of scope.** No admin table, no “see all listings” policy. |
| Service role / server admin tasks | Secret `SUPABASE_SERVICE_ROLE_KEY` on the server only | Bypasses RLS. **Not** used from the browser. List/create in the app use the **user JWT + anon key** so these policies still run. |

## Tables

Two entities: **sponsor linkage** and **listings**. `auth.users` is provided by Supabase Auth (not designed here).

### `profiles` (sponsor linkage)

Links a Supabase Auth user to sponsor display data. Primary key **is** the auth user id so RLS can use `id = auth.uid()`.

| Column | Type (intent) | Required | Notes |
|--------|---------------|----------|-------|
| id | uuid (PK, = `auth.users.id`) | yes | Same value as `auth.uid()` after signup/login |
| display_name | text | yes | Shown in dashboard chrome (email may be used until this is set) |
| created_at | timestamptz | yes | Default now() |

This table is **not** a second source of ownership. Listings still hang off `auth.uid()` via `properties.owner_id`.

### `properties` (listings owned by a sponsor)

Dashboard cards need a title plus at least location or status or a timestamp. Ownership column is the RLS hinge.

| Column | Type (intent) | Required | Notes |
|--------|---------------|----------|-------|
| id | uuid (PK) | yes | Generated default |
| owner_id | uuid (FK → `auth.users.id` or `profiles.id`) | yes | **RLS hinge** — must equal `auth.uid()` for owner policies. Same type as Auth user id. App sets this from the session, never from a trusted form field. |
| title | text | yes | Listing title |
| description | text | no | Longer copy (`summary` in the product language) |
| city | text | no | Simple location for cards; more address fields can be added later |
| status | text | yes | e.g. `draft` \| `published` (constrain in app or CHECK). Create this sprint should insert `draft`. |
| created_at | timestamptz | yes | Default now() |
| updated_at | timestamptz | yes | Bump on change |

If an older sketch used the name `property_listings`, treat it as **this same table**: keep `owner_id` and the policies below; do not add a second listings table.

## RLS posture

- Enable RLS on **every** table above before the API is trusted.
- No broad `USING (true)` policies for `authenticated` on `properties`.
- No policies (and no grants) for `anon` on `profiles` or `properties`.
- Browser clients use the anon/authenticated key only; never the service role.
- Guessing another listing’s `id` still fails: the policy is on **the row**, not on hiding Edit in React.

## RLS policy matrix

Each row is one future Postgres `POLICY` (plain English + intended predicate shape only).

| Table | Operation | Who | Rule (plain English) | Intended SQL shape (for Step 6) |
|-------|-----------|-----|----------------------|----------------------------------|
| profiles | SELECT | Authenticated sponsor | Can read own profile only | `id = auth.uid()` |
| profiles | INSERT | Authenticated sponsor | Can create own profile row only | `WITH CHECK (id = auth.uid())` |
| profiles | UPDATE | Authenticated sponsor | Can update own profile only | `USING` + `WITH CHECK (id = auth.uid())` |
| profiles | DELETE | — | Denied for sponsors this sprint | No policy / no grant |
| profiles | ALL | Anonymous | No access | No policy for `anon` |
| properties | SELECT | Authenticated sponsor | Can read **only** listings they own | `owner_id = auth.uid()` |
| properties | INSERT | Authenticated sponsor | Can insert **only** if the new row’s owner is themselves | `WITH CHECK (owner_id = auth.uid())` |
| properties | UPDATE | Authenticated sponsor | Can update **only** owned rows; cannot reassign `owner_id` to someone else | `USING (owner_id = auth.uid())` and `WITH CHECK (owner_id = auth.uid())` |
| properties | DELETE | Authenticated sponsor | Can delete **only** owned rows **if** the product allows delete; otherwise no policy (prefer `status = archived`) | `owner_id = auth.uid()` **or** no policy — see open questions |
| properties | ALL | Anonymous | No access — not even published rows this sprint | No policy for `anon` |

**Reject in Step 6:** `properties` SELECT for `authenticated` with `USING (true)`, “any logged-in user can read all listings,” or anon SELECT on private listings.

## Requirement → design mapping

| Requirement (from `docs/sponsor-auth-requirements.md`) | Satisfied by |
|-----------------------------------------------|--------------|
| Sponsors sign in with email/password so the app knows who is acting (§3 story 1) | Auth session; policies use `auth.uid()`. No table stores passwords. |
| After sign-in, list **only my** properties — not another sponsor’s rows, not mock arrays as source of truth (§3 story 2, §5 list criterion) | `properties.owner_id`; SELECT `owner_id = auth.uid()` |
| Create a property owned by **my** account; ignore body `owner_id` (§3 story 3, §5 create criterion) | INSERT `WITH CHECK (owner_id = auth.uid())`; app sets `owner_id` from session |
| Anonymous visitor: login page only; no dashboard listing rows; no create/change (§2, §3 story 4) | No `anon` policies on `properties` / `profiles`; route gate is separate (app) |
| Logged-out `/dashboard` or `/dashboard/listings` blocked (§3 observable rules) | App session check **and** empty/denied table access for anon |
| RLS `owner_id = auth.uid()`, not only hidden buttons (§4, §5, threat “security by hiding buttons”) | Matrix SELECT/INSERT/UPDATE (and DELETE if enabled) on `properties` |
| Guessing another sponsor’s property id must not read/edit it (§6 threat) | Same ownership predicates on SELECT and UPDATE, including by primary key |
| Service-role key never in the browser; list/create must not bypass RLS (§2, §6, §7) | Posture: authenticated role + user JWT. Service role is out of band, not a sponsor policy. |
| Dashboard card fields: title plus location/status/time (§3 list, scaffold) | `title`, `city`, `status`, `created_at` |
| Admin / public marketplace / public write (§2, §4) | Out of scope — no extra SELECT for anon, no admin role |
| Optional profile later without changing ownership stories (§8) | `profiles.id = auth.users.id`; listings still key off `owner_id` = `auth.uid()` |

## Out of scope this sprint

- Public marketplace read of published listings (would need a **separate, intentional** SELECT policy — do not add it in Step 6 by accident)
- Multi-sponsor / team ownership of one property
- Admin override UI or “view everyone’s listings”
- Document uploads, photos, payments, investor public browse
- Using the service-role key from React or a `VITE_` name
- `USING (true)` “so the dashboard loads”

## Open questions for review

- [ ] Confirm DELETE vs soft-delete (`status = 'archived'`) with the team. In-scope stories are **list** and **create**; UPDATE/DELETE stay **own-row-only** if implemented, never all-authenticated.
- [ ] Confirm whether a `profiles` row is created by a trigger on signup or on first login. Listings must work even if display_name is still empty (use email).
- [ ] View-only sponsors (may list, may not create) — not in the brief; do not add a second role in Step 6.

## Ready for Step 6 when

- [x] Every sponsor-facing action in the requirements maps to a matrix row (list, create, anon deny, id-guess deny).
- [x] `owner_id` exists and is named consistently for `auth.uid()`.
- [x] No policy grants all authenticated users access to all properties.
- [ ] Human review: no Step 6 SQL until this file is agreed.
