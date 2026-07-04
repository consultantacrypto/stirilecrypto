-- =============================================================================
-- Premium On-Demand TA Orders — /dashboard PremiumCheckoutForm
-- Run standalone in Supabase SQL Editor. Does NOT alter existing tables.
-- Writes from API routes use SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
-- =============================================================================

create table if not exists public.premium_orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  ticker text not null check (char_length(ticker) between 2 and 12),
  amount_ron numeric not null default 100,
  payment_provider text not null
    check (payment_provider in ('stripe', 'binance_pay')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  delivery_status text not null default 'queued'
    check (delivery_status in ('queued', 'processing', 'delivered', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.premium_orders is
  'Premium on-demand technical analysis orders from /dashboard (100 RON).';

create index if not exists premium_orders_status_created_idx
  on public.premium_orders (payment_status, created_at desc);

create index if not exists premium_orders_email_idx
  on public.premium_orders (email);

alter table public.premium_orders enable row level security;

drop policy if exists "Authenticated read premium orders" on public.premium_orders;
create policy "Authenticated read premium orders"
  on public.premium_orders
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated manage premium orders" on public.premium_orders;
create policy "Authenticated manage premium orders"
  on public.premium_orders
  for all
  to authenticated
  using (true)
  with check (true);

-- Reuse shared updated_at trigger if present (safe no-op if function missing)
do $$
begin
  if exists (
    select 1 from pg_proc p
    join pg_namespace n on p.pronamespace = n.oid
    where n.nspname = 'public' and p.proname = 'set_updated_at_timestamp'
  ) then
    drop trigger if exists premium_orders_set_updated_at on public.premium_orders;
    create trigger premium_orders_set_updated_at
      before update on public.premium_orders
      for each row
      execute function public.set_updated_at_timestamp();
  end if;
end $$;
