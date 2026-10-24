import Link from 'next/link';
import ArticleCoverImage from '@/components/ArticleCoverImage';
import { getHomeFeedArticles } from '@/lib/articles-db';

const FEED_PAGE_SIZE = 9;

export default async function NewsFeed() {
  const latestNews = await getHomeFeedArticles(FEED_PAGE_SIZE);

  return (
    <section id="news-feed" className="scroll-mt-20 bg-[#07080b] pb-8 pt-5">
      <div className="site-wrap">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9eb4f0]">Știri</p>
            <h1 className="mt-1 font-[family-name:var(--font-space)] text-sm font-medium tracking-[-0.01em] text-slate-300">
              Zgomotul e gratuit. Semnalul costă.
            </h1>
          </div>
          <Link href="/stiri" className="shrink-0 text-sm font-medium text-slate-300 hover:text-white">
            Vezi tot →
          </Link>
        </div>

        {latestNews.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500">Nu există articole disponibile momentan.</p>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((item, index) => {
              const lead = index === 0;
              return (
                <article
                  key={item.id}
                  className={`group flex flex-col overflow-hidden border border-white/[0.08] bg-white/[0.02] transition-transform duration-300 hover:-translate-y-0.5 ${
                    lead ? 'md:col-span-2' : ''
                  }`}
                >
                  <Link
                    href={`/stiri/${item.slug}`}
                    className="flex h-full flex-col focus:outline-none"
                  >
                    <ArticleCoverImage
                      src={item.image_url}
                      alt={item.title}
                      priority={index < 2}
                      aspectRatio="16/10"
                      sizes={lead ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
                      imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                      overlay={
                        <div
                          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[#07080b]/75 via-[#07080b]/10 to-transparent"
                          aria-hidden
                        />
                      }
                    />

                    <div className="flex flex-1 flex-col gap-2 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9eb4f0]">
                          {item.category}
                        </span>
                        <span className="text-[11px] uppercase tracking-wide text-slate-500">{item.dateLabel}</span>
                      </div>
                      <h3
                        className={`font-[family-name:var(--font-space)] font-semibold tracking-[-0.02em] text-white transition-colors duration-300 group-hover:text-[#c5d4ff] ${
                          lead ? 'line-clamp-3 text-2xl leading-[1.15] md:text-[1.7rem]' : 'line-clamp-2 text-lg leading-snug'
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-400 line-clamp-3">{item.excerpt}</p>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-6">
          <Link href="/stiri" className="text-sm font-medium text-slate-300 hover:text-white">
            Toate știrile →
          </Link>
        </div>
      </div>
    </section>
  );
}
