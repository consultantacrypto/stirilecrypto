'use client';

import { Building2 } from 'lucide-react';
import { useState } from 'react';
import type { EtfPeriod } from '@/lib/etf/types';
import { EtfAssetCard } from './EtfAssetCard';
import { EtfBarChart } from './EtfBarChart';
import { EtfPeriodSelector } from './EtfPeriodSelector';
import { EtfTotalBadge } from './EtfTotalBadge';

export default function EtfSection() {
  const [period, setPeriod] = useState<EtfPeriod>('5d');

  return (
    <section aria-label="Fluxuri ETF instituționale" className="mb-12 min-w-0 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-300">
            <Building2 size={12} aria-hidden />
            Flux Instituțional
          </div>
          <h2 className="font-[var(--font-space)] text-2xl font-bold tracking-tight text-white md:text-3xl">
            ETF Inflow / Outflow
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400 font-[var(--font-inter)]">
            Flux net zilnic al ETF-urilor spot BTC și ETH. Verde = capital intrat, roșu = capital
            ieșit.
          </p>
        </div>
        <EtfPeriodSelector period={period} onChange={setPeriod} />
      </div>

      <EtfTotalBadge period={period} />

      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <EtfAssetCard asset="BTC" period={period} />
        <EtfAssetCard asset="ETH" period={period} />
      </div>

      <EtfBarChart period={period} />
    </section>
  );
}
