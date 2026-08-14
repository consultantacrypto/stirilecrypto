import { SITE_URL } from '@/lib/json-ld';

function firstString(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export type StiriListParams = {
  page: number;
  category: string | null;
};

export function parseStiriListParams(
  searchParams: Record<string, string | string[] | undefined>,
): StiriListParams {
  const pageRaw = firstString(searchParams.page);
  const parsedPage = pageRaw ? Number(pageRaw) : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  const categoryRaw = firstString(searchParams.category)?.trim() || null;
  const category = categoryRaw && categoryRaw !== 'all' ? categoryRaw : null;

  return { page, category };
}

function buildCanonicalQuery(page: number, category: string | null): string {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (page >= 2) params.set('page', String(page));
  return params.toString();
}

/** Path + query for internal links (page + category only). */
export function stiriListPath(page: number, category: string | null): string {
  const query = buildCanonicalQuery(page, category);
  return query ? `/stiri?${query}` : '/stiri';
}

/** Canonical excludes tracking and any other non-listing params. */
export function stiriListCanonical(page: number, category: string | null): string {
  return `${SITE_URL}${stiriListPath(page, category)}`;
}

function appendUnchanged(
  params: URLSearchParams,
  key: string,
  value: string | string[] | undefined,
) {
  if (value === undefined) return;
  const values = Array.isArray(value) ? value : [value];
  for (const item of values) {
    if (item !== undefined) params.append(key, item);
  }
}

/**
 * Redirect target for redundant page=1 / category=all only.
 * Keeps tracking params and every other query key unchanged.
 */
export function stiriNormalizedPath(
  searchParams: Record<string, string | string[] | undefined>,
  parsed: StiriListParams,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    const lower = key.toLowerCase();

    if (lower === 'page') {
      if (parsed.page >= 2) params.set('page', String(parsed.page));
      continue;
    }

    if (lower === 'category') {
      if (parsed.category) params.set('category', parsed.category);
      continue;
    }

    appendUnchanged(params, key, value);
  }

  const query = params.toString();
  return query ? `/stiri?${query}` : '/stiri';
}

/** 308 only for redundant page=1 or category=all — never for tracking params alone. */
export function stiriListNeedsNormalization(
  searchParams: Record<string, string | string[] | undefined>,
  parsed: StiriListParams,
): boolean {
  const pageRaw = firstString(searchParams.page);
  if (pageRaw !== undefined && parsed.page <= 1) return true;

  const categoryRaw = firstString(searchParams.category);
  if (categoryRaw !== undefined && (categoryRaw.trim() === '' || categoryRaw === 'all')) {
    return true;
  }

  return false;
}
