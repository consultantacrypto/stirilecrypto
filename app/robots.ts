import type { MetadataRoute } from 'next';
import { SITE_SITEMAP_URL } from '@/lib/json-ld';

const AI_SEARCH_BOTS = ['GPTBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended'] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      ...AI_SEARCH_BOTS.map((userAgent) => ({
        userAgent,
        allow: '/',
      })),
    ],
    sitemap: SITE_SITEMAP_URL,
  };
}
