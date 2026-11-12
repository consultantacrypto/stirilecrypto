import { SITE_NEWS_SITEMAP_URL, SITE_SITEMAP_URL } from './json-ld';

export const PRIVATE_PATHS = [
  '/admin/',
  '/admin',
  '/api/',
  '/login',
  '/editeaza',
  '/articol-nou',
] as const;

// Bots that bring citations with a link (search, or fetch on a user request).
export const SEARCH_AND_CITATION_BOTS = [
  'Googlebot',
  'Bingbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'Claude-SearchBot',
  'Claude-User',
  'Applebot',
  'DuckDuckBot',
  'GrokBot',
  'xAI-SearchBot', // reported names, not documented by xAI
] as const;

// Training crawlers stay fully blocked, in this order.
// Google-Extended also controls Gemini grounding. It stays here until the owner decides.
export const TRAINING_BOTS = [
  'GPTBot',
  'Google-Extended',
  'CCBot',
  'anthropic-ai',
  'ClaudeBot',
] as const;

export function buildRobots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: [...PRIVATE_PATHS] },
      {
        userAgent: [...SEARCH_AND_CITATION_BOTS],
        allow: '/',
        disallow: [...PRIVATE_PATHS],
      },
      ...TRAINING_BOTS.map((userAgent) => ({
        userAgent,
        disallow: ['/'],
      })),
    ],
    sitemap: [SITE_SITEMAP_URL, SITE_NEWS_SITEMAP_URL],
  };
}
