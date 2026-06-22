-- Market Pulse: editorial content type on public.stiri
-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

-- 1. Add content_type column (existing rows default to 'news')
alter table public.stiri
  add column if not exists content_type text not null default 'news'
  check (content_type in ('news', 'market_pulse'));

comment on column public.stiri.content_type is
  'Editorial format: news (default feed) or market_pulse (daily technical analysis, separate routes/UI).';

-- 2. Backfill any NULLs (safety if column existed without NOT NULL)
update public.stiri
set content_type = 'news'
where content_type is null;

-- 3. Index for latest Market Pulse + news feed queries
create index if not exists stiri_content_type_published_idx
  on public.stiri (content_type, status, published_at desc);
