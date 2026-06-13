import { cache } from 'react';
import { articles } from '@/lib/articles';
import { resolveImageUrl } from '@/lib/image-url';
import { getSupabase } from '@/lib/supabase';
import type { Stire } from '@/lib/types/stiri';

const PUBLISHED_STATUS = 'published';

/** Matches legacy homepage slice: skip first N featured static articles */
const FEATURED_ARTICLE_COUNT = 4;

type StaticArticle = (typeof articles)[number];

/** Unified card shape for homepage feed (Supabase + static fallback) */
export interface NewsFeedItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  dateLabel: string;
}

function staticArticleToFeedItem(article: StaticArticle): NewsFeedItem {
  return {
    id: article.id ?? article.slug ?? 'static-article',
    slug: article.slug ?? '',
    title: article.title ?? '',
    excerpt: article.summary ?? '',
    category: article.category ?? '',
    image_url: resolveImageUrl({ image: article.image ?? '' }),
    dateLabel: article.date ?? '',
  };
}

function stireToFeedItem(stire: Stire): NewsFeedItem {
  return {
    id: stire.id,
    slug: stire.slug,
    title: stire.title,
    excerpt: stire.excerpt,
    category: stire.category,
    image_url: resolveImageUrl(stire),
    dateLabel: formatArticleDate(stire.published_at),
  };
}

function getStaticFeedArticles(limit: number): NewsFeedItem[] {
  return articles
    .slice(FEATURED_ARTICLE_COUNT, FEATURED_ARTICLE_COUNT + limit)
    .map(staticArticleToFeedItem);
}

/**
 * Homepage feed: Supabase published articles first; if empty, legacy static articles.
 * When Supabase has rows, appends non-duplicate static articles up to `limit`.
 */
export async function getHomeFeedArticles(limit = 9): Promise<NewsFeedItem[]> {
  const fromDb = await getPublishedArticles(limit);

  if (!fromDb || fromDb.length === 0) {
    return getStaticFeedArticles(limit);
  }

  const dbItems = fromDb.map(stireToFeedItem);
  const dbSlugs = new Set(dbItems.map((item) => item.slug));

  const staticFill = articles
    .slice(FEATURED_ARTICLE_COUNT)
    .filter((article) => !dbSlugs.has(article.slug))
    .map(staticArticleToFeedItem)
    .slice(0, Math.max(0, limit - dbItems.length));

  return [...dbItems, ...staticFill];
}

export async function getPublishedArticles(limit = 6): Promise<Stire[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('stiri')
    .select('*')
    .eq('status', PUBLISHED_STATUS)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error('[getPublishedArticles]', error.message);
    return [];
  }

  return (data ?? []) as Stire[];
}

/** All published rows from Supabase (no limit) — for /stiri listing */
export async function getAllPublishedArticles(): Promise<Stire[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('stiri')
    .select('id, slug, title, excerpt, category, image_url, published_at, status, views')
    .eq('status', PUBLISHED_STATUS)
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('[getAllPublishedArticles]', error.message);
    return [];
  }

  return (data ?? []) as Stire[];
}

/** Card shape for /stiri grid — Supabase + legacy static */
export interface NewsListingItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  image: string;
  date: string;
  impact: ArticleImpact;
}

function stireToListingItem(stire: Stire): NewsListingItem {
  return {
    id: stire.id,
    slug: stire.slug,
    title: stire.title,
    summary: stire.excerpt,
    category: stire.category,
    image: resolveImageUrl(stire),
    date: formatArticleDate(stire.published_at),
    impact: 'neutral',
  };
}

function staticArticleToListingItem(article: StaticArticle): NewsListingItem {
  return {
    id: article.id ?? article.slug ?? 'static-article',
    slug: article.slug ?? '',
    title: article.title ?? '',
    summary: article.summary ?? '',
    category: article.category ?? '',
    image: resolveImageUrl({ image: article.image ?? '' }),
    date: article.date ?? '',
    impact: parseStaticImpact(article.impact),
  };
}

/**
 * /stiri listing: Supabase published first, then static articles.
 * Duplicate slugs: Supabase wins; static entry is skipped.
 */
export async function getMergedNewsListingArticles(): Promise<NewsListingItem[]> {
  const fromDb = await getAllPublishedArticles();
  const dbSlugs = new Set(fromDb.map((s) => s.slug));
  const dbItems = fromDb.map(stireToListingItem);

  const staticItems = articles
    .filter((article) => !dbSlugs.has(article.slug))
    .map(staticArticleToListingItem);

  return [...dbItems, ...staticItems];
}

export async function getArticleBySlug(slug: string): Promise<Stire | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('stiri')
    .select('*')
    .eq('slug', slug)
    .eq('status', PUBLISHED_STATUS)
    .maybeSingle();

  if (error) {
    console.error('[getArticleBySlug]', error.message);
    return null;
  }

  return data as Stire | null;
}

export type ArticleImpact = 'bullish' | 'bearish' | 'neutral';

