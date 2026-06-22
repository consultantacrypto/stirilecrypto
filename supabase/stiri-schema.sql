-- Run in Supabase SQL Editor if the table does not exist yet.

create table if not exists public.stiri (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  category text not null,
  content_type text not null default 'news'
    check (content_type in ('news', 'market_pulse')),
  status text not null check (status in ('draft', 'published')),
  image_url text,
  published_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists stiri_status_published_at_idx
  on public.stiri (status, published_at desc);

-- Storage bucket: imagini-stiri (public)
-- Enable RLS policies for anon insert/select as needed for your admin workflow.
