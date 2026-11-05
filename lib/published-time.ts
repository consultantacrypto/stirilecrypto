import { BUCHAREST_TIME_ZONE } from './site';

/**
 * Publication instant from CMS fields. `published_at` wins.
 * `created_at` is the fallback when a published row was saved without one.
 * Returns null when neither exists — callers must not substitute the request clock.
 */
export function articlePublicationIso(
  publishedAt: string | null | undefined,
  createdAt?: string | null,
): string | null {
  const published = publishedAt?.trim();
  if (published) return published;
  const created = createdAt?.trim();
  return created || null;
}

function isoIncludesClockTime(iso: string): boolean {
  const match = iso.match(/T(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return false;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] || '0');
  return hours !== 0 || minutes !== 0 || seconds !== 0;
}

export function formatPublishedDisplay(
  iso: string | null | undefined,
  fallbackLabel: string,
): { dateTime: string | null; display: string } {
  if (!iso?.trim()) {
    return { dateTime: null, display: fallbackLabel };
  }

  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return { dateTime: null, display: fallbackLabel };
  }

  const dateTime = parsed.toISOString();
  const display = isoIncludesClockTime(iso)
    ? parsed.toLocaleString('ro-RO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: BUCHAREST_TIME_ZONE,
      })
    : parsed.toLocaleDateString('ro-RO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: BUCHAREST_TIME_ZONE,
      });

  return { dateTime, display };
}
