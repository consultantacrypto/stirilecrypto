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

/** Fallback when CoinGecko rate-limits or fails — keeps the screener usable. */
export const MOCK_SCREENER_COINS: ScreenerCoin[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    price: 95000,
    change24h: 1.2,
    volume24h: 42_000_000_000,
    marketCap: 1_870_000_000_000,
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    price: 3400,
    change24h: -0.8,
    volume24h: 18_000_000_000,
    marketCap: 410_000_000_000,
  },
  {
    id: 'tether',
    symbol: 'USDT',
    name: 'Tether',
    image: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    price: 1,
    change24h: 0.01,
    volume24h: 80_000_000_000,
    marketCap: 140_000_000_000,
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    price: 145,
    change24h: 3.4,
    volume24h: 4_500_000_000,
    marketCap: 68_000_000_000,
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    name: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
    price: 2.1,
    change24h: -1.5,
    volume24h: 3_200_000_000,
    marketCap: 120_000_000_000,
  },
];

export async function fetchScreenerData(perPage = 50): Promise<{
  coins: ScreenerCoin[];
  source: 'coingecko' | 'mock';
}> {
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

    return { coins: data.map(mapRow), source: 'coingecko' };
  } catch (error) {
    console.error('[fetchScreenerData]', error);
    return { coins: MOCK_SCREENER_COINS.slice(0, perPage), source: 'mock' };
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