/** Normalized article for detail page (Supabase + legacy static) */
export interface ArticlePageData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  dateLabel: string;
  /** ISO 8601 — for JSON-LD & OpenGraph */
  published_at: string | null;
  /** ISO 8601 — falls back to published_at when absent */
  updated_at: string | null;
  readTime: string;
  mihaiTake: string | null;
  impact: ArticleImpact;
  views: number;
  meta_title: string | null;
  meta_description: string | null;
}

function parseStaticImpact(impact: string | undefined): ArticleImpact {
  if (impact === 'bullish' || impact === 'bearish' || impact === 'neutral') {
    return impact;
  }
  return 'neutral';
}

function staticArticleToPageData(article: StaticArticle): ArticlePageData {
  const publishedIso = parseDisplayDateToIso(article.date ?? '');
  return {
    id: article.id ?? article.slug ?? 'static-article',
    slug: article.slug ?? '',
    title: article.title ?? '',
    excerpt: article.summary ?? '',
    content: article.content ?? '',
    category: article.category ?? '',
    image_url: resolveImageUrl({ image: article.image ?? '' }),
    dateLabel: article.date ?? '',
    published_at: publishedIso,
    updated_at: publishedIso,
    readTime: article.readTime ?? '5 min',
    mihaiTake: 'mihaiTake' in article && article.mihaiTake ? article.mihaiTake : null,
    impact: parseStaticImpact(article.impact),
    views: 0,
    meta_title: null,
    meta_description: null,
  };
}

function parseDisplayDateToIso(display: string): string | null {
  const parsed = new Date(display);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function stireToPageData(stire: Stire): ArticlePageData {
  const publishedIso = stire.published_at ?? null;
  const updatedIso = stire.created_at ?? publishedIso;
  return {
    id: stire.id,
    slug: stire.slug,
    title: stire.title,
    excerpt: stire.excerpt,
    content: stire.content,
    category: stire.category,
    image_url: resolveImageUrl(stire),
    dateLabel: formatArticleDate(stire.published_at),
    published_at: publishedIso,
    updated_at: updatedIso,
    readTime: '5 min',
    mihaiTake: null,
    impact: 'neutral',
    views: typeof stire.views === 'number' ? stire.views : Number(stire.views ?? 0),
    meta_title: stire.meta_title ?? null,
    meta_description: stire.meta_description ?? null,
  };
}

export function getStaticArticleBySlug(slug: string): ArticlePageData | null {
  const article = articles.find((a) => a.slug === slug);
  if (!article) return null;
  return staticArticleToPageData(article);
}

async function fetchArticleForPage(slug: string): Promise<ArticlePageData | null> {
  const fromDb = await getArticleBySlug(slug);
  if (fromDb) return stireToPageData(fromDb);

  return getStaticArticleBySlug(slug);
}

/** Deduped per request — safe for generateMetadata + page component */
export const getArticleForPage = cache(fetchArticleForPage);

export async function getAllArticleSlugs(): Promise<{ slug: string }[]> {
  const dbSlugs = await getPublishedSlugs();
  const seen = new Set(dbSlugs.map((s) => s.slug));

  for (const article of articles) {
    if (!seen.has(article.slug)) {
      dbSlugs.push({ slug: article.slug });
      seen.add(article.slug);
    }
  }

  return dbSlugs;
}

export async function getPublishedSlugs(): Promise<{ slug: string }[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('stiri')
    .select('slug')
    .eq('status', PUBLISHED_STATUS);

  if (error) {
    console.error('[getPublishedSlugs]', error.message);
    return [];
  }

  return (data ?? []) as { slug: string }[];
}

type RelatedRow = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image_url: string | null;
  published_at: string | null;
};

function relatedRowToListingItem(row: RelatedRow, idFallback: string): NewsListingItem {
  return {
    id: idFallback,
    slug: row.slug,
    title: row.title,
    summary: row.excerpt,
    category: row.category,
    image: resolveImageUrl(row),
    date: formatArticleDate(row.published_at),
    impact: 'neutral',
  };
}

/** Related cards: narrow Supabase query (no full-table scan, no content HTML). */
export async function getMergedRelatedArticles(
  currentSlug: string,
  limit = 3
): Promise<NewsListingItem[]> {
  const items: NewsListingItem[] = [];
  const supabase = getSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from('stiri')
      .select('slug, title, excerpt, category, image_url, published_at')
      .eq('status', PUBLISHED_STATUS)
      .neq('slug', currentSlug)
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(limit);

    if (!error && data) {
      for (const row of data as RelatedRow[]) {
        items.push(relatedRowToListingItem(row, row.slug));
      }
    } else if (error) {
      console.error('[getMergedRelatedArticles]', error.message);
    }
  }

  if (items.length < limit) {
    const seen = new Set(items.map((i) => i.slug));
    const staticFill = articles
      .filter((a) => a.slug !== currentSlug && !seen.has(a.slug))
      .slice(0, limit - items.length)
      .map(staticArticleToListingItem);
    items.push(...staticFill);
  }

  return items.slice(0, limit);
}

export function formatArticleDate(iso: string | null): string {
  if (!iso) return 'Recent';
  return new Date(iso).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
