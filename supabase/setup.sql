-- =====================================================================
-- Arav Fire Safety · Refill Tracker — Supabase setup
-- Supabase → SQL Editor → New query → paste ALL of this → Run (once).
-- =====================================================================

-- 1) Entries table (each sale / refill = one row; details kept in "data")
create table if not exists public.entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists entries_user_idx on public.entries(user_id);
grant select, insert, update, delete on public.entries to authenticated;
revoke all on public.entries from anon;

-- 2) Only the signed-in owner can see / change their rows
alter table public.entries enable row level security;
drop policy if exists "entries_select_own" on public.entries;
drop policy if exists "entries_insert_own" on public.entries;
drop policy if exists "entries_update_own" on public.entries;
drop policy if exists "entries_delete_own" on public.entries;
create policy "entries_select_own" on public.entries for select to authenticated using (auth.uid() = user_id);
create policy "entries_insert_own" on public.entries for insert to authenticated with check (auth.uid() = user_id);
create policy "entries_update_own" on public.entries for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "entries_delete_own" on public.entries for delete to authenticated using (auth.uid() = user_id);

-- 3) Live sync between phone and PC
do $$ begin
  alter publication supabase_realtime add table public.entries;
exception when duplicate_object then null; end $$;

-- 4) Private storage for certificates / bills / photos
insert into storage.buckets (id, name, public)
values ('docs', 'docs', false)
on conflict (id) do nothing;

drop policy if exists "docs_select_own" on storage.objects;
drop policy if exists "docs_insert_own" on storage.objects;
drop policy if exists "docs_update_own" on storage.objects;
drop policy if exists "docs_delete_own" on storage.objects;
create policy "docs_select_own" on storage.objects for select to authenticated
  using (bucket_id = 'docs' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "docs_insert_own" on storage.objects for insert to authenticated
  with check (bucket_id = 'docs' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "docs_update_own" on storage.objects for update to authenticated
  using (bucket_id = 'docs' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "docs_delete_own" on storage.objects for delete to authenticated
  using (bucket_id = 'docs' and (storage.foldername(name))[1] = auth.uid()::text);

-- Done ✅  Next: Authentication → Users → "Add user" (tick Auto Confirm).
