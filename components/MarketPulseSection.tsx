import Link from 'next/link';
import { ArrowRight, Activity } from 'lucide-react';
import { getLatestMarketPulse } from '@/lib/articles-db';

export default async function MarketPulseSection() {
  const pulse = await getLatestMarketPulse();

  if (!pulse) {
    return null;
  }

  return (
    <section
      aria-label="Market Pulse — analiză tehnică zilnică"
      className="mt-10 mb-2"
    >
      <Link
        href={`/market-pulse/${pulse.slug}`}
        className="group relative mx-auto flex max-w-7xl flex-col gap-5 overflow-hidden rounded-xl border border-amber-500/30 bg-zinc-950 px-5 py-6 transition-all hover:border-amber-500/50 hover:shadow-[0_0_40px_rgba(245,158,11,0.08)] sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-7"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-500/[0.04] via-transparent to-amber-600/[0.03]"
        />

        <div className="relative z-10 flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
              </span>
              Market Pulse
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500/80">
              Update zilnic
            </span>
          </div>

          <div className="flex items-start gap-2">
            <Activity
              size={18}
              className="mt-1 shrink-0 text-amber-400/80"
              aria-hidden
            />
            <div className="min-w-0">
              <h2 className="text-lg font-bold leading-snug tracking-tight text-white sm:text-xl font-[var(--font-space)] group-hover:text-amber-50 transition-colors line-clamp-2">
                {pulse.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400 line-clamp-2 font-[var(--font-inter)]">
                {pulse.excerpt}
              </p>
            </div>
          </div>
        </div>

        <span className="relative z-10 inline-flex shrink-0 items-center gap-2 self-start text-sm font-bold text-amber-400 transition-all group-hover:gap-3 sm:self-center font-[var(--font-space)]">
          Citește Analiza
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>

      <div className="mt-3 flex justify-end max-w-7xl mx-auto">
        <Link
          href="/market-pulse"
          className="text-[10px] font-bold uppercase tracking-widest text-amber-500/70 hover:text-amber-400 transition-colors font-[var(--font-space)]"
        >
          Arhivă analize →
        </Link>
      </div>
    </section>
  );
}
