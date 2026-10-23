import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ArticleCoverImage from '@/components/ArticleCoverImage';
import StoryThumb from '@/components/StoryThumb';
import { DANIEL_MIHAI } from '@/lib/authors';
import { getHomeFeedArticles, getLatestMarketPulse, type NewsFeedItem } from '@/lib/articles-db';
import { resolveImageUrl, thumbnailImageUrl } from '@/lib/image-url';
import { getGlobalData } from '@/lib/market-api';

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(fallback);
      },
    );
  });
}

function editionLabel(date = new Date()): string {
  const formatted = new Intl.DateTimeFormat('ro-RO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Bucharest',
  }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function compactUsd(value: number | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  const abs = Math.abs(value);
  if (abs >= 1e12) return `$${(abs / 1e12).toFixed(2)} T`;
  if (abs >= 1e9) return `$${(abs / 1e9).toFixed(2)} B`;
  return `$${abs.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function groupByCategory(items: NewsFeedItem[]): [string, NewsFeedItem[]][] {
  const map = new Map<string, NewsFeedItem[]>();
  for (const item of items) {
    const key = item.category?.trim() || 'Știri';
    const list = map.get(key) ?? [];
    list.push(item);
    map.set(key, list);
  }
  return [...map.entries()].slice(0, 3);
}

export default async function PublicationHome() {
  const [feed, pulse, globalData] = await Promise.all([
    getHomeFeedArticles(11),
    getLatestMarketPulse(),
    withTimeout(getGlobalData(), 4000, null),
  ]);

  const [lead, ...rest] = feed;
  const latest = rest.slice(0, 5);
  const sections = groupByCategory(rest.slice(5));

  return (
    <div className="border-b border-white/10">
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {editionLabel()}
          </p>
          <p className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 sm:block">
            Știri · Piețe · Analiză
          </p>
        </div>
      </div>

      <section aria-label="Date de piață" className="border-b border-white/10">
        {globalData &&
        Number.isFinite(globalData.marketCap) &&
        Number.isFinite(globalData.volume) &&
        Number.isFinite(globalData.btcDominance) ? (
          <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-4">
            <MarketCell label="Market cap" value={compactUsd(globalData.marketCap)} />
            <MarketCell label="Volum 24h" value={compactUsd(globalData.volume)} />
            <MarketCell label="Dominanță BTC" value={`${globalData.btcDominance.toFixed(1)}%`} />
            <Link
              href="/market"
              className="flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-white hover:bg-white/[0.03] sm:px-6"
            >
              Date de piață
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
          </div>
        ) : (
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Piețe</p>
            <Link href="/market" className="inline-flex items-center gap-2 text-sm font-semibold text-white">
              Market cap, volum, dominanță BTC
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
          </div>
        )}
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        {!lead ? (
          <p className="py-16 text-center text-sm text-slate-500">Nu există articole disponibile momentan.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <article className="lg:col-span-7">
              <Link href={`/stiri/${lead.slug}`} className="group block">
                <ArticleCoverImage
                  src={lead.image_url}
                  alt={lead.title}
                  priority
                  aspectRatio="16/10"
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="rounded-2xl border border-white/10"
                />
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-400">
                  {lead.category || 'Știri'}
                  <span className="ml-3 font-medium text-slate-500">{lead.dateLabel}</span>
                </p>
                <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-white group-hover:text-blue-100 sm:text-4xl font-[var(--font-space)]">
                  {lead.title}
                </h1>
                <p className="mt-3 text-base leading-relaxed text-slate-400 line-clamp-3">{lead.excerpt}</p>
              </Link>
            </article>

            <aside aria-label="Ultimele știri" className="lg:col-span-5 lg:border-l lg:border-white/10 lg:pl-8">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Ultimele știri</h2>
              <ol className="mt-2 divide-y divide-white/10">
                {latest.map((item, index) => (
                  <li key={item.id}>
                    <StoryThumb
                      href={`/stiri/${item.slug}`}
                      title={item.title}
                      image={item.image_url}
                      index={index}
                      meta={storyMeta(item)}
                    />
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        )}

        <aside
          aria-label="Analiza săptămânii de Daniel Mihai"
          className="mt-10 flex flex-col gap-3 border-y border-white/10 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Analiză</p>
            <p className="mt-1 text-sm text-slate-200 sm:text-base">
              Analiza săptămânii de{' '}
              <Link href={DANIEL_MIHAI.path} className="font-semibold text-white hover:text-blue-300">
                {DANIEL_MIHAI.name}
              </Link>
            </p>
            {pulse ? (
              <Link
                href={`/market-pulse/${pulse.slug}`}
                className="group mt-3 flex items-center gap-3"
              >
                <span className="w-16 shrink-0">
                  <ArticleCoverImage
                    src={thumbnailImageUrl(resolveImageUrl(pulse), 160)}
                    alt=""
                    sizes="64px"
                    aspectRatio="4/3"
                    className="rounded-md border border-white/10"
                  />
                </span>
                <span className="line-clamp-2 text-sm text-slate-300 group-hover:text-white">
                  {pulse.title}
                </span>
              </Link>
            ) : (
              <p className="mt-1 text-sm text-slate-500">Analizele de piață semnate de redacție.</p>
            )}
          </div>
          <Link
            href={pulse ? `/market-pulse/${pulse.slug}` : '/market-pulse'}
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white"
          >
            Citește
            <ArrowRight size={16} />
          </Link>
        </aside>

        {sections.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {sections.map(([category, items]) => (
              <section key={category} aria-label={category}>
                <h2 className="border-b border-white/10 pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  {category}
                </h2>
                <ul className="mt-2 divide-y divide-white/10">
                  {items.slice(0, 3).map((item) => (
                    <li key={item.id}>
                      <StoryThumb
                        href={`/stiri/${item.slug}`}
                        title={item.title}
                        image={item.image_url}
                        meta={item.dateLabel}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : null}

        <div className="mt-10">
          <Link
            href="/stiri"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white"
          >
            Toate știrile
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function storyMeta(item: NewsFeedItem): string {
  const category = item.category || 'Știri';
  return item.dateLabel ? `${category} · ${item.dateLabel}` : category;
}

function MarketCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/10 px-4 py-3 sm:border-b-0 sm:border-r sm:px-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 font-[var(--font-space)] text-sm font-semibold tabular-nums text-white sm:text-base">
        {value}
      </p>
    </div>
  );
}
