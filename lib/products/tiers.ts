/**
 * Major-coin tier: CoinMarketCap historical snapshot, 23 October 2026, ranks 1–30.
 * https://coinmarketcap.com/historical/20261023/
 * Ranks 21–30 were names only in that export; tickers are the ones those names use.
 * GRAM replaced TON on 23 June 2026, so TON is accepted as the same asset.
 */
export const MAJOR_ASSETS = [
  'BTC',
  'ETH',
  'USDT',
  'BNB',
  'XRP',
  'USDC',
  'SOL',
  'TRX',
  'ZEC',
  'HYPE',
  'DOGE',
  'XMR',
  'LINK',
  'LEO',
  'ADA',
  'NEAR',
  'XLM',
  'BCH',
  'USDE',
  'DAI',
  'LTC',
  'UNI',
  'CC',
  'AVAX',
  'SUI',
  'USD1',
  'GRAM',
  'TON',
  'HBAR',
  'USDG',
  'PYUSD',
] as const;

export type AnalysisTier = 'major' | 'altcoin';

export const MAJOR_PRICE_RON = 79;
export const ALTCOIN_PRICE_RON = 139;
export const MAJOR_PRICE_BANI = 7900;
export const ALTCOIN_PRICE_BANI = 13900;

const MAJOR = new Set<string>(MAJOR_ASSETS);

export function isMajorAsset(asset: string | null | undefined): boolean {
  if (!asset) return false;
  return MAJOR.has(asset.trim().toUpperCase());
}

export function defaultTier(asset: string | null | undefined): AnalysisTier {
  return isMajorAsset(asset) ? 'major' : 'altcoin';
}

export function resolveAnalysisTier(
  asset: string | null | undefined,
  requested: unknown,
): { tier: AnalysisTier; amountRon: number; amountBani: number; forcedAltcoin: boolean } {
  const asked = requested === 'major' || requested === 'altcoin' ? requested : null;
  if (!isMajorAsset(asset)) {
    return {
      tier: 'altcoin',
      amountRon: ALTCOIN_PRICE_RON,
      amountBani: ALTCOIN_PRICE_BANI,
      forcedAltcoin: asked === 'major',
    };
  }
  if (asked === 'altcoin') {
    return {
      tier: 'altcoin',
      amountRon: ALTCOIN_PRICE_RON,
      amountBani: ALTCOIN_PRICE_BANI,
      forcedAltcoin: false,
    };
  }
  return {
    tier: 'major',
    amountRon: MAJOR_PRICE_RON,
    amountBani: MAJOR_PRICE_BANI,
    forcedAltcoin: false,
  };
}

export function analysisCheckoutCopy(tier: AnalysisTier): { name: string; description: string } {
  const price = tier === 'major' ? 'monedă mare, 79 RON' : 'altcoin, 139 RON';
  return {
    name: `Analiză tehnică multi-timeframe, ${price}`,
    description:
      'Șapte grafice (1h, 4h, 12h, 1D, 3D, 1W, 1M) și secțiunea Risc token. Fără livrare express.',
  };
}
