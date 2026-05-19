import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getHomeFeedArticles } from '@/lib/articles-db';

const FEED_PAGE_SIZE = 6;

export default async function NewsFeed() {
  const latestNews = await getHomeFeedArticles(FEED_PAGE_SIZE);

  return (
    <section id="news-feed" className="pb-12 lg:pb-16 bg-black scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {latestNews.length === 0 ? (
          <p className="mt-12 text-center text-slate-500 text-sm">
            Nu există articole disponibile momentan.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12 pt-2">
            {latestNews.map((item, index) => (
              <article
                key={item.id}
                className="flex flex-col gap-5 border border-white/5 rounded-3xl bg-[#1c1c1e] p-4"
              >
                <Link
                  href={`/stiri/${item.slug}`}
                  className="group flex flex-col gap-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-2xl"
                >
                  {item.image_url && (
                    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-black">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        priority={index < 2}
                        fetchPriority={index < 2 ? 'high' : undefined}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-3 px-1 pb-2">
                    <span className="rounded-full px-3 py-1 text-[10px] font-semibold bg-blue-500/20 text-blue-400 backdrop-blur-md w-fit">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                      {item.dateLabel}
                    </span>
                    <h3 className="text-xl font-bold tracking-tight text-white line-clamp-2 group-hover:text-blue-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">{item.excerpt}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

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
