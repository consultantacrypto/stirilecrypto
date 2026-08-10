'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { EtfPeriod } from '@/lib/etf/types';
import { EtfErrorState } from './EtfErrorState';
import { EtfLoadingSkeleton } from './EtfLoadingSkeleton';
import { useEtfData } from './useEtfData';

interface EtfBarChartProps {
  period: EtfPeriod;
}

interface CombinedPoint {
  date: string;
  label: string;
  BTC: number;
  ETH: number;
}

function formatLabel(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso.slice(5);
  return d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
}

export function EtfBarChart({ period }: EtfBarChartProps) {
  const btc = useEtfData('BTC', period);
  const eth = useEtfData('ETH', period);

  const combined: CombinedPoint[] = useMemo(() => {
    const dates = [
      ...new Set([
        ...btc.data.map((d) => d.snapshot_date),
        ...eth.data.map((d) => d.snapshot_date),
      ]),
    ].sort();

    return dates.map((date) => ({
      date,
      label: formatLabel(date),
      BTC: btc.data.find((d) => d.snapshot_date === date)?.net_flow_m ?? 0,
      ETH: eth.data.find((d) => d.snapshot_date === date)?.net_flow_m ?? 0,
    }));
  }, [btc.data, eth.data]);

  if (btc.loading || eth.loading) return <EtfLoadingSkeleton height={320} />;

  if (btc.error && eth.error) {
    return (
      <EtfErrorState
        error={btc.error}
        onRetry={() => {
          btc.refetch();
          eth.refetch();
        }}
      />
    );
  }

  if (combined.length === 0) {
    return (
      <EtfErrorState
        error="Nu există date pentru graficul comparativ."
        onRetry={() => {
          btc.refetch();
          eth.refetch();
        }}
      />
    );
  }

  return (
    <div className="glass-card rounded-xl border border-violet-500/20 p-5">
      <h3 className="mb-4 text-lg font-semibold text-white font-[var(--font-space)]">
        Flux comparativ ({period})
      </h3>
      <div className="h-72 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={280}>
          <BarChart data={combined} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" vertical={false} />
            <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(v: number) => `${v}M`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#334155',
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(value) => {
                const n = Number(value);
                const sign = n > 0 ? '+' : '';
                return [`${sign}${n.toFixed(1)}M`, ''];
              }}
            />
            <Bar dataKey="BTC" fill="#f97316" radius={[4, 4, 0, 0]} name="BTC" maxBarSize={36} />
            <Bar dataKey="ETH" fill="#3b82f6" radius={[4, 4, 0, 0]} name="ETH" maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-orange-500" aria-hidden />
          BTC
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" aria-hidden />
          ETH
        </span>
      </div>
    </div>
  );
}
