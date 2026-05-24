import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { articles } from '@/lib/articles';
import { normalizeImageUrl } from '@/lib/image-url';

const SIDE_TIME_LABELS = ['Acum 15 min', 'Acum 2 ore', 'Acum 5 ore', 'Acum 8 ore'] as const;

function getSideTimestamp(index: number): string {
  return SIDE_TIME_LABELS[index] ?? 'Recent';
}

function Pill({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold border border-white/10 bg-[#1c1c1e] ${className}`}
    >
      {children}
    </span>
  );
}

function ConsultingWidget() {
  return (
    <aside
      aria-label="Mentorat privat crypto"
      className="bg-[#1c1c1e] border border-white/5 rounded-3xl p-8 flex flex-col justify-between h-full relative overflow-hidden"
    >
      <div>
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 block">
          MENTORAT PRIVAT
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-4">
          Portofoliul tău nu are nevoie de noroc. Are nevoie de o strategie.
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Oprește pierderile provocate de zgomotul din social media. Navighează piața crypto
          alături de un mentor cu experiență reală, prin sesiuni private, aplicate 100% pe
          capitalul tău.
        </p>
      </div>
      <a
        href="https://mihaidaniel.ro"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full text-center bg-white text-black font-bold py-3.5 rounded-xl text-sm transition-transform hover:scale-[1.02] block mt-auto"
      >
        Rezervă O Sesiune Privată &rarr;
      </a>
    </aside>
  );
}

export default function FeaturedNewsGrid() {
  const featured = articles.slice(0, 4);

  if (featured.length === 0) return null;

  const sideArticles = featured.slice(1);

  return (
    <section aria-label="Știri principale" className="bg-black border-b border-white/5">
      <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-12">
          {featured.map((hero, index) => {
            if (index !== 0) return null;

            return (
              <article key={hero.slug} className="lg:col-span-8 flex flex-col h-full">
                <Link
                  href={`/stiri/${hero.slug}`}
                  className="group flex flex-col gap-6 h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-3xl"
                >
                  <div className="relative w-full aspect-[16/10] overflow-hidden rounded-3xl bg-[#1c1c1e]">
                    <Image
                      src={normalizeImageUrl(hero.image)}
                      alt={hero.title}
                      fill
                      priority={index === 0}
                      loading="eager"
                      fetchPriority="high"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                  </div>

                  <div className="flex flex-col gap-4 px-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill className="text-red-400 border-red-500/20">Breaking</Pill>
                      <Pill className="text-blue-400 border-blue-500/20">{hero.category}</Pill>
                    </div>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-2">
                      <Clock size={12} />
                      {hero.date} · {hero.readTime ?? '5 min'}
                    </p>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-4">
                      {hero.title}
                    </h1>
                    <p className="text-slate-300 text-base leading-relaxed line-clamp-3 max-w-3xl">
                      {hero.summary}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-blue-400 transition-colors mt-auto">
                      Citește analiza
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}

          <div className="lg:col-span-4 flex flex-col min-h-[280px] lg:min-h-0">
            <ConsultingWidget />
          </div>
        </div>

        {sideArticles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sideArticles.map((item, index) => (
              <article key={item.slug} className="border border-white/5 rounded-3xl bg-[#1c1c1e] p-4 h-full">
                <Link
                  href={`/stiri/${item.slug}`}
                  className="group flex flex-col gap-4 h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-2xl"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-black">
                    <Image
                      src={normalizeImageUrl(item.image)}
                      alt={item.title}
                      fill
                      priority={false}
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="flex flex-col gap-2 px-1 flex-1">
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <Pill className="text-orange-400 border-orange-500/20">Hot</Pill>
                      )}
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <Clock size={10} />
                        {getSideTimestamp(index)}
                      </span>
                    </div>
                    <h2 className="text-base font-bold tracking-tight text-white line-clamp-3 group-hover:text-blue-400 transition-colors duration-300">
                      {item.title}
                    </h2>
                    <Pill className="text-slate-400 w-fit">{item.category}</Pill>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
