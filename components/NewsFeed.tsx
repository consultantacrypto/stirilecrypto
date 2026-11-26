import Link from 'next/link';
import HeroSlogan from '@/components/HeroSlogan';
import HomeNewsGrid from '@/components/HomeNewsGrid';
import { getPublishedFeedPage, HOME_FEED_FIRST_COUNT } from '@/lib/articles-db';
import { HOME_BITCOIN_ANCHOR, HOME_STIRI_ANCHOR } from '@/lib/editorial-links';
import { HOME_H2 } from '@/lib/home-seo';

export default async function NewsFeed() {
  const { items, hasMore } = await getPublishedFeedPage(0, HOME_FEED_FIRST_COUNT);

  return (
    <section id="news-feed" className="scroll-mt-20 bg-black pb-12 lg:pb-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl pt-5 text-center">
          <HeroSlogan />
          <h2 className="mt-4 font-[family-name:var(--font-space)] text-lg font-semibold tracking-tight text-zinc-200 sm:text-xl">
            {HOME_H2}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            <Link
              href="/stiri"
              className="text-sm text-zinc-300 underline decoration-white/20 underline-offset-4 hover:text-white"
            >
              {HOME_STIRI_ANCHOR}
            </Link>
            {' și '}
            <Link
              href="/hub/bitcoin"
              className="text-sm text-zinc-300 underline decoration-white/20 underline-offset-4 hover:text-white"
            >
              {HOME_BITCOIN_ANCHOR}
            </Link>
            .
          </p>
        </div>

        {items.length === 0 ? (
          <p className="mt-12 text-center text-sm text-slate-500">Nu există articole disponibile momentan.</p>
        ) : (
          <HomeNewsGrid initialItems={items} initialHasMore={hasMore} />
        )}
      </div>
    </section>
  );
}
