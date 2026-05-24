/** Card shape consumed by InterviewCard / InterviewGrid */
export interface InterviewCardItem {
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  badge: string;
}

export const BADGE_STYLES: Record<string, string> = {
  EXCLUSIV:
    'border-amber-500/40 bg-amber-500/10 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
  KOL: 'border-violet-500/40 bg-violet-500/10 text-violet-200 shadow-[0_0_12px_rgba(139,92,246,0.15)]',
  'ANALIZĂ':
    'border-cyan-500/40 bg-cyan-500/10 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.15)]',
  DEFAULT: 'border-white/20 bg-white/5 text-slate-300 shadow-none',
};

export function getBadgeStyle(badge: string): string {
  const key = badge.trim().toUpperCase();
  return BADGE_STYLES[key] ?? BADGE_STYLES.DEFAULT;
}

export function interviewRowToCardItem(row: {
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  badge: string;
}): InterviewCardItem {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    cover_image: row.cover_image,
    badge: row.badge.trim().toUpperCase() || 'EXCLUSIV',
  };
}

export function formatInterviewDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
