-- =============================================================================
-- Dashboard public route (/dashboard) — Phase A
-- Run this entire script in Supabase SQL Editor (Dashboard → SQL → New query)
--
-- Tables:
--   1. pulse_terminal_snapshots  — Market Pulse Terminal (S/R/Trend + affiliate)
--   2. mica_compliance_items     — MiCA Safety Radar (exchanges + stablecoins)
--
-- Editorial Market Pulse articles remain in public.stiri (content_type = market_pulse).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Market Pulse Terminal snapshots
-- -----------------------------------------------------------------------------

create table if not exists public.pulse_terminal_snapshots (
  id uuid primary key default gen_random_uuid(),
  asset_symbol text not null default 'BTC',
  asset_label text not null default 'Bitcoin',
  trend text not null default 'neutral'
    check (trend in ('bullish', 'bearish', 'neutral', 'range')),
  support_levels jsonb not null default '[]'::jsonb,
  resistance_levels jsonb not null default '[]'::jsonb,
  summary text,
  linked_article_slug text,
  affiliate_partner text not null default 'bybit',
  affiliate_url text not null default 'https://partner.bybit.eu/b/STIRICRYPTO',
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pulse_terminal_levels_array_shape check (
    jsonb_typeof(support_levels) = 'array'
    and jsonb_typeof(resistance_levels) = 'array'
  )
);

comment on table public.pulse_terminal_snapshots is
  'Structured technical levels for /dashboard Market Pulse Terminal (not editorial stiri).';

comment on column public.pulse_terminal_snapshots.support_levels is
  'JSON array, e.g. [{"price": 92000, "label": "S1"}, {"price": 89500, "label": "S2"}]';

comment on column public.pulse_terminal_snapshots.resistance_levels is
  'JSON array, e.g. [{"price": 98000, "label": "R1"}, {"price": 102000, "label": "R2"}]';

comment on column public.pulse_terminal_snapshots.linked_article_slug is
  'Optional soft link to /market-pulse/{slug} editorial article.';

create index if not exists pulse_terminal_published_idx
  on public.pulse_terminal_snapshots (status, published_at desc nulls last);

create index if not exists pulse_terminal_asset_published_idx
  on public.pulse_terminal_snapshots (asset_symbol, status, published_at desc nulls last);

-- At most one published snapshot per asset (e.g. one active BTC terminal).
create unique index if not exists pulse_terminal_one_published_per_asset_idx
  on public.pulse_terminal_snapshots (asset_symbol)
  where status = 'published';

-- -----------------------------------------------------------------------------
-- 2. MiCA Safety Radar items
-- -----------------------------------------------------------------------------

create table if not exists public.mica_compliance_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  entity_type text not null
    check (entity_type in ('exchange', 'stablecoin')),
  compliance_status text not null
    check (compliance_status in ('safe', 'risky', 'banned', 'transitional')),
  jurisdiction text,
  notes text,
  source_url text,
  sort_order int not null default 0,
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

comment on table public.mica_compliance_items is
  'MiCA compliance status list for /dashboard MiCA Safety Radar.';

create index if not exists mica_compliance_list_idx
  on public.mica_compliance_items (status, entity_type, sort_order, name);

-- -----------------------------------------------------------------------------
-- 3. updated_at trigger (shared)
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pulse_terminal_snapshots_set_updated_at on public.pulse_terminal_snapshots;
create trigger pulse_terminal_snapshots_set_updated_at
  before update on public.pulse_terminal_snapshots
  for each row
  execute function public.set_updated_at_timestamp();

drop trigger if exists mica_compliance_items_set_updated_at on public.mica_compliance_items;
create trigger mica_compliance_items_set_updated_at
  before update on public.mica_compliance_items
  for each row
  execute function public.set_updated_at_timestamp();

-- -----------------------------------------------------------------------------
-- 4. Row Level Security (matches interviews pattern)
-- -----------------------------------------------------------------------------

alter table public.pulse_terminal_snapshots enable row level security;
alter table public.mica_compliance_items enable row level security;

drop policy if exists "Public read published pulse terminal snapshots" on public.pulse_terminal_snapshots;
create policy "Public read published pulse terminal snapshots"
  on public.pulse_terminal_snapshots
  for select
  using (status = 'published');

drop policy if exists "Authenticated manage pulse terminal snapshots" on public.pulse_terminal_snapshots;
create policy "Authenticated manage pulse terminal snapshots"
  on public.pulse_terminal_snapshots
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Public read published mica compliance items" on public.mica_compliance_items;
create policy "Public read published mica compliance items"
  on public.mica_compliance_items
  for select
  using (status = 'published');

drop policy if exists "Authenticated manage mica compliance items" on public.mica_compliance_items;
create policy "Authenticated manage mica compliance items"
  on public.mica_compliance_items
  for all
  to authenticated
  using (true)
  with check (true);

-- -----------------------------------------------------------------------------
-- 5. Optional seed (comment out if you prefer empty tables)
-- -----------------------------------------------------------------------------

-- Example BTC terminal draft — publish from /admin/dashboard when ready.
insert into public.pulse_terminal_snapshots (
  asset_symbol,
  asset_label,
  trend,
  support_levels,
  resistance_levels,
  summary,
  affiliate_partner,
  affiliate_url,
  status
)
select
  'BTC',
  'Bitcoin',
  'range',
  '[{"price": 92000, "label": "S1"}, {"price": 89500, "label": "S2"}]'::jsonb,
  '[{"price": 98000, "label": "R1"}, {"price": 102000, "label": "R2"}]'::jsonb,
  'BTC consolidează într-un range instituțional. Monitorizăm reclaim-ul peste R1 pentru confirmare bullish.',
  'bybit',
  'https://partner.bybit.eu/b/STIRICRYPTO',
  'draft'
where not exists (
  select 1 from public.pulse_terminal_snapshots where asset_symbol = 'BTC'
);

-- Example MiCA radar rows (draft) — edit/publish in admin.
insert into public.mica_compliance_items (name, slug, entity_type, compliance_status, jurisdiction, notes, sort_order, status)
values
  ('Bybit EU', 'bybit-eu', 'exchange', 'safe', 'Austria (MiCA)', 'Licență CASP FMA Austria — entitate UE.', 10, 'draft'),
  ('Binance', 'binance', 'exchange', 'transitional', 'UE (multi-hub)', 'În tranziție MiCA; verifică entitatea de onboarding.', 20, 'draft'),
  ('USDT', 'usdt', 'stablecoin', 'transitional', 'UE', 'EMT în tranziție; atenție la delistări locale.', 10, 'draft'),
  ('USDC', 'usdc', 'stablecoin', 'safe', 'UE', 'EMI reglementat în UE (Circle).', 20, 'draft')
on conflict (slug) do nothing;
