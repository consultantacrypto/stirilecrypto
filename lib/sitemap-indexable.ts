/**
 * Paths whose pages send `noindex`. They stay out of the sitemap, including
 * any query-string variant (`/cauta?q=bitcoin`).
 *
 * Scan of the routes this sitemap emits: `/cauta` is the only noindex URL.
 * Other noindex pages (admin, payment and order result pages, the 404)
 * are not generated here.
 */
const SITEMAP_NOINDEX_PATHS = new Set(['/cauta']);

function pathnameOf(url: string): string | null {
  try {
    const { pathname } = new URL(url);
    if (pathname.length > 1 && pathname.endsWith('/')) {
      return pathname.replace(/\/+$/, '');
    }
    return pathname || '/';
  } catch {
    return null;
  }
}

/** True when the URL is safe to list. Unparseable URLs are left untouched. */
export function isIndexableSitemapUrl(url: string): boolean {
  const pathname = pathnameOf(url);
  if (pathname == null) return true;
  return !SITEMAP_NOINDEX_PATHS.has(pathname);
}

export function withoutNoindexSitemapUrls<T extends { url: string }>(entries: readonly T[]): T[] {
  return entries.filter((entry) => isIndexableSitemapUrl(entry.url));
}
