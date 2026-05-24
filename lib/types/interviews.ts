export type InterviewStatus = 'draft' | 'published';

export const INTERVIEW_BADGE_OPTIONS = ['EXCLUSIV', 'KOL', 'ANALIZĂ'] as const;
export type InterviewBadge = (typeof INTERVIEW_BADGE_OPTIONS)[number];

export interface Interview {
  id: string;
  slug: string;
  title: string;
  guest_name: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  badge: string;
  status: InterviewStatus;
  created_at: string;
}

export interface InterviewInsert {
  slug: string;
  title: string;
  guest_name: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  badge: string;
  status: InterviewStatus;
}

export interface InterviewUpdate extends InterviewInsert {
  id: string;
}
