export type ScreenerCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
};

export type ScreenerSource = 'coingecko' | 'stale' | 'unavailable';

export type ScreenerFetchResult = {
  coins: ScreenerCoin[];
  source: ScreenerSource;
  fetchedAt: string | null;
};

function coingeckoMarketsUrl(perPage: number) {
  return `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false`;
}

type CoinGeckoMarketRow = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  total_volume: number | null;
  price_change_percentage_24h: number | null;
};

function mapRow(row: CoinGeckoMarketRow): ScreenerCoin {
  return {
    id: row.id,
    symbol: row.symbol.toUpperCase(),
    name: row.name,
    image: row.image,
    price: row.current_price ?? 0,
    change24h: row.price_change_percentage_24h ?? 0,
    volume24h: row.total_volume ?? 0,
    marketCap: row.market_cap ?? 0,
  };
}

type LastGoodPayload = {
  coins: ScreenerCoin[];
  fetchedAt: string;
};

function lastGoodStore(): Map<number, LastGoodPayload> {
  const globalState = globalThis as typeof globalThis & {
    __stirilecryptoScreenerLastGood?: Map<number, LastGoodPayload>;
  };
  if (!globalState.__stirilecryptoScreenerLastGood) {
    globalState.__stirilecryptoScreenerLastGood = new Map();
  }
  return globalState.__stirilecryptoScreenerLastGood;
}

function rememberLastGood(perPage: number, payload: LastGoodPayload) {
  lastGoodStore().set(perPage, payload);
}

function readLastGood(perPage: number): LastGoodPayload | null {
  return lastGoodStore().get(perPage) ?? null;
}

export async function fetchScreenerData(perPage = 50): Promise<ScreenerFetchResult> {
  try {
    const res = await fetch(coingeckoMarketsUrl(perPage), {
      next: { revalidate: 60 },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`CoinGecko responded with ${res.status}`);
    }

    const data = (await res.json()) as CoinGeckoMarketRow[];

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('CoinGecko returned an empty list');
    }

    const coins = data.map(mapRow);
    const fetchedAt = new Date().toISOString();
    rememberLastGood(perPage, { coins, fetchedAt });
    return { coins, source: 'coingecko', fetchedAt };
  } catch (error) {
    console.error('[fetchScreenerData]', error);
    const stale = readLastGood(perPage);
    if (stale && stale.coins.length > 0) {
      return { coins: stale.coins, source: 'stale', fetchedAt: stale.fetchedAt };
    }
    return { coins: [], source: 'unavailable', fetchedAt: null };
  }
}

/** @deprecated Use fetchScreenerData — kept for existing imports */
export const getScreenerCoins = () => fetchScreenerData(50);

export function getHeatmapColor(change24h: number): string {
  if (change24h > 5) return 'bg-emerald-500/80';
  if (change24h > 0) return 'bg-emerald-800/80';
  if (change24h > -5) return 'bg-red-800/80';
  return 'bg-red-500/80';
}

export function formatHeatmapChange(change24h: number): string {
  const sign = change24h >= 0 ? '+' : '';
  return `${sign}${change24h.toFixed(2)}%`;
}

export function formatScreenerPrice(value: number): string {
  if (value >= 1000) {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  }
  if (value >= 1) {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  });
}

export function formatScreenerCompactUsd(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function formatScreenerFetchedAt(iso: string | null): string | null {
  if (!iso) return null;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleString('ro-RO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
