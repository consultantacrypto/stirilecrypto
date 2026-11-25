-- Newsletter unsubscribe for public.abonati.
--
-- Apply this manually in the Supabase SQL editor.
-- Do not apply it from the app, from CI, or from the Vercel Preview.
-- The preview uses the production database.
--
-- Existing rows stay subscribed: unsubscribed_at is null until a subscriber
-- confirms via POST /api/newsletter/unsubscribe.
-- No token column: links are HMAC-signed from the subscriber id and
-- NEWSLETTER_UNSUBSCRIBE_SECRET, so this migration does not backfill secrets.

alter table public.abonati
  add column if not exists unsubscribed_at timestamptz;

comment on column public.abonati.unsubscribed_at is
  'Set when the subscriber confirms unsubscribe. Null means they still receive the newsletter.';
