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
    <section aria-label="Piața azi" className="border-b border-white/10 bg-black">
      <Link
        href="/market"
        className="container mx-auto flex h-9 max-w-7xl items-center gap-5 overflow-x-auto whitespace-nowrap px-4 text-xs tabular-nums text-slate-300 sm:px-6"
      >
        <span className="font-bold uppercase tracking-wide text-blue-400">Piața azi</span>
        {coins.map((coin) => (
          <span key={coin.symbol} className="inline-flex items-baseline gap-2">
            <span className="font-bold text-white">{coin.symbol}</span>
            <span>{formatScreenerPrice(coin.price)}</span>
            <span className={coin.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              {formatHeatmapChange(coin.change24h)}
            </span>
          </span>
        ))}
        {fearGreed ? (
          <span className="inline-flex items-baseline gap-2">
            <span className="text-slate-500">Frică și lăcomie</span>
            <span className="font-bold text-white">
              {fearGreed.value} {fearGreed.label}
            </span>
          </span>
        ) : null}
      </Link>
    </section>
  );
}
