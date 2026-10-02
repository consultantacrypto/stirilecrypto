import type { CryptoTakeaway } from '@/lib/crypto-azi/types';

const URL_RE = /^https?:\/\/.+/i;

export function emptyTakeaways(): CryptoTakeaway[] {
  return [
    { title: '', why_it_matters: '', source_label: '', source_url: '' },
    { title: '', why_it_matters: '', source_label: '', source_url: '' },
    { title: '', why_it_matters: '', source_label: '', source_url: '' },
  ];
}

export function normalizeTakeaways(raw: unknown): CryptoTakeaway[] {
  const base = emptyTakeaways();
  if (!Array.isArray(raw)) return base;
  return base.map((fallback, index) => {
    const item = raw[index];
    if (!item || typeof item !== 'object') return fallback;
    const row = item as Record<string, unknown>;
    return {
      title: typeof row.title === 'string' ? row.title : '',
      why_it_matters: typeof row.why_it_matters === 'string' ? row.why_it_matters : '',
      source_label: typeof row.source_label === 'string' ? row.source_label : '',
      source_url: typeof row.source_url === 'string' ? row.source_url : '',
    };
  });
}

export type TakeawayValidation = {
  ok: boolean;
  errors: string[];
};

export function validateTakeaways(takeaways: CryptoTakeaway[]): TakeawayValidation {
  const errors: string[] = [];
  if (takeaways.length !== 3) {
    errors.push('Briefingul trebuie să aibă exact trei takeaways.');
    return { ok: false, errors };
  }

  takeaways.forEach((item, index) => {
    const n = index + 1;
    if (!item.title.trim()) errors.push(`Takeaway ${n}: lipsește titlul.`);
    if (!item.why_it_matters.trim()) errors.push(`Takeaway ${n}: lipsește „De ce contează”.`);
    if (!item.source_label.trim()) errors.push(`Takeaway ${n}: lipsește eticheta sursei.`);
    if (!item.source_url.trim()) errors.push(`Takeaway ${n}: lipsește URL-ul sursei.`);
    else if (!URL_RE.test(item.source_url.trim())) {
      errors.push(`Takeaway ${n}: URL-ul sursei trebuie să înceapă cu http(s)://.`);
    }
  });

  return { ok: errors.length === 0, errors };
}

/** Civil date YYYY-MM-DD in Europe/Bucharest. */
export function bucharestDateIso(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Bucharest',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function formatBucharestDate(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00+03:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('ro-RO', {
    timeZone: 'Europe/Bucharest',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatBucharestDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('ro-RO', {
    timeZone: 'Europe/Bucharest',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
