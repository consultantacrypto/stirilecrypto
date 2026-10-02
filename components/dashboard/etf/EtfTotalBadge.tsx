'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { formatFlowMillions } from '@/lib/etf/format';
import type { EtfPeriod } from '@/lib/etf/types';
import { EtfErrorState } from './EtfErrorState';
import { EtfUnavailableState } from './EtfUnavailableState';
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

  const retry = () => {
    btc.refetch();
    eth.refetch();
  };

  const btcValid = !btc.error && btc.data.length > 0;
  const ethValid = !eth.error && eth.data.length > 0;

  if (!btcValid && !ethValid) {
    if (btc.error || eth.error) {
      return (
        <EtfErrorState
          error={btc.error || eth.error || 'Datele ETF nu au putut fi încărcate.'}
          onRetry={retry}
        />
      );
    }
    return <EtfUnavailableState onRetry={retry} />;
  }

  const sumSeries = (rows: { net_flow_usd: number }[]) =>
    rows.reduce((acc, row) => acc + row.net_flow_usd, 0);

  const total = (btcValid ? sumSeries(btc.data) : 0) + (ethValid ? sumSeries(eth.data) : 0);
  const isPositive = total >= 0;
  const lastUpdated = [btcValid ? btc.lastUpdated : null, ethValid ? eth.lastUpdated : null]
    .filter((v): v is string => Boolean(v))
    .sort()
    .at(-1);

  const staleNote =
    (btcValid && btc.isStale) || (ethValid && eth.isStale)
      ? ' · date posibil neactualizate'
      : '';
  const partialNote =
    btcValid && ethValid
      ? ''
      : btcValid
        ? ' · ETH indisponibil'
        : ' · BTC indisponibil';

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
        {lastUpdated ? (
          <p className="mt-1 text-xs text-slate-500">
            Ultima zi în DB: {lastUpdated}
            {staleNote}
            {partialNote}
          </p>
        ) : null}
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
