'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import ArticleCoverImage from '@/components/ArticleCoverImage';
import MorningNewsletter from '@/components/MorningNewsletter';
import type { NewsFeedItem } from '@/lib/home-feed';
import { HOME_FEED_FIRST_COUNT, HOME_FEED_PAGE_SIZE } from '@/lib/home-feed';

function NewsCard({ item, priority, eager = false }: { item: NewsFeedItem; priority: boolean; eager?: boolean }) {
  return (
    <article className="flex h-full flex-col border-b border-white/[0.08] pb-6 sm:border-b-0 sm:pb-0">
      <Link
        href={item.href}
        className="group flex h-full flex-col rounded-xl focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <ArticleCoverImage
          src={item.image_url}
          alt={item.title}
          priority={priority}
          eager={eager}
          coverWidth={720}
          aspectRatio="16/10"
          sizes="(max-width: 768px) 92vw, (max-width: 1200px) 46vw, 380px"
          className="overflow-hidden rounded-xl"
          imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="flex flex-1 flex-col pt-3.5">
          <p className="flex flex-wrap items-center gap-x-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
            <span className="text-[var(--signal)]">{item.category}</span>
            <span className="text-zinc-600" aria-hidden="true">
              ·
            </span>
            <span className="font-medium normal-case tracking-normal text-zinc-400">{item.dateLabel}</span>
          </p>
          <h3 className="mt-2 line-clamp-3 font-[var(--font-space)] text-[1.15rem] font-semibold leading-snug tracking-tight text-white transition-colors duration-300 group-hover:text-zinc-200 sm:text-xl">
            {item.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">{item.excerpt}</p>
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
      <div className="mt-8 grid grid-cols-1 gap-8 pt-2 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3">
        {first.map((item, index) => (
          <NewsCard key={item.id} item={item} priority={index < 2} />
        ))}
      </div>

      <MorningNewsletter id="newsletter" location="homepage" variant="band" />

      {rest.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3">
          {rest.map((item) => (
            <NewsCard key={item.id} item={item} priority={false} eager />
          ))}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3" aria-hidden>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border-b border-white/[0.08] pb-6 sm:border-b-0 sm:pb-0">
              <div className="aspect-[16/10] animate-pulse rounded-xl bg-white/5" />
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
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/15 bg-white px-8 py-3.5 font-semibold text-black transition-colors duration-300 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-70"
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
