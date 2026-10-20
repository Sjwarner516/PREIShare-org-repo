-- supabase/migrations/20250321000000_sponsors_properties_rls.sql
-- Implements docs/data-model-and-rls-matrix.md only.
-- Tables: public.profiles, public.properties.
-- Hinge: properties.owner_id = auth.uid(); profiles.id = auth.uid().
-- No USING (true). No anon policies. No extra tables.

-- ---------------------------------------------------------------------------
-- profiles: 1:1 sponsor linkage with auth.users
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

revoke all on table public.profiles from anon, public;
grant select, insert, update on table public.profiles to authenticated;

create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy profiles_insert_own
  on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid());

create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- profiles DELETE: no policy / no grant (matrix: denied this sprint)

-- ---------------------------------------------------------------------------
-- properties: listings owned by a sponsor
-- owner_id → auth.users so a listing can exist before a profiles row
-- ---------------------------------------------------------------------------
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  city text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint properties_status_check check (status in ('draft', 'published'))
);

create index if not exists properties_owner_id_idx
  on public.properties (owner_id);

create or replace function public.set_properties_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row
  execute function public.set_properties_updated_at();

alter table public.properties enable row level security;

revoke all on table public.properties from anon, public;
grant select, insert, update, delete on table public.properties to authenticated;

create policy properties_select_own
  on public.properties
  for select
  to authenticated
  using (owner_id = auth.uid());

create policy properties_insert_own
  on public.properties
  for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy properties_update_own
  on public.properties
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy properties_delete_own
  on public.properties
  for delete
  to authenticated
  using (owner_id = auth.uid());

-- Review checklist vs docs/data-model-and-rls-matrix.md:
-- [x] RLS enabled on profiles and properties
-- [x] No USING (true) on sponsor/property data
-- [x] INSERT/UPDATE include WITH CHECK tied to auth.uid()
-- [x] Columns/FKs match the matrix (profiles, properties.owner_id)
-- [x] No anon policies; profiles has no DELETE policy
