'use client';

import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, BrainCircuit, ArrowRight } from 'lucide-react';
import { articles } from '@/lib/articles';

const FEATURED_ARTICLE_COUNT = 4;
const FEED_PAGE_SIZE = 6;

function impactPill(impact: string) {
  if (impact === 'bullish') return 'bg-green-500/20 text-green-400';
  if (impact === 'bearish') return 'bg-red-500/20 text-red-400';
  return 'bg-slate-500/20 text-slate-400';
}

export default function NewsFeed() {
  const latestNews = articles.slice(FEATURED_ARTICLE_COUNT, FEATURED_ARTICLE_COUNT + FEED_PAGE_SIZE);

  return (
    <section id="news-feed" className="pb-12 lg:pb-16 bg-black scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12 pt-2">
          {latestNews.map((item) => (
            <article
              key={item.slug}
              className="flex flex-col gap-5 border border-white/5 rounded-3xl bg-[#1c1c1e] p-4"
            >
              <Link
                href={`/stiri/${item.slug}`}
                className="group flex flex-col gap-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-2xl"
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-black">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                </div>

                <div className="flex flex-col gap-3 px-1 pb-2">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold backdrop-blur-md ${impactPill(item.impact)}`}
                    >
                      {item.impact === 'bullish' && <TrendingUp size={12} />}
                      {item.impact === 'bearish' && <TrendingDown size={12} />}
                      {item.impact === 'neutral' && <Minus size={12} />}
                      {item.impact.toUpperCase()}
                    </span>
                    <span className="rounded-full px-3 py-1 text-[10px] font-semibold bg-blue-500/20 text-blue-400 backdrop-blur-md">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                    {item.date}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-white line-clamp-2 group-hover:text-blue-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">{item.summary}</p>
                  {item.mihaiTake && (
                    <div className="pt-2 border-t border-white/5">
                      <div className="flex items-center gap-2 mb-2 text-blue-400 text-xs font-semibold">
                        <BrainCircuit size={14} />
                        Take Editorial
                      </div>
                      <p className="text-sm text-slate-300 italic line-clamp-2">&quot;{item.mihaiTake}&quot;</p>
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/stiri"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold border border-white/10 transition-colors duration-300"
          >
            Toate Știrile
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
