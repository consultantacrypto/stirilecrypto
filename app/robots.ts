import type { MetadataRoute } from 'next';
import { SITE_NEWS_SITEMAP_URL, SITE_SITEMAP_URL } from '@/lib/json-ld';

// Training crawlers stay fully blocked. Citation crawlers (ChatGPT-User,
// PerplexityBot, OAI-SearchBot) are omitted so they follow the public * rules.
// Google-Extended allowed as a test from 19 Nov 2026 until 1 Dec 2026 (AI visibility test); revert by re-adding it here.
const AI_BOTS = [
  'GPTBot',
  'CCBot',
  'anthropic-ai',
  'ClaudeBot',
] as const;

const PRIVATE_PATHS = [
  '/admin/',
  '/admin',
  '/api/',
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
