import Link from 'next/link';
import { getFearGreed } from '@/lib/market-api';
import { fetchScreenerData, formatHeatmapChange, formatScreenerPrice } from '@/lib/screener-data';

const SYMBOLS = ['BTC', 'ETH', 'SOL'] as const;

export default async function HomeMarketBar() {
  const [screener, fearGreed] = await Promise.all([fetchScreenerData(15), getFearGreed()]);
  const live = screener.source === 'coingecko';
  const coins = live
    ? SYMBOLS.flatMap((symbol) => {
        const coin = screener.coins.find((row) => row.symbol === symbol);
        return coin && coin.price > 0 ? [coin] : [];
      })
    : [];

  if (coins.length === 0 && !fearGreed) return null;

  return (
    <section aria-label="Piața azi" className="mb-8">
      <Link
        href="/market"
        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-white/20 sm:flex-row sm:items-center sm:justify-between"
      >
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Piața azi</span>
        <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {coins.map((coin) => (
            <span key={coin.symbol} className="inline-flex items-baseline gap-2 text-sm">
              <span className="font-bold text-white">{coin.symbol}</span>
              <span className="text-slate-200">{formatScreenerPrice(coin.price)}</span>
              <span className={coin.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                {formatHeatmapChange(coin.change24h)}
              </span>
            </span>
          ))}
          {fearGreed ? (
            <span className="inline-flex items-baseline gap-2 text-sm">
              <span className="text-slate-400">Frică și lăcomie</span>
              <span className="font-bold text-white">
                {fearGreed.value} · {fearGreed.label}
              </span>
            </span>
          ) : null}
        </span>
      </Link>
    </section>
  );
}
