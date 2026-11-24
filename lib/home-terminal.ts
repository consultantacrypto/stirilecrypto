export type TerminalQuote = {
  symbol: 'BTC' | 'ETH' | 'SOL';
  price: number;
  change24h: number;
};

export type DailyCandle = {
  time: number;
  high: number;
  low: number;
  close: number;
};

export type TerminalRange = {
  days: number;
  low: number;
  high: number;
  last: number;
  /** Percent change from the previous daily close to the latest close. */
  dayChange: number;
  spark: number[];
};

export type EtfFlowPoint = {
  asset: 'BTC' | 'ETH';
  date: string;
  netFlowUsd: number;
};

export type HomeTerminalSnapshot = {
  quotes: TerminalQuote[];
  range: TerminalRange | null;
  fearGreed: { value: number; label: string } | null;
  etf: EtfFlowPoint[];
  fetchedAt: string | null;
};

const QUOTE_IDS: { id: string; symbol: TerminalQuote['symbol'] }[] = [
  { id: 'bitcoin', symbol: 'BTC' },
  { id: 'ethereum', symbol: 'ETH' },
  { id: 'solana', symbol: 'SOL' },
];

function finite(value: unknown): number | null {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

export function parseCoinGeckoQuotes(payload: unknown): TerminalQuote[] {
  if (!Array.isArray(payload)) return [];
  const quotes: TerminalQuote[] = [];
  for (const wanted of QUOTE_IDS) {
    const row = payload.find(
      (item) => item && typeof item === 'object' && (item as { id?: unknown }).id === wanted.id,
    ) as { current_price?: unknown; price_change_percentage_24h?: unknown } | undefined;
    if (!row) continue;
    const price = finite(row.current_price);
    const change = finite(row.price_change_percentage_24h);
    if (price === null || price <= 0) continue;
    quotes.push({
      symbol: wanted.symbol,
      price,
      change24h: change ?? 0,
    });
  }
  return quotes;
}

/** Binance kline rows: [openTime, open, high, low, close, ...]. Broken rows are dropped. */
export function parseBinanceKlines(payload: unknown): DailyCandle[] {
  if (!Array.isArray(payload)) return [];
  const candles: DailyCandle[] = [];
  for (const row of payload) {
    if (!Array.isArray(row) || row.length < 5) continue;
    const time = finite(row[0]);
    const high = finite(row[2]);
    const low = finite(row[3]);
    const close = finite(row[4]);
    if (time === null || high === null || low === null || close === null) continue;
    if (high <= 0 || low <= 0 || close <= 0 || high < low) continue;
    candles.push({ time, high, low, close });
  }
  return candles;
}

export function rangeFromDailyCandles(candles: DailyCandle[]): TerminalRange | null {
  if (candles.length < 2) return null;
  const low = Math.min(...candles.map((candle) => candle.low));
  const high = Math.max(...candles.map((candle) => candle.high));
  const last = candles[candles.length - 1].close;
  const previous = candles[candles.length - 2].close;
  if (!(high >= low) || previous <= 0) return null;
  return {
    days: candles.length,
    low,
    high,
    last,
    dayChange: ((last - previous) / previous) * 100,
    spark: candles.map((candle) => candle.close),
  };
}

/** 0–100 position of the last close inside the high/low span. A flat span sits in the middle. */
export function rangePosition(last: number, low: number, high: number): number {
  if (!(high > low)) return 50;
  const raw = ((last - low) / (high - low)) * 100;
  return Math.min(100, Math.max(0, raw));
}

export function latestFlowByAsset(
  rows: { asset: 'BTC' | 'ETH'; snapshot_date: string; net_flow_usd: number }[],
): EtfFlowPoint[] {
  const best = new Map<'BTC' | 'ETH', EtfFlowPoint>();
  for (const row of rows) {
    if (row.asset !== 'BTC' && row.asset !== 'ETH') continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(row.snapshot_date)) continue;
    if (!Number.isFinite(row.net_flow_usd)) continue;
    const current = best.get(row.asset);
    if (!current || row.snapshot_date > current.date) {
      best.set(row.asset, {
        asset: row.asset,
        date: row.snapshot_date,
        netFlowUsd: row.net_flow_usd,
      });
    }
  }
  return (['BTC', 'ETH'] as const).flatMap((asset) => {
    const point = best.get(asset);
    return point ? [point] : [];
  });
}

/** Calendar date, not a timezone-shifted instant. */
export function formatSnapshotDay(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  return `${Number(match[3])}.${match[2]}.${match[1]}`;
}

export function quoteFor(quotes: TerminalQuote[], symbol: TerminalQuote['symbol']): TerminalQuote | null {
  return quotes.find((quote) => quote.symbol === symbol) ?? null;
}

export function assembleTerminal(input: {
  quotes: TerminalQuote[];
  candles: DailyCandle[];
  fearGreed: { value: number; label: string } | null;
  etf: EtfFlowPoint[];
  now?: string | null;
}): HomeTerminalSnapshot {
  const range = rangeFromDailyCandles(input.candles);
  const hasData = input.quotes.length > 0 || range !== null || input.fearGreed !== null || input.etf.length > 0;
  return {
    quotes: input.quotes,
    range,
    fearGreed: input.fearGreed,
    etf: input.etf,
    fetchedAt: hasData ? (input.now ?? null) : null,
  };
}
