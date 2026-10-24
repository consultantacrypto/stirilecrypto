const TICKERS = [
  'BTC', 'ETH', 'SOL', 'XRP', 'BNB', 'ADA', 'DOGE', 'AVAX', 'DOT', 'LINK',
  'LTC', 'BCH', 'ATOM', 'NEAR', 'APT', 'SUI', 'TON', 'TRX', 'SHIB', 'PEPE',
  'ARB', 'OP', 'INJ', 'TIA', 'SEI', 'FIL', 'HBAR', 'XLM', 'UNI', 'AAVE',
  'MKR', 'TAO', 'WIF', 'BONK', 'FET', 'ONDO', 'ENA', 'WLD', 'JUP', 'WBTC',
  'STETH',
] as const;

const NAMES: ReadonlyArray<readonly [string, string]> = [
  ['bitcoin', 'BTC'],
  ['ethereum', 'ETH'],
  ['solana', 'SOL'],
  ['cardano', 'ADA'],
  ['dogecoin', 'DOGE'],
  ['litecoin', 'LTC'],
  ['polkadot', 'DOT'],
  ['avalanche', 'AVAX'],
  ['chainlink', 'LINK'],
  ['ripple', 'XRP'],
];

const ASSET_PARAM = /^[A-Za-z0-9]{2,12}$/;
const SOURCE_PARAM = /^[a-z0-9_-]{1,32}$/;

export function sanitizeAssetParam(value: string | null | undefined): string {
  const asset = (value ?? '').trim().toUpperCase();
  return ASSET_PARAM.test(asset) ? asset : '';
}

export function sanitizeSource(value: string | null | undefined): string | null {
  const source = (value ?? '').trim().toLowerCase();
  return SOURCE_PARAM.test(source) ? source : null;
}

/** First coin mentioned in a headline or article, if it is a known ticker or name. */
export function mentionedAsset(...parts: Array<string | null | undefined>): string | null {
  const plain = parts
    .filter((part): part is string => Boolean(part))
    .join('\n')
    .replace(/<[^>]+>/g, ' ');

  let bestIndex = Number.POSITIVE_INFINITY;
  let bestAsset: string | null = null;

  const consider = (index: number, asset: string) => {
    if (index >= 0 && index < bestIndex) {
      bestIndex = index;
      bestAsset = asset;
    }
  };

  for (const ticker of TICKERS) {
    const marked = new RegExp(`\\$${ticker}\\b`, 'i').exec(plain);
    if (marked) {
      consider(marked.index, ticker);
      continue;
    }
    const exact = new RegExp(`\\b${ticker}\\b`).exec(plain);
    if (exact) consider(exact.index, ticker);
  }

  for (const [name, asset] of NAMES) {
    const match = new RegExp(`\\b${name}\\b`, 'i').exec(plain);
    if (match) consider(match.index, asset);
  }

  return bestAsset;
}

export function addressCheckUrl(): string | null {
  const raw = process.env.ADDRESS_CHECK_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** True when the address checker is open. Either flag is enough; neither is set in this repo. */
export function walletCheckIsLive(): boolean {
  const flag = process.env.WALLET_CHECK_LIVE?.trim().toLowerCase();
  if (flag === '1' || flag === 'true' || flag === 'yes') return true;
  return addressCheckUrl() !== null;
}

export function withSource(href: string, source: string): string {
  const safe = sanitizeSource(source) ?? 'direct';
  const absolute = /^https?:\/\//i.test(href);
  const url = absolute ? new URL(href) : new URL(href, 'https://www.stirilecrypto.ro');
  url.searchParams.set('src', safe);
  if (absolute) return url.toString();
  return `${url.pathname}${url.search}`;
}
