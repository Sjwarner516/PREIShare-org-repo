# RLS policy review — property_listings

## Migration file

- Path: `supabase/migrations/20250321000000_property_listings.sql`
- What it creates: `public.property_listings` (columns from `docs/data-model/property-listings-schema.md`), indexes on `owner_id` and `(owner_id, status)`, `updated_at` trigger, RLS enabled, four own-row policies, grants only to `authenticated`

## How to apply

Use a **Supabase** Postgres project (the `auth` schema must exist). Do not run this against a blank local Postgres with no Auth.

### Option A — Dashboard SQL Editor (beginner default)

1. Open the PREIshare project in the [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor → New query**.
3. Paste the **full** contents of `supabase/migrations/20250321000000_property_listings.sql`.
4. Run the query and confirm success (no error).
5. Open **Table Editor → `property_listings`**.
6. Confirm the table exists and **RLS is enabled** (lock / “RLS” indicator on).
7. Open **Authentication → Policies** (or the table’s **Policies** tab) and confirm four policies scoped to `authenticated` / `owner_id = auth.uid()`.

If apply fails halfway, drop the table only after you understand the error (`drop table if exists public.property_listings;`) and re-run the **entire** file so you never leave a table with RLS off.

### Option B — Supabase CLI (if already linked)

```bash
supabase db push
```

That applies versioned files under `supabase/migrations/` in name order. This filename must stay `20250321000000_property_listings.sql`.

### After apply

The table will look empty until a later step signs a sponsor in and inserts a row. That is expected. **Do not** “fix” emptiness with `USING (true)` or an anon read policy.

## Decisions locked in this SQL (were open in the design doc)

- **Delete:** hard `ON DELETE CASCADE` from `auth.users`; DELETE policy is own-row only. The app UI still must not expose delete this sprint (brief).
- **`country`:** column `NOT NULL` default `'US'` when the insert omits it.
- **`status` / `property_type`:** `text` plus `CHECK` constraints (not Postgres enums).
- **`asking_price`:** nullable; if set, `>= 0` and `currency` must be `USD`, `CAD`, or `EUR`. Both null together is allowed (draft without money).
- **Update `updated_at`:** `BEFORE UPDATE` trigger `property_listings_set_updated_at`.

## Policies (plain language)

| Policy | Operation | Who | Rule |
|--------|-----------|-----|------|
| `property_listings_select_own` (`listings_select_own`) | SELECT | authenticated | `USING (owner_id = auth.uid())` — only your rows |
| `property_listings_insert_own` (`listings_insert_own`) | INSERT | authenticated | `WITH CHECK (owner_id = auth.uid())` — cannot insert as someone else |
| `property_listings_update_own` (`listings_update_own`) | UPDATE | authenticated | `USING` **and** `WITH CHECK (owner_id = auth.uid())` — cannot edit others’ rows or reassign `owner_id` |
| `property_listings_delete_own` (`listings_delete_own`) | DELETE | authenticated | `USING (owner_id = auth.uid())` — cannot delete others’ rows |

No policy exists for the `anon` role. Logged-out clients get no listing rows. There is no public catalog policy.

Privilege layer (separate from RLS): `REVOKE ALL` from `anon` and `PUBLIC`; `GRANT SELECT, INSERT, UPDATE, DELETE` to `authenticated` only. RLS still filters which rows those grants can see.

## Alignment with design doc

| Design requirement | In this migration? | Notes |
| --- | --- | --- |
| Table `property_listings` | Yes | `public.property_listings` |
| `id` uuid PK `gen_random_uuid()` | Yes | `pgcrypto` extension if needed |
| `owner_id` NOT NULL FK → `auth.users(id)` `ON DELETE CASCADE` | Yes | |
| `title`, `summary`, `property_type`, address fields, `asking_price`, `currency`, `status`, timestamps | Yes | `summary` not `description`; `region` not `state`; `asking_price numeric(12,2)` not `price_cents` |
| Status values `draft`, `published`, `under_offer`, `sold`, `archived` | Yes | Check constraint; default `draft` |
| Property types from the domain brief | Yes | Check constraint |
| Index on `owner_id` | Yes | Also `(owner_id, status)` |
| RLS enabled | Yes | `ENABLE ROW LEVEL SECURITY` |
| Own-row SELECT / INSERT WITH CHECK / UPDATE USING+WITH CHECK / DELETE | Yes | `to authenticated` only |
| No public / anon / `USING (true)` writes | Yes | |
| Contacts, images, vector search, world-readable published list | Not created | Out of scope |

Scaffold-style columns (`description`, `state`, `price_cents`, status of only three values) were **rejected** so SQL matches the approved design, not a generic blog table.

## Risks and open questions

- **Service role bypasses RLS.** Keep `SUPABASE_SERVICE_ROLE_KEY` server-only (see `docs/setup/supabase-env-checklist.md`). Never `VITE_` or browser `import.meta.env`.
- **Empty table after apply** is normal until login + create exist. Do not add a public SELECT.
- **Should published listings be readable by other sponsors later?** Not this sprint. The brief forbids a public catalog. Adding that policy would be a new product decision.
- **Two test users:** later, confirm user A cannot SELECT/UPDATE user B’s row with the anon key + A’s JWT.
- **`auth.users` FK:** apply only on Supabase-hosted Postgres. A leftover half-applied table without RLS must be dropped and the file re-run in full.

## Sign-off

- Reviewed by: Sydni Warner (PREIshare Sprint 4)
- Date: 2026-10-12
- Matches `docs/data-model/property-listings-schema.md` for columns, ownership, and RLS. Ready for the SQL Editor apply step on the existing Hobby Supabase project.
