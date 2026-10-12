# Property Listings Data Model & Auth Boundaries

> Sprint 4 design doc for PREIshare. Source of truth for migrations and RLS.
> Inputs: docs/requirements/sponsor-auth-and-listings-brief.md,
>         docs/setup/supabase-env-checklist.md
>
> Product language comes from `src/types/investor-listing.ts` (title, summary,
> address, property type, status, asking price). This file does **not** contain
> migration SQL — the next step must match this blueprint.

## 1. Purpose

Sponsors sign in and manage **real** property listings stored in Postgres.
No mock arrays in the browser (`sampleInvestorListings`, `DealsList` defaults,
or React state). Secrets (`SUPABASE_SERVICE_ROLE_KEY`) never ship to the client.

This sprint’s product contract (from the brief): a signed-in sponsor can
**create** a listing and **read** listings they own. Ownership is `auth.uid()`,
enforced in the database. Logged-out visitors see no listing rows.

## 2. Entity: `property_listings`

One table. One row is one listing (for example the East Village 48-unit walk-up).
Nested TypeScript objects (address, financial summary) flatten into columns so
Postgres and RLS stay simple this sprint. Contacts and ownership objects stay
out of this table (see §6).

| Column | Type (Postgres) | Nullable | Notes |
|--------|-----------------|----------|-------|
| `id` | `uuid` | no | Primary key; default `gen_random_uuid()`. Same job as `InvestorListing.id`. |
| `owner_id` | `uuid` | no | FK → `auth.users(id)`; the signed-in sponsor who owns the row. Not in the old TS type — required for RLS. |
| `title` | `text` | no | Short headline (`InvestorListing.title`). |
| `summary` | `text` | yes | Longer listing copy (`InvestorListing.summary`). Empty allowed on first create. |
| `property_type` | `text` | no | Closed set from the domain: `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land`. |
| `address_line1` | `text` | no | Street (`Address.line1`). |
| `address_line2` | `text` | yes | Suite / unit (`Address.line2`). |
| `city` | `text` | no | `Address.city`. |
| `region` | `text` | no | State / province (`Address.region`). |
| `postal_code` | `text` | no | `Address.postalCode`. |
| `country` | `text` | no | Short country code (`Address.country`). Default `'US'` on insert if the form omits it. |
| `asking_price` | `numeric(12,2)` | yes | `FinancialSummary.askingPrice`. Null allowed on first create (drafts in the type system may omit money). If set, must be `>= 0`. |
| `currency` | `text` | yes | `USD`, `CAD`, or `EUR`. Required when `asking_price` is set. |
| `status` | `text` | no | Domain lifecycle: `draft`, `published`, `under_offer`, `sold`, `archived`. App create this sprint should insert `draft` only. Check constraint on these five values. |
| `created_at` | `timestamptz` | no | Default `now()`. |
| `updated_at` | `timestamptz` | no | Default `now()`; bump on update. |

### Indexes (recommended)

- Primary key on `id`
- Index on `owner_id` (filter “my listings”)
- Optional index on `(owner_id, status)` if the dashboard later filters drafts vs published

### Constraints the migration must include

- `owner_id` NOT NULL
- `status` IN (`draft`, `published`, `under_offer`, `sold`, `archived`)
- `property_type` IN (`multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land`)
- `asking_price` IS NULL OR `asking_price` >= 0
- If `asking_price` IS NOT NULL then `currency` IN (`USD`, `CAD`, `EUR`)

### Out of scope for this sprint (do not add tables or policies)

- Images / media / document uploads
- Contacts, `primary_contact_id`, or nested ownership rows (types exist; persist later)
- Full-text search / pgvector
- Multi-sponsor shared ownership or team membership
- Investor-facing “read all published listings”
- Payments, OAuth, admin roles
- Replacing mock portfolio / deals / profile widgets with live balances

## 3. Ownership model

- Every listing row **must** have `owner_id` set to the Supabase Auth user id of the sponsor who created it (`auth.users.id`, same value as `auth.uid()` in RLS).
- `owner_id` references `auth.users(id)` with **`ON DELETE CASCADE`**: if the auth user is removed, their listings go too. Soft-delete (`deleted_at`) is an open question, not this sprint’s default.
- Application code **never** accepts a client-supplied `owner_id` that differs from the signed-in user. Server actions set `owner_id` from the session. RLS `WITH CHECK (owner_id = auth.uid())` is the backstop if someone tampers with the payload.
- “Only my listings” is **not** a React `.filter` or `.eq('owner_id', user.id)` in the browser. The database refuses other owners’ rows.

