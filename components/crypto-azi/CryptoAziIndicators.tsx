import type { MarketIndicator } from '@/lib/crypto-azi/types';
import { formatBucharestDateTime } from '@/lib/crypto-azi/format';

const statusLabel: Record<MarketIndicator['status'], string> = {
  live: 'Live',
  stale: 'Întârziat',
  unavailable: 'Indisponibil',
};

const statusClass: Record<MarketIndicator['status'], string> = {
  live: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  stale: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  unavailable: 'border-white/10 bg-white/5 text-slate-400',
};

type Props = {
  indicators: MarketIndicator[];
  heading?: string;
  ariaLabel?: string;
};

export default function CryptoAziIndicators({
  indicators,
  heading = 'Indicatori de piață',
  ariaLabel,
}: Props) {
  return (
    <section aria-label={ariaLabel ?? heading} className="mt-2">
      <h2 className="text-lg font-bold text-white font-[var(--font-space)] mb-4">
        {heading}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {indicators.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {item.label}
              </p>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider rounded-full border px-2 py-0.5 ${statusClass[item.status]}`}
              >
                {statusLabel[item.status]}
              </span>
            </div>
            <p className="text-2xl font-black text-white font-[var(--font-space)] tabular-nums">
              {item.displayValue ?? '—'}
            </p>
            <p className="mt-1 text-xs text-slate-400 font-[var(--font-inter)]">
              {item.detail ?? 'Date indisponibile'}
            </p>
            {item.asOf && item.status !== 'unavailable' ? (
              <p className="mt-2 text-[10px] text-slate-600 font-[var(--font-inter)]">
                {formatBucharestDateTime(item.asOf)}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
