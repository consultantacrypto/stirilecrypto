import type { MetadataRoute } from 'next';
import { getAllPublishedArticles } from '@/lib/articles-db';

const BASE_URL = 'https://www.stirilecrypto.ro';

/** Runtime generation — avoids blocking build when Supabase is unavailable */
export const dynamic = 'force-dynamic';

function articleLastModified(article: {
  published_at: string | null;
  created_at?: string | null;
}): Date {
  if (article.published_at) return new Date(article.published_at);
  if (article.created_at) return new Date(article.created_at);
  return new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/stiri`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  let articleRoutes: MetadataRoute.Sitemap = [];

  try {
    const published = await getAllPublishedArticles();
    articleRoutes = published.map((article) => ({
      url: `${BASE_URL}/stiri/${article.slug}`,
      lastModified: articleLastModified(article),
      changeFrequency: 'daily',
      priority: 0.8,
    }));
  } catch (err) {
    console.error('[sitemap] Failed to fetch published articles:', err);
  }

  return [...staticRoutes, ...articleRoutes];
}
