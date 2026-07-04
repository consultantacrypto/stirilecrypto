'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { EtfAssetSymbol, EtfFlowChartPoint } from '@/lib/types/etf-snapshots';
import { cn } from '@/lib/utils';

const ASSET_META: Record<
  EtfAssetSymbol,
  { label: string; subtitle: string }
> = {
  BTC: { label: 'Bitcoin ETF', subtitle: 'Flux net instituțional — ultimele 5 zile' },
  ETH: { label: 'Ethereum ETF', subtitle: 'Flux net instituțional — ultimele 5 zile' },
};

function formatFlowUsd(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '+';
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(0)}M`;
  return `${sign}$${abs.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function sumNetFlow(points: EtfFlowChartPoint[]): number {
  return points.reduce((acc, point) => acc + point.netFlowUsd, 0);
}

interface EtfFlowsChartProps {
  asset: EtfAssetSymbol;
  data: EtfFlowChartPoint[];
}

export default function EtfFlowsChart({ asset, data }: EtfFlowsChartProps) {
  const meta = ASSET_META[asset];
  const totalFlow = sumNetFlow(data);
  const isNetInflow = totalFlow >= 0;

  return (
    <Card className="relative min-w-0 overflow-hidden border-violet-500/20 bg-zinc-950/90 shadow-[0_0_40px_rgba(139,92,246,0.06)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/[0.06] via-transparent to-transparent"
      />
      <CardHeader className="relative border-b border-white/5 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-300">
                ETF Flows
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                {asset}
              </span>
            </div>
            <CardTitle className="font-[var(--font-space)] text-xl md:text-2xl">
              {meta.label}
            </CardTitle>
            <CardDescription className="mt-1 font-[var(--font-inter)]">
              {meta.subtitle}
            </CardDescription>
          </div>
          <div
            className={cn(
              'self-start rounded-xl border px-3 py-2 text-right',
              isNetInflow
                ? 'border-emerald-500/30 bg-emerald-500/10'
                : 'border-red-500/30 bg-red-500/10',
            )}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Net 5 zile
            </p>
            <p
              className={cn(
                'text-lg font-bold tabular-nums font-[var(--font-space)]',
                isNetInflow ? 'text-emerald-400' : 'text-red-400',
              )}
            >
              {formatFlowUsd(totalFlow)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative p-4 sm:p-6">
        {data.length === 0 ? (
          <div className="flex h-[220px] sm:h-[260px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
            <p className="text-sm text-slate-500 font-[var(--font-inter)]">
              Nu există date ETF publicate pentru {asset}.
            </p>
          </div>
        ) : (
          <div className="relative w-full min-w-0 h-[220px] sm:h-[260px] overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%" minWidth={280}>
              <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={52}
                  tickFormatter={(value: number) => {
                    const abs = Math.abs(value);
                    if (abs >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
                    if (abs >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
                    return `$${value}`;
                  }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '10px',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [formatFlowUsd(Number(value)), 'Flux net']}
                  labelFormatter={(label) => String(label)}
                />
                <Bar dataKey="netFlowUsd" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`${entry.date}-${index}`}
                      fill={entry.netFlowUsd >= 0 ? '#10b981' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-[var(--font-inter)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" aria-hidden />
            Inflow (verde)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-red-500" aria-hidden />
            Outflow (roșu)
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
