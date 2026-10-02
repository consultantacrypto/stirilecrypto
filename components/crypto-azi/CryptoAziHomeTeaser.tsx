import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CryptoDailyBrief } from '@/lib/crypto-azi/types';
import { formatBucharestDate } from '@/lib/crypto-azi/format';

type Props = {
  brief: CryptoDailyBrief | null;
  isToday: boolean;
  isFallback: boolean;
};

export default function CryptoAziHomeTeaser({ brief, isToday, isFallback }: Props) {
  if (!brief) {
    return (
      <section
        aria-label="Crypto Azi"
        className="mt-10 mb-2 rounded-2xl border border-white/10 bg-zinc-950/80 px-5 py-6 sm:px-8"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-sky-400 mb-2">
          Crypto Azi
        </p>
        <h2 className="text-xl font-bold text-white font-[var(--font-space)]">
          Briefingul editorial nu este disponibil momentan
        </h2>
        <p className="mt-2 text-sm text-slate-400 font-[var(--font-inter)]">
          Revenim cu cele trei lucruri importante ale zilei. Fără date demonstrative.
        </p>
        <Link
          href="/crypto-azi"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200"
        >
          Deschide Crypto Azi <ArrowRight size={16} />
        </Link>
      </section>
    );
  }

  return (
    <section
      aria-label="Crypto Azi"
      className="mt-10 mb-2 rounded-2xl border border-sky-500/25 bg-gradient-to-br from-sky-500/[0.07] via-zinc-950 to-zinc-950 px-5 py-6 sm:px-8"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-sky-300">
          Crypto Azi
        </span>
        <time
          dateTime={brief.brief_date}
          className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
        >
          {formatBucharestDate(brief.brief_date)}
        </time>
        {!isToday && isFallback ? (
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
            Briefing anterior
          </span>
        ) : null}
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-white font-[var(--font-space)] tracking-tight">
        {brief.title}
      </h2>
      <ul className="mt-4 space-y-2">
        {brief.takeaways.map((item) => (
          <li
            key={item.title}
            className="text-sm text-slate-300 font-[var(--font-inter)] leading-relaxed pl-3 border-l border-sky-500/40"
          >
            {item.title}
          </li>
        ))}
      </ul>
      <Link
        href="/crypto-azi"
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-5 py-2.5 text-sm font-bold text-white transition-colors"
      >
        Vezi briefingul complet <ArrowRight size={16} />
      </Link>
    </section>
  );
}
