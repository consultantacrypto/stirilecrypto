import type { MetadataRoute } from 'next';
import { SITE_NEWS_SITEMAP_URL, SITE_SITEMAP_URL } from '@/lib/json-ld';

const AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'Google-Extended',
  'CCBot',
  'anthropic-ai',
  'ClaudeBot',
  'PerplexityBot',
] as const;

const PRIVATE_PATHS = [
  '/admin/',
  '/admin',
  '/api/',
  '/dashboard',
  '/login',
  '/editeaza',
  '/articol-nou',
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [...PRIVATE_PATHS],
      },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        disallow: ['/'],
      })),
    ],
    sitemap: [SITE_SITEMAP_URL, SITE_NEWS_SITEMAP_URL],
  };
}
