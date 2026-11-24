import { fetchEtfSnapshots } from '@/lib/etf/fetchEtfData';
import { fetchFearGreed } from '@/lib/fear-greed';
import {
  assembleTerminal,
  latestFlowByAsset,
  parseBinanceKlines,
  parseCoinGeckoQuotes,
  type HomeTerminalSnapshot,
} from '@/lib/home-terminal';

const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&sparkline=false&price_change_percentage=24h';

const BINANCE_KLINES_URL = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=14';

const FETCH_TIMEOUT_MS = 8000;

async function fetchQuotes() {
  try {
    const response = await fetch(COINGECKO_URL, {
      next: { revalidate: 120 },
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!response.ok) return [];
    return parseCoinGeckoQuotes(await response.json());
  } catch (error) {
    console.error('[home-terminal] coingecko', error instanceof Error ? error.message : 'unknown');
    return [];
  }
}

async function fetchCandles() {
  try {
    const response = await fetch(BINANCE_KLINES_URL, {
      next: { revalidate: 300 },
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!response.ok) return [];
    return parseBinanceKlines(await response.json());
  } catch (error) {
    console.error('[home-terminal] binance', error instanceof Error ? error.message : 'unknown');
    return [];
  }
}

async function fetchEtfFlows() {
  try {
    const [btc, eth] = await Promise.all([
      fetchEtfSnapshots('BTC', '5d'),
      fetchEtfSnapshots('ETH', '5d'),
    ]);
    return latestFlowByAsset([
      ...btc.map((row) => ({
        asset: 'BTC' as const,
        snapshot_date: row.snapshot_date,
        net_flow_usd: row.net_flow_usd,
      })),
      ...eth.map((row) => ({
        asset: 'ETH' as const,
        snapshot_date: row.snapshot_date,
        net_flow_usd: row.net_flow_usd,
      })),
    ]);
  } catch (error) {
    console.error('[home-terminal] etf', error instanceof Error ? error.message : 'unknown');
    return [];
  }
}

function withTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), FETCH_TIMEOUT_MS);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(fallback);
      },
    );
  });
}

/** Public market data already used on the site. A failed source is omitted, not invented. */
export async function loadHomeTerminal(): Promise<HomeTerminalSnapshot> {
  const [quotes, candles, fearGreed, etf] = await Promise.all([
    fetchQuotes(),
    fetchCandles(),
    withTimeout(fetchFearGreed(), null),
    fetchEtfFlows(),
  ]);

  return assembleTerminal({
    quotes,
    candles,
    fearGreed,
    etf,
    now: new Date().toISOString(),
  });
}
