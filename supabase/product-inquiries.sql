-- Product waitlist / manual orders for:
--   Analiză tehnică multi-timeframe
--   Raport de risc pentru o monedă crypto
-- Additive. Does not alter stiri, premium_orders, or admin tables.
-- Run in the Supabase SQL editor before expecting the order API to persist rows.
-- Writes use SUPABASE_SERVICE_ROLE_KEY. Payments stay off until PAYMENTS_ENABLED=true.

create table if not exists public.product_inquiries (
  id uuid primary key default gen_random_uuid(),
  product text not null check (product in ('ta_mtf', 'risk_report', 'bundle')),
  email text not null,
  asset text,
  amount_ron numeric,
  currency text not null default 'RON',
  consent_immediate_delivery boolean not null,
  payload jsonb not null,
  status text not null default 'waitlist'
    check (status in ('waitlist', 'pending_payment', 'paid', 'cancelled', 'failed')),
  stripe_session_id text,
  created_at timestamptz not null default now()
);

comment on table public.product_inquiries is
  'Manual/assisted orders and waitlist for multi-timeframe TA and token risk reports. Not a payment ledger until Stripe is enabled.';

create index if not exists product_inquiries_created_idx
  on public.product_inquiries (created_at desc);

create index if not exists product_inquiries_email_idx
  on public.product_inquiries (email);

alter table public.product_inquiries enable row level security;

drop policy if exists "Authenticated read product inquiries" on public.product_inquiries;
create policy "Authenticated read product inquiries"
  on public.product_inquiries
  for select
  to authenticated
  using (true);
