# Saved properties data model

## Migration file

- Path: `supabase/migrations/20260415000000_saved_properties.sql`
- Creates: `public.saved_properties`, unique `(user_id, property_id)`, index on `user_id`, row level security, four own-row policies
- Does not create: `properties`, `property_listings`, pgvector, an embedding column, or `match_properties`

## Columns (later steps must keep these names)

| Column | Type | Rule |
| --- | --- | --- |
| id | uuid | primary key, default `gen_random_uuid()` |
| user_id | uuid | not null, references `auth.users(id)` on delete cascade, compared to `auth.uid()` |
| property_id | uuid | not null, references the existing listings table on delete cascade |
| created_at | timestamptz | not null, default `now()` |

## Foreign key target

- Listings table used: `public.properties`
- Why this name: semantic search and `match_properties` already rank `public.properties`, and that table already exists in `supabase/migrations/20250321000000_sponsors_properties_rls.sql`. `public.property_listings` also exists and is left unchanged.
- This migration does not CREATE that table: yes

## Unique pair and index

- Unique `(user_id, property_id)` so one signed-in investor saves a listing once.
- Index on `user_id` so listing that investor's shortlist does not scan every row.
- Both foreign keys use `ON DELETE CASCADE`, so a deleted auth user or a deleted `properties` row removes the shortlist rows that pointed at them.

## Policies (plain language)

| Policy | Action | Who | Rule |
| --- | --- | --- | --- |
| saved_properties_select_own | SELECT | authenticated | A signed-in investor can read a shortlist row only when `user_id` is their `auth.uid()`. |
| saved_properties_insert_own | INSERT | authenticated | A signed-in investor can insert a row only when `WITH CHECK` proves `user_id` is their `auth.uid()`. |
| saved_properties_update_own | UPDATE | authenticated | A signed-in investor can update a row only when both `USING` and `WITH CHECK` keep `user_id` equal to their `auth.uid()`. |
| saved_properties_delete_own | DELETE | authenticated | A signed-in investor can delete a row only when `user_id` is their `auth.uid()`. |
| (none) | any | anon | No policy. Privileges are revoked from `anon` and `public`, so a visitor cannot read the shortlist. |

## What was not recreated

`public.properties` and pgvector were not recreated. This migration does not `CREATE` or `ALTER` `properties` or `property_listings`, does not `CREATE EXTENSION vector`, does not add an embedding column, and does not create `match_properties`.

## Second-pass review (you write this, not the agent)

- Reviewed SQL before apply: yes
- Reviewer: Sydni
- Date: 2026-11-19
- Problems sent back to the agent: none. The file creates only `public.saved_properties`. Insert and update both include `WITH CHECK (user_id = auth.uid())`. Update also has `USING`. No `USING (true)`. No policy for `anon`.

## Apply status

- Existing Supabase project label only (no URL with a key, no password): existing Hobby Supabase project
- Applied / Not applied yet: Not applied yet
- New Supabase project created: no

## Risks

- A hidden Save button is not isolation. These policies are.
- The service role bypasses RLS. That key is not in this repo.
