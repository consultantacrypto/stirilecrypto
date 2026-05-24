-- Run ONLY if you already created the old YouTube-based `interviews` table.

alter table public.interviews drop column if exists youtube_id;

alter table public.interviews add column if not exists slug text;
alter table public.interviews add column if not exists excerpt text not null default '';
alter table public.interviews add column if not exists content text not null default '';
alter table public.interviews add column if not exists cover_image text;

-- Backfill slug for existing rows before NOT NULL (adjust titles as needed)
update public.interviews
set slug = lower(regexp_replace(trim(title), '[^a-zA-Z0-9]+', '-', 'g'))
where slug is null or slug = '';

update public.interviews set slug = 'interviu-' || left(id::text, 8) where slug is null or slug = '';

alter table public.interviews alter column slug set not null;

create unique index if not exists interviews_slug_unique_idx on public.interviews (slug);

create index if not exists interviews_slug_idx on public.interviews (slug);
