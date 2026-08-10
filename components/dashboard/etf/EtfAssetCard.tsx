'use client';

import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import { formatAumBillions, formatFlowMillions } from '@/lib/etf/format';
import type { EtfAssetSymbol, EtfPeriod } from '@/lib/etf/types';
import { EtfErrorState } from './EtfErrorState';
import { EtfLoadingSkeleton } from './EtfLoadingSkeleton';
import { EtfSparkline } from './EtfSparkline';
import { useEtfData } from './useEtfData';

interface EtfAssetCardProps {
  asset: EtfAssetSymbol;
  period: EtfPeriod;
}

export function EtfAssetCard({ asset, period }: EtfAssetCardProps) {
  const { data, loading, error, refetch, lastUpdated, isStale } = useEtfData(asset, period);

  if (loading) return <EtfLoadingSkeleton />;
  if (error) return <EtfErrorState error={error} onRetry={refetch} />;
  if (data.length === 0) {
    return <EtfErrorState error={`Nu există date ETF pentru ${asset}.`} onRetry={refetch} />;
  }

  const latest = data[data.length - 1];
  const previous = data.length > 1 ? data[data.length - 2] : null;
  const changeUsd = previous ? latest.net_flow_usd - previous.net_flow_usd : 0;
  const isPositive = latest.net_flow_usd >= 0;
  const sparkColor = isPositive ? '#34d399' : '#f87171';

  return (
    <article
      className={`glass-card relative overflow-hidden rounded-xl border p-5 transition duration-300 ${
        isPositive ? 'border-emerald-500/20' : 'border-red-500/20'
      }`}
    >
      {isStale ? (
        <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
          <AlertTriangle size={12} aria-hidden />
          Neactualizat
        </div>
      ) : null}

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold ${
              asset === 'BTC'
                ? 'bg-orange-500/20 text-orange-300'
                : 'bg-blue-500/20 text-blue-300'
            }`}
          >
            {asset}
          </div>
          <div>
            <h3 className="font-semibold text-white font-[var(--font-space)]">{asset} ETF</h3>
            <p className="text-xs text-slate-500">Spot aggregate</p>
          </div>
        </div>
        <div className={isPositive ? 'text-emerald-400' : 'text-red-400'}>
          {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
        </div>
      </div>

      <p
        className={`text-3xl font-bold tabular-nums font-[var(--font-space)] ${
          isPositive ? 'text-emerald-400' : 'text-red-400'
        }`}
      >
        {formatFlowMillions(latest.net_flow_usd)}
      </p>
      <p className="mt-1 text-sm text-slate-400 font-[var(--font-inter)]">
        {previous
          ? `${formatFlowMillions(changeUsd)} vs. ziua anterioară`
          : 'Prima zi din perioadă'}
      </p>

      <div className="my-4 h-16">
        <EtfSparkline data={data} color={sparkColor} />
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-500">
        <span>AUM: {formatAumBillions(latest.aum_usd)}</span>
        <span>Actualizat: {lastUpdated ?? 'N/A'}</span>
      </div>
    </article>
  );
}
