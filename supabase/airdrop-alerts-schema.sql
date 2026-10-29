-- =============================================================================
-- Airdrop Alert (/airdrop-alert)
-- Run this entire script in Supabase SQL Editor (Dashboard → SQL → New query)
--
-- Seed: Account Research Desk, Lot1 + Lot2, 29.10.2026.
-- Primary source links only. Notes are one line. No farming guides.
-- These rows are real research entries, not EXAMPLE placeholders.
-- Fhenix and Optimum are quests (airdrop unconfirmed).
-- Bullshot is higher-risk / memecoin-adjacent.
-- Reya waitlist bonus deadline is 2 Nov 2026, 12:00 Europe/Bucharest (10:00 UTC).
-- =============================================================================

create table if not exists public.airdrop_alerts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  program_type text not null
    check (program_type in ('airdrop', 'points', 'points_to_airdrop', 'quests')),
  program_status text not null
    check (program_status in ('active', 'upcoming', 'ended')),
  window_label text not null,
  source_url text not null,
  source_url_secondary text,
  note text,
  deadline_at timestamptz,
  risk_level text
    check (risk_level is null or risk_level in ('higher')),
  sort_order int not null default 0,
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint airdrop_alerts_source_https check (source_url ~ '^https://'),
  constraint airdrop_alerts_source_secondary_https check (
    source_url_secondary is null or source_url_secondary ~ '^https://'
  )
);

comment on table public.airdrop_alerts is
  'Published airdrop and points programs for /airdrop-alert. Drafts are hidden. No farming steps.';

comment on column public.airdrop_alerts.program_type is
  'airdrop | points | points_to_airdrop | quests. Fhenix and Optimum use quests because the airdrop is unconfirmed.';

comment on column public.airdrop_alerts.deadline_at is
  'Optional absolute deadline. Reya waitlist bonus: 2026-11-02 12:00 Europe/Bucharest.';

comment on column public.airdrop_alerts.risk_level is
  'higher = memecoin-adjacent or otherwise higher risk. Shown next to the one-line note.';

create index if not exists airdrop_alerts_published_idx
  on public.airdrop_alerts (status, sort_order, name);

create or replace function public.set_updated_at_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists airdrop_alerts_set_updated_at on public.airdrop_alerts;
create trigger airdrop_alerts_set_updated_at
  before update on public.airdrop_alerts
  for each row
  execute function public.set_updated_at_timestamp();

alter table public.airdrop_alerts enable row level security;

drop policy if exists "Public read published airdrop alerts" on public.airdrop_alerts;
create policy "Public read published airdrop alerts"
  on public.airdrop_alerts
  for select
  using (status = 'published');

drop policy if exists "Authenticated manage airdrop alerts" on public.airdrop_alerts;
create policy "Authenticated manage airdrop alerts"
  on public.airdrop_alerts
  for all
  to authenticated
  using (true)
  with check (true);

grant select, insert, update, delete on public.airdrop_alerts to anon, authenticated, service_role;

