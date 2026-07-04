import { Building2 } from 'lucide-react';
import { EtfFlowsChart } from '@/components/lazy/dashboard-widgets';
import { getEtfSnapshotsLast5Days } from '@/lib/etf-snapshots-db';

export default async function EtfFlowsSection() {
  const snapshots = await getEtfSnapshotsLast5Days(['BTC', 'ETH']);

  return (
    <section aria-label="Fluxuri ETF instituționale" className="mb-12 min-w-0">
      <div className="mb-6">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-300">
          <Building2 size={12} aria-hidden />
          Flux Instituțional
        </div>
        <h2 className="font-[var(--font-space)] text-2xl font-bold tracking-tight text-white md:text-3xl">
          ETF Inflow / Outflow
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400 font-[var(--font-inter)]">
          Flux net zilnic al ETF-urilor spot BTC și ETH — ultimii 5 zile de tranzacționare.
          Verde = capital intrat, roșu = capital ieșit.
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <EtfFlowsChart asset="BTC" data={snapshots.BTC} />
        <EtfFlowsChart asset="ETH" data={snapshots.ETH} />
      </div>
    </section>
  );
}
