import { formatPublishedDisplay } from '@/lib/published-time';

export type PulseFreshnessStatus = 'fresh' | 'archived' | 'unknown';

const DEFAULT_FRESHNESS_HOURS = 24;

/** Hours after snapshot `published_at` before the terminal is labelled archived. */
export function getMarketPulseFreshnessHours(): number {
  const raw = process.env.MARKET_PULSE_FRESHNESS_HOURS?.trim();
  if (!raw) return DEFAULT_FRESHNESS_HOURS;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_FRESHNESS_HOURS;
  return parsed;
}

export function getPulseFreshnessStatus(
  publishedAt: string | null | undefined,
  now = new Date(),
): PulseFreshnessStatus {
  if (!publishedAt?.trim()) return 'unknown';
  const parsed = new Date(publishedAt);
  if (Number.isNaN(parsed.getTime())) return 'unknown';
  const maxAgeMs = getMarketPulseFreshnessHours() * 60 * 60 * 1000;
  return now.getTime() - parsed.getTime() > maxAgeMs ? 'archived' : 'fresh';
}

export function formatPulseTimestamp(iso: string | null | undefined): {
  dateTime: string | null;
  display: string;
} {
  return formatPublishedDisplay(iso, 'Actualitate necunoscută');
}
