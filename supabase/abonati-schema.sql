-- Run in Supabase SQL Editor: newsletter / lead capture table

create table if not exists public.abonati (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists abonati_email_idx on public.abonati (email);

alter table public.abonati enable row level security;

-- Allow anonymous visitors to subscribe (INSERT only)
create policy "anon_insert_abonati"
  on public.abonati
  for insert
  to anon
  with check (true);

-- Optional: allow authenticated admin to read all subscribers
create policy "authenticated_select_abonati"
  on public.abonati
  for select
  to authenticated
  using (true);
