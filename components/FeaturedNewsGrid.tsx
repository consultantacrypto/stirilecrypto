import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { articles } from '@/lib/articles';

const SIDE_TIME_LABELS = ['Acum 15 min', 'Acum 2 ore', 'Acum 5 ore', 'Acum 8 ore'] as const;

function getSideTimestamp(index: number): string {
  return SIDE_TIME_LABELS[index] ?? 'Recent';
}

function Pill({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold backdrop-blur-md ${className}`}
    >
      {children}
    </span>
  );
}

export default function FeaturedNewsGrid() {
  const featured = articles.slice(0, 4);
  const [hero, ...sideArticles] = featured;

  if (!hero) return null;

  return (
    <section aria-label="Știri principale" className="bg-black border-b border-white/5">
      <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16 max-w-7xl">        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <article className="lg:col-span-2 flex flex-col gap-6">
            <Link
              href={`/stiri/${hero.slug}`}
              className="group flex flex-col gap-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-3xl"
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-3xl bg-[#1c1c1e]">
                <Image
                  src={hero.image}
                  alt={hero.title}
                  fill
                  priority
                  fetchPriority="high"
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
              </div>

              <div className="flex flex-col gap-4 px-1">                <div className="flex flex-wrap items-center gap-2">
                  <Pill className="bg-red-500/20 text-red-400">Breaking</Pill>
                  <Pill className="bg-blue-500/20 text-blue-400">{hero.category}</Pill>
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
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Citește analiza
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </article>

          <div className="flex flex-col gap-8 lg:col-span-1">
            {sideArticles.map((item, index) => (
              <article key={item.slug} className="border border-white/5 rounded-3xl bg-[#1c1c1e] p-4">
                <Link
                  href={`/stiri/${item.slug}`}
                  className="group flex flex-col gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-2xl"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-black">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 120px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="flex flex-col gap-2 px-1">
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <Pill className="bg-orange-500/20 text-orange-400">Hot</Pill>
                      )}
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <Clock size={10} />
                        {getSideTimestamp(index)}
                      </span>
                    </div>
                    <h2 className="text-base font-bold tracking-tight text-white line-clamp-3 group-hover:text-blue-400 transition-colors duration-300">
                      {item.title}
                    </h2>
                    <Pill className="bg-white/5 text-slate-400 w-fit">{item.category}</Pill>
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
