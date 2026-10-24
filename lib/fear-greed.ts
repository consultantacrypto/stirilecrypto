export interface FearGreedReading {
  value: number;
  label: string;
}

const LABELS: Record<string, string> = {
  'extreme fear': 'Teamă extremă',
  fear: 'Teamă',
  neutral: 'Neutru',
  greed: 'Lăcomie',
  'extreme greed': 'Lăcomie extremă',
};

export function fearGreedLabel(value: number, classification?: string): string {
  const mapped = classification ? LABELS[classification.trim().toLowerCase()] : undefined;
  if (mapped) return mapped;
  if (value >= 75) return 'Lăcomie extremă';
  if (value >= 55) return 'Lăcomie';
  if (value >= 45) return 'Neutru';
  if (value >= 25) return 'Teamă';
  return 'Teamă extremă';
}

/** alternative.me returns `value` as a string. A missing or broken payload is hidden, not faked. */
export function parseFearGreedPayload(payload: unknown): FearGreedReading | null {
  if (!payload || typeof payload !== 'object') return null;
  const row = (payload as { data?: unknown }).data;
  const first = Array.isArray(row) ? row[0] : null;
  if (!first || typeof first !== 'object') return null;
  const rawValue = (first as { value?: unknown }).value;
  const value = typeof rawValue === 'number' ? rawValue : Number(rawValue);
  if (!Number.isFinite(value) || value < 0 || value > 100) return null;
  const classification = (first as { value_classification?: unknown }).value_classification;
  return {
    value: Math.round(value),
    label: fearGreedLabel(value, typeof classification === 'string' ? classification : undefined),
  };
}

export async function fetchFearGreed(): Promise<FearGreedReading | null> {
  try {
    const response = await fetch('https://api.alternative.me/fng/?limit=1', {
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;
    return parseFearGreedPayload(await response.json());
  } catch (error) {
    console.error('[fear-greed]', error instanceof Error ? error.message : 'unknown');
    return null;
  }
}