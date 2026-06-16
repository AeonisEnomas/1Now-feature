-- ============================================================
-- 1Now Social Studio — Supabase schema
-- Run this in the Supabase SQL editor (Project → SQL → New query).
-- ============================================================

-- One row per user holding the saved fields for both features.
create table if not exists public.studio_profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  business_card jsonb,
  car_post      jsonb,
  updated_at    timestamptz default now()
);

-- Row Level Security: users can only see / edit their own row.
alter table public.studio_profiles enable row level security;

drop policy if exists "own profile - select" on public.studio_profiles;
create policy "own profile - select"
  on public.studio_profiles for select
  using (auth.uid() = id);

drop policy if exists "own profile - insert" on public.studio_profiles;
create policy "own profile - insert"
  on public.studio_profiles for insert
  with check (auth.uid() = id);

drop policy if exists "own profile - update" on public.studio_profiles;
create policy "own profile - update"
  on public.studio_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