## 4. Proposed Row Level Security (RLS) — plain language

Enable RLS on `property_listings`. No policy = no access.

| Policy name (suggested) | Command | Who | Rule |
|-------------------------|---------|-----|------|
| `listings_select_own` | SELECT | authenticated | `owner_id = auth.uid()` |
| `listings_insert_own` | INSERT | authenticated | `WITH CHECK (owner_id = auth.uid())` — insert is rejected unless the new row’s owner is the current user |
| `listings_update_own` | UPDATE | authenticated | `USING (owner_id = auth.uid())` **and** `WITH CHECK (owner_id = auth.uid())` — cannot edit someone else’s row or reassign `owner_id` |
| `listings_delete_own` | DELETE | authenticated | `USING (owner_id = auth.uid())` |

Notes:

- Anonymous (logged-out) users get **no** listing access. The brief: visitors reach login/signup only; they cannot see listing data.
- Do **not** add a public “read all published listings” policy. The brief defers investor browse.
- The app this sprint only **creates and reads**. Still add UPDATE and DELETE policies so a later edit UI cannot skip RLS. If the migration omitted them, a service-role or a future client could open a hole.
- Service-role key **bypasses RLS**. Use it only on the server for admin/maintenance that a later step proves is required. Never import it in browser code. Prefer the user JWT + anon key + these policies for listing CRUD.

## 5. Server vs browser operation map

| Operation | Runs where | Client type | Notes |
|-----------|------------|-------------|-------|
| Sign up / sign in / sign out | Browser + Supabase Auth | Browser (anon/public key + user session) | `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` only. No service-role. |
| Session check for protected `/dashboard` (and listings pages) | Server loader / `beforeLoad` | Server Supabase client with the **user session** (cookies/JWT) | Redirect to login if no session. Do not use service-role to “see if they’re logged in.” |
| List my listings | Server loader | Server client **as the user** (RLS applies) | Trusted data for the UI. Not `sampleInvestorListings`. |
| Create listing | Server action | Server client as the user; set `owner_id` from session | Validate title, address, status=`draft` server-side. |
| Update / archive listing | Server action (UI out of scope this sprint) | Server client as the user | RLS blocks cross-owner edits. |
| Delete listing | Server action (UI out of scope this sprint) | Server client as the user | Own-row DELETE only. |
| Admin bulk jobs | Server only (out of scope) | Service-role | Never import `SUPABASE_SERVICE_ROLE_KEY` into a client module or a `VITE_` name. |

### Environment boundary reminder

- Public / browser: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (see `docs/setup/supabase-env-checklist.md`).
- Server-only: `SUPABASE_SERVICE_ROLE_KEY` (and optional `SUPABASE_URL`). No `VITE_` prefix. Never `import.meta.env` for the service-role key.
- If listing create/list ran in the browser with the service-role key, any sponsor could read or write every row. That fails the brief.

## 6. Acceptance checks for the next (migration) step

- [ ] Table `property_listings` matches the column list above
- [ ] `owner_id` is required and FK to `auth.users` with `ON DELETE CASCADE`
- [ ] RLS enabled with own-row SELECT / INSERT (`WITH CHECK`) / UPDATE (`USING` + `WITH CHECK`) / DELETE
- [ ] No policy grants world-readable or anonymous access
- [ ] No public published-listings SELECT
- [ ] Migration file is the only place SQL is introduced — not undocumented dashboard clicks
- [ ] App create/list uses the **user session** on the server, not the service-role key in the browser

## 7. Open questions (resolve before or during migration)

- Default `country` if the first sponsors list outside the US (`'US'` is the insert default only).
- Postgres `enum` vs `text` + check constraint for `status` and `property_type` (check constraint is enough this sprint).
- Soft-delete (`deleted_at`) vs hard DELETE — this sprint uses hard DELETE in policy only; the UI should not delete yet.
- Whether first-create must require `asking_price` (types allow drafts without money; brief only requires create + read of owned rows).
- When (later sprint) to persist contacts and ownership as related tables without inventing a second listing model.
