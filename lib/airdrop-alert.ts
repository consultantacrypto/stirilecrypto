/**
 * Airdrop Alert CMS rows.
 * Seed: Account Research Desk, Lot1 + Lot2, 29.10.2026.
 * Primary source links only. Notes are one line — no farming steps.
 */

export const AIRDROP_PROGRAM_TYPES = ['airdrop', 'points', 'points_to_airdrop', 'quests'] as const;
export const AIRDROP_PROGRAM_STATUSES = ['active', 'upcoming', 'ended'] as const;
export const AIRDROP_PUBLISH_STATUSES = ['draft', 'published'] as const;

export type AirdropProgramType = (typeof AIRDROP_PROGRAM_TYPES)[number];
export type AirdropProgramStatus = (typeof AIRDROP_PROGRAM_STATUSES)[number];
export type AirdropPublishStatus = (typeof AIRDROP_PUBLISH_STATUSES)[number];
export type AirdropRiskLevel = 'higher';

export type AirdropAlert = {
  id: string;
  slug: string;
  name: string;
  programType: AirdropProgramType;
  programStatus: AirdropProgramStatus;
  windowLabel: string;
  sourceUrl: string;
  sourceUrlSecondary: string | null;
  note: string | null;
  /** Absolute instant. Reya waitlist bonus: 2 Nov 2026, 12:00 Europe/Bucharest. */
  deadlineAt: string | null;
  riskLevel: AirdropRiskLevel | null;
  sortOrder: number;
  publishStatus: AirdropPublishStatus;
  updatedAt: string | null;
};

export const PROGRAM_TYPE_LABEL: Record<AirdropProgramType, string> = {
  airdrop: 'Airdrop',
  points: 'Puncte',
  points_to_airdrop: 'Puncte → airdrop',
  quests: 'Puncte / quest-uri',
};

export const PROGRAM_STATUS_LABEL: Record<AirdropProgramStatus, string> = {
  active: 'Activ',
  upcoming: 'Urmează',
  ended: 'Încheiat',
};

const SEED_UPDATED_AT = '2026-10-29T12:00:00.000Z';

type SeedInput = Omit<AirdropAlert, 'id' | 'publishStatus' | 'updatedAt' | 'riskLevel' | 'deadlineAt'> & {
  riskLevel?: AirdropRiskLevel | null;
  deadlineAt?: string | null;
};

function seedRow(input: SeedInput): AirdropAlert {
  return {
    ...input,
    id: `seed-${input.slug}`,
    publishStatus: 'published',
    updatedAt: SEED_UPDATED_AT,
    riskLevel: input.riskLevel ?? null,
    deadlineAt: input.deadlineAt ?? null,
  };
}

