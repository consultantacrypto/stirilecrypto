import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CryptoDailyBrief } from '@/lib/crypto-azi/types';
import { formatBucharestDate } from '@/lib/crypto-azi/format';

type Props = {
  /** Must be today's published brief — caller never passes empty/fallback. */
  brief: CryptoDailyBrief;
};

/**
 * Compact homepage module. Server Component only.
 * No empty state: parent omits this when there is no today brief.
 */
export default function CryptoAziHomeTeaser({ brief }: Props) {
  const firstTitle = brief.takeaways[0]?.title?.trim();
  if (!firstTitle) return null;

  return (
    <section
      aria-label="Crypto Azi — briefingul zilei"
      className="mt-6 mb-2 max-h-[200px] overflow-hidden rounded-xl border border-sky-500/25 bg-zinc-950/90 sm:max-h-[160px]"
    >
      <div className="flex h-full min-h-0 flex-col justify-between gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-6 sm:px-5 sm:py-3.5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400">
              Crypto Azi
            </span>
            <time
              dateTime={brief.brief_date}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-500"
            >
              {formatBucharestDate(brief.brief_date)}
            </time>
          </div>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400 font-[var(--font-inter)]">
            3 lucruri de știut astăzi
          </p>
          <p className="mt-1 truncate text-base font-bold leading-snug text-white font-[var(--font-space)] sm:text-lg">
            {firstTitle}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 font-[var(--font-inter)]">
            + încă 2 concluzii în briefing
          </p>
        </div>

        <Link
          href="/crypto-azi"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 sm:self-center"
        >
          Vezi briefingul
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
