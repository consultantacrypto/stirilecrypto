import type { MetadataRoute } from 'next';
import { getAllPublishedArticles, getAllPublishedMarketPulseArticles } from '@/lib/articles-db';
import { getPublishedInterviews } from '@/lib/interviews-db';
import { SITE_URL } from '@/lib/json-ld';

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
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/stiri`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/interviuri`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/market-pulse`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.88,
    },
  ];

  let articleRoutes: MetadataRoute.Sitemap = [];

  try {
    const published = await getAllPublishedArticles();
    articleRoutes = published.map((article) => ({
      url: `${SITE_URL}/stiri/${article.slug}`,
      lastModified: articleLastModified(article),
      changeFrequency: 'daily',
      priority: 0.8,
    }));
  } catch (err) {
    console.error('[sitemap] Failed to fetch published articles:', err);
  }

  let marketPulseRoutes: MetadataRoute.Sitemap = [];

  try {
    const pulses = await getAllPublishedMarketPulseArticles();
    marketPulseRoutes = pulses.map((pulse) => ({
      url: `${SITE_URL}/market-pulse/${pulse.slug}`,
      lastModified: articleLastModified(pulse),
      changeFrequency: 'daily',
      priority: 0.82,
    }));
  } catch (err) {
    console.error('[sitemap] Failed to fetch market pulse articles:', err);
  }

  let interviewRoutes: MetadataRoute.Sitemap = [];

  try {
    const interviews = await getPublishedInterviews();
    interviewRoutes = interviews.map((interview) => ({
      url: `${SITE_URL}/interviuri/${interview.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    }));
  } catch (err) {
    console.error('[sitemap] Failed to fetch published interviews:', err);
  }

  return [...staticRoutes, ...articleRoutes, ...marketPulseRoutes, ...interviewRoutes];
}