/** Published seed used when the Supabase table is not installed yet. Same facts as the SQL seed. */
export const AIRDROP_ALERT_SEED: AirdropAlert[] = [
  seedRow({
    slug: 'extended',
    name: 'Extended',
    programType: 'points_to_airdrop',
    programStatus: 'active',
    windowLabel: 'TGE ~nov 2026',
    sourceUrl: 'https://thedefiant.io/news/tokens/extended-plans-november-xten-launch-with-30-for-points-users',
    sourceUrlSecondary: 'https://extended.exchange',
    note: 'Puncte live. XTEN în noiembrie 2026, 30% din supply pentru puncte. Whitepaper MiCA pe 31.10.',
    sortOrder: 1,
  }),
  seedRow({
    slug: 'variational',
    name: 'Variational',
    programType: 'airdrop',
    programStatus: 'upcoming',
    windowLabel: 'TGE Q4 2026',
    sourceUrl: 'https://variational.io',
    sourceUrlSecondary:
      'https://www.theblock.co/news/defi/2026-05-20-arbitrum-derivatives-variational-50-million-series-a-dragonfly-402066',
    note: 'TGE anunțat pentru Q4 2026. Circa 32% genesis.',
    sortOrder: 2,
  }),
  seedRow({
    slug: 'bulk',
    name: 'BULK',
    programType: 'points_to_airdrop',
    programStatus: 'active',
    windowLabel: '10.10–05.12.2026',
    sourceUrl: 'https://bulk.trade',
    sourceUrlSecondary: 'https://defillama.com/protocol/bulk',
    note: 'AURA Season 1 e live.',
    sortOrder: 3,
  }),
  seedRow({
    slug: 'qfex',
    name: 'QFEX',
    programType: 'points',
    programStatus: 'active',
    windowLabel: 'în curs',
    sourceUrl: 'https://qfex.com',
    sourceUrlSecondary: null,
    note: 'Puncte și Loss Refund, în curs.',
    sortOrder: 4,
  }),
  seedRow({
    slug: 'infinifi',
    name: 'infiniFi',
    programType: 'airdrop',
    programStatus: 'upcoming',
    windowLabel: 'TGE Q4 2026',
    sourceUrl: 'https://infinifi.xyz',
    sourceUrlSecondary: 'https://www.prnewswire.com/news-releases/infinifi-raises-3m-ahead-of-q4-tge-302887464.html',
    note: 'Tokenomics INFI public. TGE anunțat pentru Q4 2026.',
    sortOrder: 5,
  }),
  seedRow({
    slug: 'jumper',
    name: 'Jumper',
    programType: 'points',
    programStatus: 'active',
    windowLabel: 'TGE Q4 2026',
    sourceUrl: 'https://jumper.exchange',
    sourceUrlSecondary:
      'https://help.legion.cc/en/articles/17139928-jumper-jump-public-sale-on-legion-everything-you-need-to-know',
    note: 'XP și Loyalty Pass. TGE JUMP anunțat pentru Q4 2026.',
    sortOrder: 6,
  }),
  seedRow({
    slug: 'predict-fun',
    name: 'Predict.fun',
    programType: 'airdrop',
    programStatus: 'active',
    windowLabel: 'S1 live',
    sourceUrl: 'https://predict.fun',
    sourceUrlSecondary: null,
    note: 'Sezonul 1: 70M (7%). Tokenomics din 28.10.',
    sortOrder: 7,
  }),
  seedRow({
    slug: 'saturn-credit',
    name: 'Saturn Credit',
    programType: 'points_to_airdrop',
    programStatus: 'active',
    windowLabel: 'snapshot 08.12.2026 · TGE Q4',
    sourceUrl: 'https://saturn.credit',
    sourceUrlSecondary: 'https://saturncredit.gitbook.io/saturn-docs/overview/orbital-points-season-2',
    note: 'Orbital Points S2, până la 5% STRN.',
    sortOrder: 8,
  }),
  seedRow({
    slug: 'fhenix',
    name: 'Fhenix',
    programType: 'quests',
    programStatus: 'active',
    windowLabel: 'în curs',
    sourceUrl: 'https://fhenix.io',
    sourceUrlSecondary: null,
    note: 'Mainnet din 21.10. Airdrop neconfirmat: doar puncte și quest-uri.',
    sortOrder: 9,
  }),
  seedRow({
    slug: 'arcus',
    name: 'Arcus',
    programType: 'points',
    programStatus: 'active',
    windowLabel: 'în curs, din 01.10.2026',
    sourceUrl: 'https://arcus.xyz',
    sourceUrlSecondary:
      'https://unchainedcrypto.com/robinhood-wallet-can-now-route-stock-token-trades-through-the-arcus-exchange/',
    note: 'Puncte din 01.10.2026.',
    sortOrder: 10,
  }),
  seedRow({
    slug: 'reya-network',
    name: 'Reya Network',
    programType: 'points_to_airdrop',
    programStatus: 'active',
    windowLabel: 'până pe 2 nov, 12:00 RO',
    sourceUrl: 'https://reya.xyz',
    sourceUrlSecondary: 'https://airdrops.io/reya-network/',
    note: 'Season 2 live (3% din supply). Airdrop REYA confirmat. Bonusul de waitlist expiră pe 2 nov 2026, la 12:00, ora României.',
    deadlineAt: '2026-11-02T10:00:00.000Z',
    sortOrder: 11,
  }),
  seedRow({
    slug: 'ink-nado',
    name: 'Ink + Nado',
    programType: 'points_to_airdrop',
    programStatus: 'active',
    windowLabel: 'TGE fără dată',
    sourceUrl: 'https://inkonchain.com',
    sourceUrlSecondary: 'https://airdrops.io/ink-chain/',
    note: 'Airdrop INK confirmat (Kraken Drops). Puncte pe Kraken Pro și Nado. TGE fără dată.',
    sortOrder: 12,
  }),
  seedRow({
    slug: 'hibachi',
    name: 'Hibachi',
    programType: 'points',
    programStatus: 'active',
    windowLabel: 'în curs',
    sourceUrl: 'https://hibachi.xyz',
    sourceUrlSecondary: 'https://cryptorank.io/drophunting/hibachi-activity744',
    note: 'Puncte live.',
    sortOrder: 13,
  }),
  seedRow({
    slug: 'nullmask',
    name: 'Nullmask',
    programType: 'points_to_airdrop',
    programStatus: 'active',
    windowLabel: 'S1 ~90 zile din 19.10',
    sourceUrl: 'https://nullmask.io',
    sourceUrlSecondary: 'https://airdrops.io/nullmask/',
    note: 'Season One din 19.10, circa 90 de zile. MASK confirmat.',
    sortOrder: 14,
  }),
  seedRow({
    slug: 'bullshot',
    name: 'Bullshot',
    programType: 'points',
    programStatus: 'active',
    windowLabel: 'în curs',
    sourceUrl: 'https://airdrops.io/bullshot/',
    sourceUrlSecondary: null,
    note: 'Risc mai mare, zonă de memecoin. GEMS live. Airdrop $BULL posibil, neconfirmat.',
    riskLevel: 'higher',
    sortOrder: 15,
  }),
  seedRow({
    slug: '3jane',
    name: '3Jane',
    programType: 'points',
    programStatus: 'active',
    windowLabel: 'în curs',
    sourceUrl: 'https://3jane.xyz',
    sourceUrlSecondary: 'https://airdrops.io/3jane/',
    note: 'Liquidity mining JANE și Layer3.',
    sortOrder: 16,
  }),
  seedRow({
    slug: 'optimum',
    name: 'Optimum',
    programType: 'quests',
    programStatus: 'active',
    windowLabel: 'în curs, din ~23.10',
    sourceUrl: 'https://getoptimum.xyz',
    sourceUrlSecondary: 'https://airdrops.io/optimum/',
    note: 'Mainnet și TurboCards, din ~23.10. Airdrop neconfirmat: doar quest-uri și NFT.',
    sortOrder: 17,
  }),
  seedRow({
    slug: 'melee',
    name: 'Melee',
    programType: 'airdrop',
    programStatus: 'active',
    windowLabel: 'pre-TGE',
    sourceUrl: 'https://melee.markets',
    sourceUrlSecondary: 'https://cryptorank.io/drophunting/melee-activity946',
    note: 'Activități listate pe CryptoRank. Beta și testnet, înainte de TGE.',
    sortOrder: 18,
  }),
  seedRow({
    slug: 'pacifica',
    name: 'Pacifica',
    programType: 'points',
    programStatus: 'active',
    windowLabel: 'în curs',
    sourceUrl: 'https://pacifica.fi',
    sourceUrlSecondary: 'https://airdropalert.com/blogs/pacifica-review/',
    note: '10M puncte pe săptămână. Season 1.',
    sortOrder: 19,
  }),
  seedRow({
    slug: 'ethereal',
    name: 'Ethereal',
    programType: 'points',
    programStatus: 'active',
    windowLabel: 'TGE 2026',
    sourceUrl: 'https://ethereal.trade',
    sourceUrlSecondary: null,
    note: 'Puncte USDe și Ethena. 15% pentru comunitatea Ethena. TGE în 2026.',
    sortOrder: 20,
  }),
];

