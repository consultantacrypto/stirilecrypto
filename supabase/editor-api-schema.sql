-- Provenance for POST /api/editor/articles.
-- Safe to re-run. Existing rows stay NULL (they were written from /admin).
-- Apply in the Supabase SQL Editor. See docs/editor-api.md.
--
-- Without this migration the API can still insert a news row, but it cannot
-- mark the row or update it later. PATCH requires `source = 'editor_api'`.

alter table public.stiri
  add column if not exists source text;

alter table public.stiri
  add column if not exists tags text[];

alter table public.stiri
  add column if not exists source_urls text[];

alter table public.stiri
  drop constraint if exists stiri_source_check;

alter table public.stiri
  add constraint stiri_source_check
  check (source is null or source in ('editor_api'));

comment on column public.stiri.source is
  'NULL = created in /admin. editor_api = created by POST /api/editor/articles.';

comment on column public.stiri.tags is
  'Optional labels from the editor API. Not rendered on public pages.';

comment on column public.stiri.source_urls is
  'Optional source links from the editor API. Not rendered unless the article body includes them.';

create index if not exists stiri_source_created_at_idx
  on public.stiri (source, created_at desc)
  where source is not null;
