import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleCoverImage from '@/components/ArticleCoverImage';
import { getMarketPulseArchive } from '@/lib/articles-db';
import { SITE_URL } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Market Pulse | Arhivă Analize Tehnice Zilnice',
  description:
    'Arhiva completă Market Pulse: analize tehnice zilnice ale pieței crypto, publicate cronologic de Știrile Crypto.',
  alternates: {
    canonical: `${SITE_URL}/market-pulse`,
  },
};

export const revalidate = 60;

export default async function MarketPulseArchivePage() {
  const archive = await getMarketPulseArchive();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-500/30 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 max-w-4xl w-full flex flex-col">
        <header className="pt-32 pb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            </span>
            Market Pulse
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight font-[var(--font-space)]">
            Arhivă Analize Tehnice
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-slate-400 leading-relaxed font-[var(--font-inter)]">
            Cronologia completă a analizelor zilnice. Fiecare ediție Market Pulse decodează
            volatilitatea și structura pieței — fără zgomot.
          </p>
        </header>

        {archive.length === 0 ? (
          <p className="pb-16 text-center text-slate-500 text-sm font-[var(--font-inter)]">
            Nu există analize Market Pulse publicate momentan. Revino în curând.
          </p>
        ) : (
          <ul className="flex flex-col gap-4 list-none p-0 m-0 pb-16">
            {archive.map((item, index) => (
              <li key={item.id}>
                <Link
                  href={`/market-pulse/${item.slug}`}
                  className="group flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-xl border border-white/5 bg-zinc-950/80 p-4 sm:p-5 transition-all hover:border-amber-500/30 hover:bg-zinc-950"
                >
                  <div className="relative w-full sm:w-36 md:w-44 shrink-0">
                    <ArticleCoverImage
                      src={item.image_url}
                      alt=""
                      aspectRatio="16/10"
                      sizes="(max-width: 640px) 100vw, 176px"
                      className="rounded-lg border border-white/5"
                      imageClassName="transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    {index === 0 ? (
                      <span className="absolute top-2 left-2 rounded-md bg-amber-500/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black">
                        Ultima
                      </span>
                    ) : null}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-500/80 font-[var(--font-space)]">
                      <Activity size={12} className="text-amber-400" aria-hidden />
                      <time dateTime={item.published_at ?? undefined}>{item.dateLabel}</time>
                    </div>
                    <h2 className="text-lg md:text-xl font-bold leading-snug text-white group-hover:text-amber-50 transition-colors font-[var(--font-space)] line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed font-[var(--font-inter)]">
                      {item.excerpt}
                    </p>
                    <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:gap-2 transition-all font-[var(--font-space)]">
                      Citește analiza
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  );
}
