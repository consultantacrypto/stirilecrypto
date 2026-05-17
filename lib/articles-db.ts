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
