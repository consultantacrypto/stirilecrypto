import { unstable_noStore as noStore } from 'next/cache';
import { articles } from '@/lib/articles';
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
  image_url: string | null;
  dateLabel: string;
}

function resolveImageUrl(source: { image_url?: string | null; image?: string }): string | null {
  const url = source.image_url ?? source.image;
  return url && url.trim() !== '' ? url : null;
}

function staticArticleToFeedItem(article: StaticArticle): NewsFeedItem {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.summary,
    category: article.category,
    image_url: resolveImageUrl({ image: article.image }),
    dateLabel: article.date,
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
export async function getHomeFeedArticles(limit = 6): Promise<NewsFeedItem[]> {
  noStore();
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
  noStore();

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
  noStore();

  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('stiri')
    .select('*')
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
  image: string | null;
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
    id: article.id,
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    category: article.category,
    image: resolveImageUrl({ image: article.image }),
    date: article.date,
    impact: parseStaticImpact(article.impact),
  };
}

/**
 * /stiri listing: Supabase published first, then static articles.
 * Duplicate slugs: Supabase wins; static entry is skipped.
 */
export async function getMergedNewsListingArticles(): Promise<NewsListingItem[]> {
  noStore();

  const fromDb = await getAllPublishedArticles();
  const dbSlugs = new Set(fromDb.map((s) => s.slug));
  const dbItems = fromDb.map(stireToListingItem);

  const staticItems = articles
    .filter((article) => !dbSlugs.has(article.slug))
    .map(staticArticleToListingItem);

  return [...dbItems, ...staticItems];
}

export async function getArticleBySlug(slug: string): Promise<Stire | null> {
  noStore();

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
  image_url: string | null;
  dateLabel: string;
  readTime: string;
  mihaiTake: string | null;
  impact: ArticleImpact;
}

function parseStaticImpact(impact: string | undefined): ArticleImpact {
  if (impact === 'bullish' || impact === 'bearish' || impact === 'neutral') {
    return impact;
  }
  return 'neutral';
}

function staticArticleToPageData(article: StaticArticle): ArticlePageData {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.summary,
    content: article.content,
    category: article.category,
    image_url: resolveImageUrl({ image: article.image }),
    dateLabel: article.date,
    readTime: article.readTime ?? '5 min',
    mihaiTake: 'mihaiTake' in article && article.mihaiTake ? article.mihaiTake : null,
    impact: parseStaticImpact(article.impact),
  };
}

function stireToPageData(stire: Stire): ArticlePageData {
  return {
    id: stire.id,
    slug: stire.slug,
    title: stire.title,
    excerpt: stire.excerpt,
    content: stire.content,
    category: stire.category,
    image_url: resolveImageUrl(stire),
    dateLabel: formatArticleDate(stire.published_at),
    readTime: '5 min',
    mihaiTake: null,
    impact: 'neutral',
  };
}

export function getStaticArticleBySlug(slug: string): ArticlePageData | null {
  const article = articles.find((a) => a.slug === slug);
  if (!article) return null;
  return staticArticleToPageData(article);
}

/** Supabase first, then legacy `lib/articles` — never 404 if static entry exists */
export async function getArticleForPage(slug: string): Promise<ArticlePageData | null> {
  noStore();

  const fromDb = await getArticleBySlug(slug);
  if (fromDb) return stireToPageData(fromDb);

  return getStaticArticleBySlug(slug);
}

export async function getAllArticleSlugs(): Promise<{ slug: string }[]> {
  noStore();

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
  noStore();

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

export async function getRelatedArticles(currentSlug: string, limit = 3): Promise<Stire[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('stiri')
    .select('*')
    .eq('status', PUBLISHED_STATUS)
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getRelatedArticles]', error.message);
    return [];
  }

  return (data ?? []) as Stire[];
}

export function formatArticleDate(iso: string | null): string {
  if (!iso) return 'Recent';
  return new Date(iso).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
