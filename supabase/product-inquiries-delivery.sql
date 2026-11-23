-- STATUS: NOT APPLIED.
-- Source control only. Do not run this file against any database from an agent,
-- CI, or Vercel Preview. Preview uses the production database. Apply by hand in
-- the Supabase SQL editor only after an explicit decision to do so.
--
-- Additive and idempotent. Existing rows receive delivery_status = 'pending'
-- from the column default. There is no other backfill. No RLS change, no grant
-- change, no new policy. Does not read or write premium_orders.
--
-- Depends on public.product_inquiries from supabase/product-inquiries.sql.
-- Payment status (waitlist/pending_payment/paid/cancelled/failed) stays as it is.
-- delivery_status here is the manual email handoff, unrelated to
-- premium_orders.delivery_status.

alter table public.product_inquiries
  add column if not exists delivery_status text not null default 'pending'
    check (delivery_status in ('pending', 'delivered')),
  add column if not exists delivered_at timestamptz;

comment on column public.product_inquiries.delivery_status is
  'Manual email delivery of the analysis. pending until an admin marks it delivered. Not the payment status.';

comment on column public.product_inquiries.delivered_at is
  'When an admin marked the inquiry delivered. Null while delivery_status is pending.';
