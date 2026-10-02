-- Crypto Azi — daily editorial briefs
-- Migration only: do NOT apply to Production from this PR step.
-- Grants + RLS: public/authenticated read published only.
-- Mutations: service_role only (server actions after admin auth). No SECURITY DEFINER shortcuts.

create or replace function public.crypto_daily_briefs_takeaways_valid(t jsonb)
returns boolean
language sql
immutable
as $$
  select
    t is not null
    and jsonb_typeof(t) = 'array'
    and jsonb_array_length(t) = 3
    and coalesce(nullif(btrim(t -> 0 ->> 'title'), ''), null) is not null
    and coalesce(nullif(btrim(t -> 0 ->> 'why_it_matters'), ''), null) is not null
    and coalesce(nullif(btrim(t -> 0 ->> 'source_label'), ''), null) is not null
    and coalesce(nullif(btrim(t -> 0 ->> 'source_url'), ''), null) is not null
    and (t -> 0 ->> 'source_url') ~* '^https?://'
    and coalesce(nullif(btrim(t -> 1 ->> 'title'), ''), null) is not null
    and coalesce(nullif(btrim(t -> 1 ->> 'why_it_matters'), ''), null) is not null
    and coalesce(nullif(btrim(t -> 1 ->> 'source_label'), ''), null) is not null
    and coalesce(nullif(btrim(t -> 1 ->> 'source_url'), ''), null) is not null
    and (t -> 1 ->> 'source_url') ~* '^https?://'
    and coalesce(nullif(btrim(t -> 2 ->> 'title'), ''), null) is not null
    and coalesce(nullif(btrim(t -> 2 ->> 'why_it_matters'), ''), null) is not null
    and coalesce(nullif(btrim(t -> 2 ->> 'source_label'), ''), null) is not null
    and coalesce(nullif(btrim(t -> 2 ->> 'source_url'), ''), null) is not null
    and (t -> 2 ->> 'source_url') ~* '^https?://';
$$;

create table if not exists public.crypto_daily_briefs (
  id uuid primary key default gen_random_uuid(),
  brief_date date not null,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  title text not null,
  introduction text not null default '',
  takeaways jsonb not null
    check (public.crypto_daily_briefs_takeaways_valid(takeaways)),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Display / audit only — never used for authorization.
  author_id uuid references auth.users (id) on delete set null,
  author_name text,
  constraint crypto_daily_briefs_published_requires_published_at check (
    status <> 'published' or published_at is not null
  )
);

comment on table public.crypto_daily_briefs is
  'Daily Crypto Azi editorial brief (Europe/Bucharest calendar date in brief_date).';

comment on column public.crypto_daily_briefs.brief_date is
  'Calendar date for the briefing in Europe/Bucharest (store the RO civil date, not UTC day).';

comment on column public.crypto_daily_briefs.takeaways is
  'JSON array of exactly 3 objects: {title, why_it_matters, source_label, source_url}.';

comment on column public.crypto_daily_briefs.author_name is
  'Display-only redactor label. Never use for authorization.';

comment on column public.crypto_daily_briefs.author_id is
  'Optional FK to auth.users for audit. ON DELETE SET NULL. Not an authorization gate.';

-- At most one published brief per Bucharest calendar date.
create unique index if not exists crypto_daily_briefs_one_published_per_date_idx
  on public.crypto_daily_briefs (brief_date)
  where status = 'published';

create index if not exists crypto_daily_briefs_status_date_idx
  on public.crypto_daily_briefs (status, brief_date desc);

create index if not exists crypto_daily_briefs_status_published_at_idx
  on public.crypto_daily_briefs (status, published_at desc nulls last);

create index if not exists crypto_daily_briefs_author_id_idx
  on public.crypto_daily_briefs (author_id);

-- updated_at: same shared helper used by dashboard tables (idempotent create or replace).
create or replace function public.set_updated_at_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists crypto_daily_briefs_set_updated_at on public.crypto_daily_briefs;
create trigger crypto_daily_briefs_set_updated_at
  before update on public.crypto_daily_briefs
  for each row
  execute function public.set_updated_at_timestamp();

-- Data API: explicit grants. Mutations only via service_role (server actions).
alter table public.crypto_daily_briefs enable row level security;

revoke all on table public.crypto_daily_briefs from anon, authenticated;
grant select on table public.crypto_daily_briefs to anon, authenticated;
grant all on table public.crypto_daily_briefs to service_role;

drop policy if exists "Public read published crypto daily briefs" on public.crypto_daily_briefs;
drop policy if exists "Authenticated manage crypto daily briefs" on public.crypto_daily_briefs;

-- anon + authenticated: published rows only (draft/archived never via Data API JWT).
create policy "Public read published crypto daily briefs"
  on public.crypto_daily_briefs
  for select
  to anon, authenticated
  using (status = 'published');

-- No INSERT/UPDATE/DELETE policies for anon or authenticated.
-- Admin CRUD uses service_role after server-side requireAdminUser().
