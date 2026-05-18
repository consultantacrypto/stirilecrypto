-- Run in Supabase SQL Editor: article view counter

alter table public.stiri
  add column if not exists views bigint not null default 0;

create index if not exists stiri_views_desc_idx
  on public.stiri (views desc)
  where status = 'published';

-- Atomic increment (recommended for /api/views)
create or replace function public.increment_article_views(article_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.stiri
  set views = views + 1
  where slug = article_slug
    and status = 'published';
end;
$$;

grant execute on function public.increment_article_views(text) to anon, authenticated;
