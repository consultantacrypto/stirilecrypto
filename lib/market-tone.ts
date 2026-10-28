export type MarketTone = 'bullish' | 'bearish';

type ScreenerToneInput = {
  source: string;
  coins: { id: string; symbol: string; change24h: number }[];
};

/** Near-black text. White fails WCAG AA on these fills; #020617 passes on each. */
export const NAV_ACCENT = {
  wallet: { background: '#0D9488', foreground: '#020617' },
  pulse: { background: '#F7931A', foreground: '#020617' },
  bullish: { background: '#22C55E', foreground: '#020617' },
  bearish: { background: '#EF4444', foreground: '#020617' },
} as const;

export const MARKET_TONE_DISCLAIMER =
  'Culoarea urmează variația Bitcoin la 24h. Nu este sfat de tranzacționare.';

/** A flat day is not a decline. Matches the green/red split on Piața azi. */
export function marketToneFromChange(change24h: number): MarketTone {
  return change24h >= 0 ? 'bullish' : 'bearish';
}

export function marketToneLabel(tone: MarketTone): 'creștere' | 'scădere' {
  return tone === 'bullish' ? 'creștere' : 'scădere';
}

/** BTC 24h change from the same screener payload Piața azi already renders. */
export function btcChangeFromScreener(result: ScreenerToneInput): number | null {
  if (result.source !== 'coingecko' && result.source !== 'stale') return null;
  const btc = result.coins.find((coin) => coin.id === 'bitcoin' || coin.symbol.toUpperCase() === 'BTC');
  if (!btc || !Number.isFinite(btc.change24h)) return null;
  return btc.change24h;
}
