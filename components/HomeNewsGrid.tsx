'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import ArticleCoverImage from '@/components/ArticleCoverImage';
import MorningNewsletter from '@/components/MorningNewsletter';
import type { NewsFeedItem } from '@/lib/home-feed';
import { HOME_FEED_FIRST_COUNT, HOME_FEED_PAGE_SIZE } from '@/lib/home-feed';

function NewsCard({ item, priority }: { item: NewsFeedItem; priority: boolean }) {
  return (
    <article className="flex flex-col gap-5 rounded-3xl border border-white/5 bg-[#1c1c1e] p-4">
      <Link
        href={item.href}
        className="group flex flex-col gap-5 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      >
        <ArticleCoverImage
          src={item.image_url}
          alt={item.title}
          priority={priority}
          aspectRatio="16/10"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-2xl"
          imageClassName="transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="flex flex-col gap-3 px-1 pb-2">
          <span className="w-fit rounded-full bg-blue-500/20 px-3 py-1 text-[10px] font-semibold text-blue-400 backdrop-blur-md">
            {item.category}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{item.dateLabel}</span>
          <h3 className="line-clamp-2 text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-blue-400">
            {item.title}
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-300">{item.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}

export default function HomeNewsGrid({
  initialItems,
  initialHasMore,
}: {
  initialItems: NewsFeedItem[];
  initialHasMore: boolean;
}) {
  const [items, setItems] = useState(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [auto, setAuto] = useState(false);
  const [error, setError] = useState('');
  const sentinel = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  async function loadMore() {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `/api/stiri/feed?offset=${items.length}&limit=${HOME_FEED_PAGE_SIZE}`,
      );
      if (!response.ok) throw new Error('failed');
      const data = (await response.json()) as { items?: NewsFeedItem[]; hasMore?: boolean };
      const next = Array.isArray(data.items) ? data.items : [];
      setItems((current) => {
        const seen = new Set(current.map((item) => item.id));
        return [...current, ...next.filter((item) => !seen.has(item.id))];
      });
      setHasMore(Boolean(data.hasMore) && next.length > 0);
      setAuto(true);
    } catch {
      setError('Nu am putut încărca următoarele știri. Încearcă din nou.');
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!auto || !hasMore) return;
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore();
      },
      { rootMargin: '400px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
    // loadMore closes over the latest items length via state in the fetch URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, hasMore, items.length]);

  const first = items.slice(0, HOME_FEED_FIRST_COUNT);
  const rest = items.slice(HOME_FEED_FIRST_COUNT);

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-8 pt-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {first.map((item, index) => (
          <NewsCard key={item.id} item={item} priority={index < 2} />
        ))}
      </div>

      <MorningNewsletter id="newsletter" location="homepage" variant="band" />

      {rest.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {rest.map((item) => (
            <NewsCard key={item.id} item={item} priority={false} />
          ))}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10" aria-hidden>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-3xl border border-white/5 bg-[#1c1c1e] p-4">
              <div className="aspect-[16/10] animate-pulse rounded-2xl bg-white/5" />
              <div className="mt-4 h-3 w-24 animate-pulse rounded-full bg-white/5" />
              <div className="mt-3 h-5 w-full animate-pulse rounded bg-white/5" />
            </div>
          ))}
        </div>
      ) : null}

      <div ref={sentinel} className="mt-14 text-center">
        {hasMore ? (
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-8 py-3.5 font-semibold text-white transition-colors duration-300 hover:bg-white/15 disabled:opacity-70"
          >
            {loading ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <ArrowRight size={18} aria-hidden />}
            Încarcă mai multe știri
          </button>
        ) : items.length > 0 ? (
          <p className="text-sm text-slate-500">Astea sunt toate știrile publicate.</p>
        ) : null}
        {error ? (
          <p role="alert" className="mt-3 text-sm text-red-300">
            {error}
          </p>
        ) : null}
      </div>
    </>
  );
}
