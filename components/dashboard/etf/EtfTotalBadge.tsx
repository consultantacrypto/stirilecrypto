'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { formatFlowMillions } from '@/lib/etf/format';
import type { EtfPeriod } from '@/lib/etf/types';
import { useEtfData } from './useEtfData';

interface EtfTotalBadgeProps {
  period: EtfPeriod;
}

export function EtfTotalBadge({ period }: EtfTotalBadgeProps) {
  const btc = useEtfData('BTC', period);
  const eth = useEtfData('ETH', period);

  if (btc.loading || eth.loading) {
    return <div className="glass-card h-20 animate-pulse rounded-xl border border-white/10" />;
  }

  const sumSeries = (rows: { net_flow_usd: number }[]) =>
    rows.reduce((acc, row) => acc + row.net_flow_usd, 0);

  const total = sumSeries(btc.data) + sumSeries(eth.data);
  const isPositive = total >= 0;
  const lastUpdated = [btc.lastUpdated, eth.lastUpdated]
    .filter((v): v is string => Boolean(v))
    .sort()
    .at(-1);

  return (
    <div
      className={`glass-card flex items-center justify-between rounded-xl border p-4 ${
        isPositive ? 'border-emerald-500/30' : 'border-red-500/30'
      }`}
    >
      <div>
        <p className="text-sm text-slate-400">Total Net Flow ({period})</p>
        <p
          className={`text-2xl font-bold tabular-nums font-[var(--font-space)] ${
            isPositive ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {formatFlowMillions(total)}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Ultima zi în DB: {lastUpdated ?? '—'}
          {btc.isStale || eth.isStale ? ' · date posibil neactualizate' : ''}
        </p>
      </div>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
        }`}
      >
        {isPositive ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
      </div>
    </div>
  );
}
