import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getLatestMarketPulse } from '@/lib/articles-db';
import { formatPulseTimestamp } from '@/lib/market-pulse-freshness';
import HomeYoutube from '@/components/HomeYoutube';
import SectionHeader from '@/components/SectionHeader';

const PULSE_LABEL = 'Pulsul Bitcoin';
const PULSE_SCHEDULE = 'luni și joi, ora 19';

export default async function MarketPulseSection() {
  const pulse = await getLatestMarketPulse();
  const published = pulse ? formatPulseTimestamp(pulse.published_at) : null;

  return (
    <section aria-label="Pulsul Bitcoin, luni și joi, ora 19" className="mt-12">
      <SectionHeader eyebrow={PULSE_LABEL} title="Luni și joi, ora 19" href="/market-pulse" linkLabel="Arhivă →" />

      {pulse ? (
        <Link
          href={`/market-pulse/${pulse.slug}`}
          className="group flex flex-col gap-3 border border-white/[0.08] bg-white/[0.02] px-5 py-5 transition-colors hover:border-white/20 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {PULSE_SCHEDULE}
              {published?.display ? ` · ${published.display}` : ''}
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-space)] text-lg font-semibold leading-snug tracking-[-0.02em] text-white line-clamp-2">
              {pulse.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-400 line-clamp-2">{pulse.excerpt}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#9eb4f0]">
            Citește
            <ArrowRight size={16} aria-hidden />
          </span>
        </Link>
      ) : (
        <p className="text-sm text-slate-400">Nu e publicat încă un puls. Revino luni sau joi, ora 19.</p>
      )}

      <HomeYoutube />
    </section>
  );
}
