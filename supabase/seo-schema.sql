-- Run in Supabase SQL Editor: SEO metadata columns

alter table public.stiri
  add column if not exists meta_title text;

alter table public.stiri
  add column if not exists meta_description text;
