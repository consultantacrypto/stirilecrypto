import type { ArticleContentType, ArticleStatus } from '@/lib/types/stiri';

export const ARTICLE_CONTENT_TYPE_NEWS: ArticleContentType = 'news';
export const ARTICLE_CONTENT_TYPE_MARKET_PULSE: ArticleContentType = 'market_pulse';

/** Coerce any form/DB value to a valid Supabase check-constraint value. */
export function normalizeArticleContentType(value: unknown): ArticleContentType {
  if (value === ARTICLE_CONTENT_TYPE_MARKET_PULSE) {
    return ARTICLE_CONTENT_TYPE_MARKET_PULSE;
  }
  return ARTICLE_CONTENT_TYPE_NEWS;
}

export type StireWritePayload = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  content_type: ArticleContentType;
  status: ArticleStatus;
  image_url: string | null;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
};

type BuildStireWritePayloadInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  content_type: unknown;
  status: ArticleStatus;
  image_url: string | null;
  published_at: string | null;
  meta_title: string;
  meta_description: string;
};

export function buildStireWritePayload(input: BuildStireWritePayloadInput): StireWritePayload {
  return {
    title: input.title.trim() || 'Draft fără titlu',
    slug: input.slug.trim() || `draft-${Date.now()}`,
    excerpt: input.excerpt.trim(),
    content: input.content.trim(),
    category: input.category.trim() || 'ȘTIRI GENERALE',
    content_type: normalizeArticleContentType(input.content_type),
    status: input.status,
    image_url: input.image_url,
    published_at: input.published_at,
    meta_title: input.meta_title.trim() || null,
    meta_description: input.meta_description.trim() || null,
  };
}

export function formatSupabaseWriteError(
  error: { message?: string; details?: string; hint?: string; code?: string },
  context: 'insert' | 'update',
): string {
  const message = error.message ?? `Supabase ${context} failed`;
  const parts = [message];

  if (error.details) parts.push(error.details);
  if (error.hint) parts.push(`Hint: ${error.hint}`);
  if (error.code) parts.push(`Code: ${error.code}`);

  if (
    message.toLowerCase().includes('content_type') ||
    error.code === 'PGRST204'
  ) {
    parts.push(
      'Verifică că ai rulat supabase/market-pulse-schema.sql în Supabase SQL Editor.',
    );
  }

  return parts.join(' — ');
}
