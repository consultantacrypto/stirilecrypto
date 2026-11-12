import { SITE_URL } from './json-ld';

export const INDEXNOW_HOST = 'www.stirilecrypto.ro';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const INDEXNOW_KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/;

const AFFECTED_PATHS = ['/', '/stiri', '/hub/bitcoin', '/hub/mica', '/hub/securitate'] as const;

export function readIndexNowKey(): string | null {
  const key = process.env.INDEXNOW_KEY?.trim() ?? '';
  if (!INDEXNOW_KEY_PATTERN.test(key)) return null;
  return key;
}

export function indexNowKeyLocation(key: string): string {
  return `${SITE_URL}/${key}.txt`;
}

/** Key file body when the request segment matches INDEXNOW_KEY. Null otherwise. */
export function matchingIndexNowKey(segment: string): string | null {
  const key = readIndexNowKey();
  if (!key) return null;
  const requested = segment.toLowerCase().endsWith('.txt') ? segment.slice(0, -4) : segment;
  return requested === key ? key : null;
}

/**
 * Response for `/{INDEXNOW_KEY}.txt`. Null means "not this file" so other
 * `.txt` routes (robots.txt, llms.txt) keep their own handlers.
 * App Router does not treat `app/[key].txt` as a dynamic segment.
 */
export function indexNowKeyHttpResponse(pathname: string): Response | null {
  const match = pathname.match(/^\/([A-Za-z0-9-]{8,128})\.txt$/);
  if (!match) return null;
  const key = matchingIndexNowKey(match[1]);
  if (!key) return null;
  return new Response(key, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

/** Article URL plus the public surfaces revalidated on publish/update. */
export function indexNowUrlsForSlug(slug: string): string[] {
  return [`/stiri/${slug}`, ...AFFECTED_PATHS].map((path) =>
    path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`,
  );
}

function urlsOnHost(urls: readonly string[]): string[] {
  const unique = new Set<string>();
  for (const raw of urls) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const absolute = trimmed.startsWith('/') ? `${SITE_URL}${trimmed === '/' ? '/' : trimmed}` : trimmed;
    try {
      const parsed = new URL(absolute);
      if (parsed.hostname !== INDEXNOW_HOST) continue;
      unique.add(parsed.toString());
    } catch {
      continue;
    }
  }
  return [...unique];
}

/**
 * Tell IndexNow about changed URLs. Missing key, network errors, and non-OK
 * responses are logged and swallowed so publishing still succeeds.
 */
export async function notifyIndexNow(urls: readonly string[]): Promise<void> {
  const key = readIndexNowKey();
  const urlList = urlsOnHost(urls);
  if (!key || urlList.length === 0) return;

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: INDEXNOW_HOST,
        key,
        keyLocation: indexNowKeyLocation(key),
        urlList,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      console.error('[indexnow] request failed', response.status);
    }
  } catch (error) {
    console.error('[indexnow]', error);
  }
}
