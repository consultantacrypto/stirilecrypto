import Link from 'next/link';
import type { CryptoDailyBrief } from '@/lib/crypto-azi/types';
import {
  formatBucharestDate,
  formatBucharestDateTime,
} from '@/lib/crypto-azi/format';

type Props = {
  brief: CryptoDailyBrief;
  isToday: boolean;
  isFallback: boolean;
};

export default function CryptoAziBriefView({ brief, isToday, isFallback }: Props) {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300">
            Crypto Azi
          </span>
          {!isToday && isFallback ? (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Nu este briefingul zilei curente
            </span>
          ) : (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Briefingul zilei
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white font-[var(--font-space)]">
          {brief.title}
        </h1>
        <p className="text-sm text-slate-400 font-[var(--font-inter)]">
          <time dateTime={brief.brief_date}>{formatBucharestDate(brief.brief_date)}</time>
          {' · '}
          Actualizat {formatBucharestDateTime(brief.updated_at || brief.published_at)}
          {brief.author_name ? ` · ${brief.author_name}` : ''}
        </p>
        {brief.introduction ? (
          <p className="text-base md:text-lg text-slate-300 leading-relaxed font-[var(--font-inter)] max-w-3xl">
            {brief.introduction}
          </p>
        ) : null}
      </header>

      <section aria-label="Trei lucruri importante" className="space-y-4">
        <h2 className="text-lg font-bold text-white font-[var(--font-space)]">
          Trei lucruri importante
        </h2>
        <ol className="space-y-4">
          {brief.takeaways.map((item, index) => (
            <li
              key={`${index}-${item.title}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400 mb-2">
                #{index + 1}
              </p>
              <h3 className="text-lg font-bold text-white font-[var(--font-space)]">
                {item.title}
              </h3>
              <div className="mt-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                  De ce contează
                </p>
                <p className="text-sm text-slate-300 leading-relaxed font-[var(--font-inter)]">
                  {item.why_it_matters}
                </p>
              </div>
              <p className="mt-3 text-xs text-slate-500 font-[var(--font-inter)]">
                Sursă:{' '}
                <Link
                  href={item.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-300 hover:text-sky-200 underline-offset-2 hover:underline"
                >
                  {item.source_label}
                </Link>
              </p>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
