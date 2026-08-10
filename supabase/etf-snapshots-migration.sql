-- =============================================================================
-- ETF snapshots migration — run in Supabase SQL Editor
-- Keeps asset_symbol + net_flow_usd (existing). Adds etf_name, inflow/outflow, aum.
-- =============================================================================

alter table public.etf_snapshots
  add column if not exists etf_name text not null default 'AGGREGATE',
  add column if not exists inflow_usd numeric not null default 0,
  add column if not exists outflow_usd numeric not null default 0,
  add column if not exists aum_usd numeric,
  add column if not exists updated_at timestamptz not null default now();

-- Drop legacy unique (asset_symbol, snapshot_date) if present
alter table public.etf_snapshots
  drop constraint if exists etf_snapshots_unique_day;

alter table public.etf_snapshots
  drop constraint if exists etf_snapshots_asset_date_key;

-- New unique: one row per asset + product + day
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'etf_snapshots_asset_etf_date_unique'
  ) then
    alter table public.etf_snapshots
      add constraint etf_snapshots_asset_etf_date_unique
      unique (asset_symbol, etf_name, snapshot_date);
  end if;
end $$;

create index if not exists idx_etf_snapshots_asset_date
  on public.etf_snapshots (asset_symbol, snapshot_date desc);

-- Mark frozen July seed rows so the API can prefer fresh manual/auto data
update public.etf_snapshots
set source = 'legacy_seed'
where snapshot_date <= date '2026-07-04'
  and (source is null or source in ('manual', 'legacy_seed'));

create or replace function public.update_etf_snapshots_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_etf_snapshots_updated_at on public.etf_snapshots;
create trigger update_etf_snapshots_updated_at
  before update on public.etf_snapshots
  for each row
  execute function public.update_etf_snapshots_updated_at();
