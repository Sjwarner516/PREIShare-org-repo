-- Adds ONLY the private shortlist table.
-- property_id points at public.properties, which already exists.
-- This file does not CREATE or ALTER properties or property_listings.
-- It does not enable pgvector, add an embedding column, or create match_properties.

create table if not exists public.saved_properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  property_id uuid not null references public.properties (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint saved_properties_user_property_unique unique (user_id, property_id)
);

create index if not exists saved_properties_user_id_idx
  on public.saved_properties (user_id);

alter table public.saved_properties enable row level security;

drop policy if exists saved_properties_select_own on public.saved_properties;
create policy saved_properties_select_own
  on public.saved_properties
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists saved_properties_insert_own on public.saved_properties;
create policy saved_properties_insert_own
  on public.saved_properties
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists saved_properties_update_own on public.saved_properties;
create policy saved_properties_update_own
  on public.saved_properties
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists saved_properties_delete_own on public.saved_properties;
create policy saved_properties_delete_own
  on public.saved_properties
  for delete
  to authenticated
  using (user_id = auth.uid());

revoke all on table public.saved_properties from anon, public;
grant select, insert, update, delete on table public.saved_properties to authenticated;

comment on table public.saved_properties is
  'Private per-investor shortlist. Each signed-in user can read and change only their own rows.';
