-- Existing databases already have product_inquiries from product-inquiries.sql.
-- That check constraint does not allow address_check. Run this once in the Supabase SQL editor.
-- It does not change stiri, payments, or existing rows.

alter table public.product_inquiries
  drop constraint if exists product_inquiries_product_check;

alter table public.product_inquiries
  add constraint product_inquiries_product_check
  check (product in ('ta_mtf', 'risk_report', 'bundle', 'address_check'));

comment on table public.product_inquiries is
  'Orders and waitlists. ta_mtf is the paid technical analysis. address_check is the unpaid address-check notify list.';
