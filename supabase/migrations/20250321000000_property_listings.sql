-- supabase/migrations/20250321000000_property_listings.sql
-- Implements docs/data-model/property-listings-schema.md (not a generic listing table).
-- owner_id → auth.users so RLS can use auth.uid(). No anon policies. No USING (true).

create extension if not exists "pgcrypto";

create table if not exists public.property_listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  summary text,
  property_type text not null
    check (property_type in (
      'multifamily',
      'office',
      'retail',
      'industrial',
      'mixed_use',
      'land'
    )),
  address_line1 text not null,
  address_line2 text,
  city text not null,
  region text not null,
  postal_code text not null,
  country text not null default 'US',
  asking_price numeric(12, 2)
    check (asking_price is null or asking_price >= 0),
  currency text
    check (
      (asking_price is null and currency is null)
      or (
        asking_price is not null
        and currency in ('USD', 'CAD', 'EUR')
      )
    ),
  status text not null default 'draft'
    check (status in (
      'draft',
      'published',
      'under_offer',
      'sold',
      'archived'
    )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists property_listings_owner_id_idx
  on public.property_listings (owner_id);

create index if not exists property_listings_owner_id_status_idx
  on public.property_listings (owner_id, status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists property_listings_set_updated_at on public.property_listings;
create trigger property_listings_set_updated_at
before update on public.property_listings
for each row
execute function public.set_updated_at();

alter table public.property_listings enable row level security;

-- Table privileges: authenticated may reach the table; RLS still filters rows.
-- Do not grant to anon or PUBLIC (no world-readable catalog).
revoke all on table public.property_listings from anon, public;
grant select, insert, update, delete on table public.property_listings to authenticated;

-- Design names: listings_select_own / listings_insert_own / listings_update_own / listings_delete_own

create policy "property_listings_select_own"
  on public.property_listings
  for select
  to authenticated
  using (owner_id = auth.uid());

create policy "property_listings_insert_own"
  on public.property_listings
  for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "property_listings_update_own"
  on public.property_listings
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "property_listings_delete_own"
  on public.property_listings
  for delete
  to authenticated
  using (owner_id = auth.uid());