const HTTPS_URL = /^https:\/\/\S+$/;

function asEnum<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

function asHttps(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return HTTPS_URL.test(trimmed) ? trimmed : null;
}

function asOptionalHttps(value: unknown): string | null {
  if (value == null || value === '') return null;
  return asHttps(value);
}

export function rowToAirdropAlert(row: Record<string, unknown>): AirdropAlert | null {
  const programType = asEnum(row.program_type, AIRDROP_PROGRAM_TYPES);
  const programStatus = asEnum(row.program_status, AIRDROP_PROGRAM_STATUSES);
  const publishStatus = asEnum(row.status, AIRDROP_PUBLISH_STATUSES);
  const sourceUrl = asHttps(row.source_url);
  const slug = typeof row.slug === 'string' ? row.slug.trim() : '';
  const name = typeof row.name === 'string' ? row.name.trim() : '';
  const windowLabel = typeof row.window_label === 'string' ? row.window_label.trim() : '';
  if (!programType || !programStatus || !publishStatus || !sourceUrl || !slug || !name || !windowLabel) {
    return null;
  }
  const id = typeof row.id === 'string' && row.id ? row.id : slug;
  const note = typeof row.note === 'string' && row.note.trim() ? row.note.trim() : null;
  const deadlineRaw = typeof row.deadline_at === 'string' ? row.deadline_at : null;
  const deadlineAt = deadlineRaw && Number.isFinite(new Date(deadlineRaw).getTime()) ? new Date(deadlineRaw).toISOString() : null;
  return {
    id,
    slug,
    name,
    programType,
    programStatus,
    windowLabel,
    sourceUrl,
    sourceUrlSecondary: asOptionalHttps(row.source_url_secondary),
    note,
    deadlineAt,
    riskLevel: row.risk_level === 'higher' ? 'higher' : null,
    sortOrder: Number.isFinite(Number(row.sort_order)) ? Number(row.sort_order) : 0,
    publishStatus,
    updatedAt: typeof row.updated_at === 'string' ? row.updated_at : null,
  };
}

export function publishedAirdropAlerts(items: AirdropAlert[]): AirdropAlert[] {
  return items
    .filter((item) => item.publishStatus === 'published')
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'ro'));
}

export type DeadlinePhase = 'open' | 'passed';

export function deadlinePhase(deadlineAt: string, now = new Date()): DeadlinePhase | null {
  const time = new Date(deadlineAt).getTime();
  if (!Number.isFinite(time)) return null;
  // The instant itself is closed: a 12:00 deadline is no longer open at 12:00.
  return time > now.getTime() ? 'open' : 'passed';
}

export function formatDeadlineRo(iso: string): string {
  const formatted = new Intl.DateTimeFormat('ro-RO', {
    timeZone: 'Europe/Bucharest',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(iso));
  return `${formatted} (ora României)`;
}

export function sourceHost(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return 'Sursă';
  }
}

export function bucharestHourMinute(iso: string): { hour: string; minute: string } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Bucharest',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(iso));
  const hour = parts.find((part) => part.type === 'hour')?.value ?? '';
  const minute = parts.find((part) => part.type === 'minute')?.value ?? '';
  return { hour, minute };
}
