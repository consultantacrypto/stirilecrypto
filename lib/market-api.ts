import type { MarketIndicator, MarketIndicatorStatus } from '@/lib/crypto-azi/types';

const STALE_MS = 15 * 60 * 1000;

export type FearGreedResult =
  | {
      status: 'ok';
      value: number;
      value_classification: string;
      asOf: string | null;
    }
  | {
      status: 'unavailable';
      value: null;
      value_classification: null;
      asOf: null;
    };

export type GlobalMarketData = {
  marketCap: number;
  volume: number;
  btcDominance: number;
  marketCapChange: number;
  asOf: string;
} | null;

export type BtcPriceData = {
  price: number;
  change24h: number;
  asOf: string;
} | null;

function freshness(asOf: string | null | undefined, now = Date.now()): MarketIndicatorStatus {
  if (!asOf) return 'unavailable';
  const t = new Date(asOf).getTime();
  if (Number.isNaN(t)) return 'unavailable';
  return now - t > STALE_MS ? 'stale' : 'live';
}

export async function getGlobalData(): Promise<GlobalMarketData> {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/global', {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      data?: {
        total_market_cap?: { usd?: number };
        total_volume?: { usd?: number };
        market_cap_percentage?: { btc?: number };
        market_cap_change_percentage_24h_usd?: number;
        updated_at?: number;
      };
    };
    const g = data.data;
    if (!g?.total_market_cap?.usd || g.market_cap_percentage?.btc == null) {
      return null;
    }
    const asOf =
      typeof g.updated_at === 'number'
        ? new Date(g.updated_at * 1000).toISOString()
        : new Date().toISOString();
    return {
      marketCap: g.total_market_cap.usd,
      volume: g.total_volume?.usd ?? 0,
      btcDominance: g.market_cap_percentage.btc,
      marketCapChange: g.market_cap_change_percentage_24h_usd ?? 0,
      asOf,
    };
  } catch (error) {
    console.error('[getGlobalData]', error);
    return null;
  }
}

/** Never invents Neutral/50 — returns explicit unavailable on failure. */
export async function getFearGreed(): Promise<FearGreedResult> {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=1', {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      return { status: 'unavailable', value: null, value_classification: null, asOf: null };
    }
    const json = (await res.json()) as {
      data?: Array<{
        value?: string;
        value_classification?: string;
        timestamp?: string;
      }>;
    };
    const row = json.data?.[0];
    const value = row?.value != null ? Number(row.value) : NaN;
    if (!Number.isFinite(value) || !row?.value_classification) {
      return { status: 'unavailable', value: null, value_classification: null, asOf: null };
    }
    const asOf =
      row.timestamp && Number.isFinite(Number(row.timestamp))
        ? new Date(Number(row.timestamp) * 1000).toISOString()
        : new Date().toISOString();
    return {
      status: 'ok',
      value,
      value_classification: row.value_classification,
      asOf,
    };
  } catch (error) {
    console.error('[getFearGreed]', error);
    return { status: 'unavailable', value: null, value_classification: null, asOf: null };
  }
}

export async function getBtcPrice(): Promise<BtcPriceData> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&sparkline=false',
      { next: { revalidate: 120 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      current_price?: number;
      price_change_percentage_24h?: number;
      last_updated?: string;
    }>;
    const btc = data?.[0];
    if (btc?.current_price == null || !Number.isFinite(btc.current_price)) return null;
    return {
      price: btc.current_price,
      change24h: btc.price_change_percentage_24h ?? 0,
      asOf: btc.last_updated ?? new Date().toISOString(),
    };
  } catch (error) {
    console.error('[getBtcPrice]', error);
    return null;
  }
}

function formatUsdCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  return `${sign}$${abs.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export async function getCryptoAziIndicators(): Promise<MarketIndicator[]> {
  const [btc, global, fg] = await Promise.all([getBtcPrice(), getGlobalData(), getFearGreed()]);

  const btcStatus = btc ? freshness(btc.asOf) : 'unavailable';
  const globalStatus = global ? freshness(global.asOf) : 'unavailable';
  const fgStatus: MarketIndicatorStatus =
    fg.status === 'ok' ? freshness(fg.asOf) : 'unavailable';

  return [
    {
      id: 'btc_price',
      label: 'BTC',
      status: btcStatus,
      displayValue:
        btc != null
          ? `$${btc.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
          : null,
      detail: btc != null ? `${btc.change24h >= 0 ? '+' : ''}${btc.change24h.toFixed(2)}% / 24h` : null,
      asOf: btc?.asOf ?? null,
    },
    {
      id: 'market_cap',
      label: 'Market Cap',
      status: globalStatus,
      displayValue: global ? formatUsdCompact(global.marketCap) : null,
      detail: global
        ? `${global.marketCapChange >= 0 ? '+' : ''}${global.marketCapChange.toFixed(2)}% / 24h`
        : null,
      asOf: global?.asOf ?? null,
    },
    {
      id: 'btc_dominance',
      label: 'BTC.D',
      status: globalStatus,
      displayValue: global ? `${global.btcDominance.toFixed(1)}%` : null,
      detail: global ? 'Dominanță capitalizare' : null,
      asOf: global?.asOf ?? null,
    },
    {
      id: 'fear_greed',
      label: 'Fear & Greed',
      status: fgStatus,
      displayValue: fg.status === 'ok' ? String(fg.value) : null,
      detail: fg.status === 'ok' ? fg.value_classification : null,
      asOf: fg.status === 'ok' ? fg.asOf : null,
    },
  ];
}
