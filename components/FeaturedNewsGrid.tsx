import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { articles } from '@/lib/articles';

const SIDE_TIME_LABELS = ['Acum 15 min', 'Acum 2 ore', 'Acum 5 ore', 'Acum 8 ore'] as const;

function getSideTimestamp(index: number): string {
  return SIDE_TIME_LABELS[index] ?? 'Recent';
}

export default function FeaturedNewsGrid() {
  const featured = articles.slice(0, 4);
  const [hero, ...sideArticles] = featured;

  if (!hero) return null;

  return (
    <section
      aria-label="Știri principale"
      className="bg-[#020617] border-b border-white/5"
    >
      <div className="container mx-auto px-4 sm:px-6 py-8 lg:py-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
          <article className="lg:col-span-2 lg:row-span-3 flex flex-col min-h-0 border border-white/5 rounded-2xl overflow-hidden bg-[#0a0f1e] hover:border-slate-700 transition-colors duration-200">
            <Link
              href={`/stiri/${hero.slug}`}
              className="group flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] lg:min-h-[420px] overflow-hidden bg-slate-900">
                <Image
                  src={hero.image}
                  alt={hero.title}
                  fill
                  priority
                  fetchPriority="high"
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent z-10" />
                <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-white bg-red-600 rounded border border-red-400/60 shadow-[0_0_24px_rgba(239,68,68,0.55)] animate-pulse">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                    </span>
                    Breaking
                  </span>
                  <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-blue-300 bg-blue-500/20 border border-blue-500/30 rounded">
                    {hero.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-5 sm:p-6 lg:p-8 border-t border-white/5">
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Clock size={12} className="text-blue-400" />
                  {hero.date} · {hero.readTime ?? '5 min'}
                </p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.75rem] font-black leading-[1.08] tracking-tight text-white font-[var(--font-space)] group-hover:text-blue-400 transition-colors duration-200 line-clamp-4">
                  {hero.title}
                </h1>
                <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed line-clamp-3 max-w-3xl">
                  {hero.summary}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                  Citește analiza completă
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                </span>
              </div>
            </Link>
          </article>

          <div className="flex flex-col gap-4 lg:col-span-1">
            {sideArticles.map((item, index) => (
              <article
                key={item.slug}
                className="flex-1 border border-white/5 rounded-xl overflow-hidden bg-[#0a0f1e] hover:border-slate-700 transition-colors duration-200"
              >
                <Link
                  href={`/stiri/${item.slug}`}
                  className="group flex gap-3 sm:gap-4 p-3 sm:p-4 h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <div className="relative w-[100px] h-[100px] shrink-0 rounded-lg overflow-hidden bg-slate-900 border border-white/5">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100px, 120px"
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                    {index === 0 && (
                      <span className="absolute top-1 left-1 z-10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-white bg-orange-600 rounded shadow-[0_0_12px_rgba(234,88,12,0.5)]">
                        Hot
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col justify-center min-w-0 flex-1 py-0.5">
                    <p className="text-[10px] font-mono text-blue-400/90 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Clock size={10} />
                      {getSideTimestamp(index)}
                    </p>
                    <h2 className="text-sm sm:text-[15px] font-bold leading-snug text-white font-[var(--font-space)] line-clamp-3 group-hover:text-blue-400 transition-colors duration-200">
                      {item.title}
                    </h2>
                    <p className="mt-1.5 text-[11px] text-gray-500 uppercase tracking-wide truncate">
                      {item.category}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
