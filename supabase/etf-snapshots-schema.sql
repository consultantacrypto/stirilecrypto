-- =============================================================================
-- ETF Institutional Flows — /dashboard EtfFlowsSection
-- Run standalone in Supabase SQL Editor. Does NOT alter existing tables.
-- =============================================================================

create table if not exists public.etf_snapshots (
  id uuid primary key default gen_random_uuid(),
  asset_symbol text not null check (asset_symbol in ('BTC', 'ETH')),
  snapshot_date date not null,
  net_flow_usd numeric not null,
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  constraint etf_snapshots_unique_day unique (asset_symbol, snapshot_date)
);

comment on table public.etf_snapshots is
  'Daily net ETF institutional flows (USD) for /dashboard ETF widget. Negative = outflow.';

comment on column public.etf_snapshots.net_flow_usd is
  'Net flow in USD. Positive = inflow (green), negative = outflow (red).';

create index if not exists etf_snapshots_asset_date_idx
  on public.etf_snapshots (asset_symbol, snapshot_date desc);

alter table public.etf_snapshots enable row level security;

drop policy if exists "Public read etf snapshots" on public.etf_snapshots;
create policy "Public read etf snapshots"
  on public.etf_snapshots
  for select
  using (true);

drop policy if exists "Authenticated manage etf snapshots" on public.etf_snapshots;
create policy "Authenticated manage etf snapshots"
  on public.etf_snapshots
  for all
  to authenticated
  using (true)
  with check (true);

-- Optional seed: last 5 trading days (edit dates/values before running in production)
insert into public.etf_snapshots (asset_symbol, snapshot_date, net_flow_usd, source)
values
  ('BTC', current_date - 4,  245_000_000,  'manual'),
  ('BTC', current_date - 3, -180_000_000,  'manual'),
  ('BTC', current_date - 2,  520_000_000,  'manual'),
  ('BTC', current_date - 1,  310_000_000,  'manual'),
  ('BTC', current_date,      125_000_000,  'manual'),
  ('ETH', current_date - 4,   85_000_000,  'manual'),
  ('ETH', current_date - 3,  -42_000_000,  'manual'),
  ('ETH', current_date - 2,  110_000_000,  'manual'),
  ('ETH', current_date - 1,   67_000_000,  'manual'),
  ('ETH', current_date,       -28_000_000,  'manual')
on conflict (asset_symbol, snapshot_date) do nothing;
