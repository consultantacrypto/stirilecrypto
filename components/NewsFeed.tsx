import HomeNewsGrid from '@/components/HomeNewsGrid';
import { getPublishedFeedPage, HOME_FEED_FIRST_COUNT } from '@/lib/articles-db';

export default async function NewsFeed() {
  const { items, hasMore } = await getPublishedFeedPage(0, HOME_FEED_FIRST_COUNT);

  return (
    <section id="news-feed" className="scroll-mt-20 bg-black pb-12 lg:pb-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl pt-5 text-center">
          <h1 className="font-[family-name:var(--font-space)] text-xl font-bold tracking-tight text-white sm:text-2xl">
            Zgomotul e gratuit.
            <span className="text-gray-400"> Semnalul costă.</span>
          </h1>
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
