-- Run in Supabase SQL Editor (fresh install)

create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  guest_name text not null,
  excerpt text not null default '',
  content text not null default '',
  cover_image text,
  badge text not null default 'EXCLUSIV',
  status text not null check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

create index if not exists interviews_status_created_at_idx
  on public.interviews (status, created_at desc);

create index if not exists interviews_slug_idx
  on public.interviews (slug);

alter table public.interviews enable row level security;

drop policy if exists "Public read published interviews" on public.interviews;
create policy "Public read published interviews"
  on public.interviews
  for select
  using (status = 'published');

drop policy if exists "Authenticated manage interviews" on public.interviews;
create policy "Authenticated manage interviews"
  on public.interviews
  for all
  to authenticated
  using (true)
  with check (true);