-- Seed is idempotent. Re-running does not overwrite editorial edits.
insert into public.airdrop_alerts (
  slug,
  name,
  program_type,
  program_status,
  window_label,
  source_url,
  source_url_secondary,
  note,
  deadline_at,
  risk_level,
  sort_order,
  status,
  published_at
)
values
  (
    'extended',
    'Extended',
    'points_to_airdrop',
    'active',
    'TGE ~nov 2026',
    'https://thedefiant.io/news/tokens/extended-plans-november-xten-launch-with-30-for-points-users',
    'https://extended.exchange',
    'Puncte live. XTEN în noiembrie 2026, 30% din supply pentru puncte. Whitepaper MiCA pe 31.10.',
    null,
    null,
    1,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    'variational',
    'Variational',
    'airdrop',
    'upcoming',
    'TGE Q4 2026',
    'https://variational.io',
    'https://www.theblock.co/news/defi/2026-05-20-arbitrum-derivatives-variational-50-million-series-a-dragonfly-402066',
    'TGE anunțat pentru Q4 2026. Circa 32% genesis.',
    null,
    null,
    2,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    'bulk',
    'BULK',
    'points_to_airdrop',
    'active',
    '10.10–05.12.2026',
    'https://bulk.trade',
    'https://defillama.com/protocol/bulk',
    'AURA Season 1 e live.',
    null,
    null,
    3,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    'qfex',
    'QFEX',
    'points',
    'active',
    'în curs',
    'https://qfex.com',
    null,
    'Puncte și Loss Refund, în curs.',
    null,
    null,
    4,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    'infinifi',
    'infiniFi',
    'airdrop',
    'upcoming',
    'TGE Q4 2026',
    'https://infinifi.xyz',
    'https://www.prnewswire.com/news-releases/infinifi-raises-3m-ahead-of-q4-tge-302887464.html',
    'Tokenomics INFI public. TGE anunțat pentru Q4 2026.',
    null,
    null,
    5,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    'jumper',
    'Jumper',
    'points',
    'active',
    'TGE Q4 2026',
    'https://jumper.exchange',
    'https://help.legion.cc/en/articles/17139928-jumper-jump-public-sale-on-legion-everything-you-need-to-know',
    'XP și Loyalty Pass. TGE JUMP anunțat pentru Q4 2026.',
    null,
    null,
    6,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    'predict-fun',
    'Predict.fun',
    'airdrop',
    'active',
    'S1 live',
    'https://predict.fun',
    null,
    'Sezonul 1: 70M (7%). Tokenomics din 28.10.',
    null,
    null,
    7,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    'saturn-credit',
    'Saturn Credit',
    'points_to_airdrop',
    'active',
    'snapshot 08.12.2026 · TGE Q4',
    'https://saturn.credit',
    'https://saturncredit.gitbook.io/saturn-docs/overview/orbital-points-season-2',
    'Orbital Points S2, până la 5% STRN.',
    null,
    null,
    8,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    'fhenix',
    'Fhenix',
    'quests',
    'active',
    'în curs',
    'https://fhenix.io',
    null,
    'Mainnet din 21.10. Airdrop neconfirmat: doar puncte și quest-uri.',
    null,
    null,
    9,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    'arcus',
    'Arcus',
    'points',
    'active',
    'în curs, din 01.10.2026',
    'https://arcus.xyz',
    'https://unchainedcrypto.com/robinhood-wallet-can-now-route-stock-token-trades-through-the-arcus-exchange/',
    'Puncte din 01.10.2026.',
    null,
    null,
    10,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    'reya-network',
    'Reya Network',
    'points_to_airdrop',
    'active',
    'până pe 2 nov, 12:00 RO',
    'https://reya.xyz',
    'https://airdrops.io/reya-network/',
    'Season 2 live (3% din supply). Airdrop REYA confirmat. Bonusul de waitlist expiră pe 2 nov 2026, la 12:00, ora României.',
    '2026-11-02 10:00:00+00',
    null,
    11,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    'ink-nado',
    'Ink + Nado',
    'points_to_airdrop',
    'active',
    'TGE fără dată',
    'https://inkonchain.com',
    'https://airdrops.io/ink-chain/',
    'Airdrop INK confirmat (Kraken Drops). Puncte pe Kraken Pro și Nado. TGE fără dată.',
    null,
    null,
    12,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    'hibachi',
    'Hibachi',
    'points',
    'active',
    'în curs',
    'https://hibachi.xyz',
    'https://cryptorank.io/drophunting/hibachi-activity744',
    'Puncte live.',
    null,
    null,
    13,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    'nullmask',
    'Nullmask',
    'points_to_airdrop',
    'active',
    'S1 ~90 zile din 19.10',
    'https://nullmask.io',
    'https://airdrops.io/nullmask/',
    'Season One din 19.10, circa 90 de zile. MASK confirmat.',
    null,
    null,
    14,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    'bullshot',
    'Bullshot',
    'points',
    'active',
    'în curs',
    'https://airdrops.io/bullshot/',
    null,
    'Risc mai mare, zonă de memecoin. GEMS live. Airdrop $BULL posibil, neconfirmat.',
    null,
    'higher',
    15,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    '3jane',
    '3Jane',
    'points',
    'active',
    'în curs',
    'https://3jane.xyz',
    'https://airdrops.io/3jane/',
    'Liquidity mining JANE și Layer3.',
    null,
    null,
    16,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    'optimum',
    'Optimum',
    'quests',
    'active',
    'în curs, din ~23.10',
    'https://getoptimum.xyz',
    'https://airdrops.io/optimum/',
    'Mainnet și TurboCards, din ~23.10. Airdrop neconfirmat: doar quest-uri și NFT.',
    null,
    null,
    17,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    'melee',
    'Melee',
    'airdrop',
    'active',
    'pre-TGE',
    'https://melee.markets',
    'https://cryptorank.io/drophunting/melee-activity946',
    'Activități listate pe CryptoRank. Beta și testnet, înainte de TGE.',
    null,
    null,
    18,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    'pacifica',
    'Pacifica',
    'points',
    'active',
    'în curs',
    'https://pacifica.fi',
    'https://airdropalert.com/blogs/pacifica-review/',
    '10M puncte pe săptămână. Season 1.',
    null,
    null,
    19,
    'published',
    '2026-10-29 12:00:00+00'
  ),
  (
    'ethereal',
    'Ethereal',
    'points',
    'active',
    'TGE 2026',
    'https://ethereal.trade',
    null,
    'Puncte USDe și Ethena. 15% pentru comunitatea Ethena. TGE în 2026.',
    null,
    null,
    20,
    'published',
    '2026-10-29 12:00:00+00'
  )
on conflict (slug) do nothing;
