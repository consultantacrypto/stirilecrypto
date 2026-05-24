import { cache } from 'react';
import { getSupabase } from '@/lib/supabase';
import {
  type InterviewCardItem,
  formatInterviewDate,
  interviewRowToCardItem,
} from '@/lib/interviews';
import type { Interview } from '@/lib/types/interviews';

const PUBLISHED_STATUS = 'published';

export interface InterviewPageData extends Interview {
  dateLabel: string;
}

export const getPublishedInterviews = cache(
  async (limit?: number): Promise<InterviewCardItem[]> => {
    const supabase = getSupabase();
    if (!supabase) {
      console.error('[getPublishedInterviews] Supabase client is not configured.');
      return [];
    }

    let query = supabase
      .from('interviews')
      .select('slug, title, excerpt, cover_image, badge')
      .eq('status', PUBLISHED_STATUS)
      .order('created_at', { ascending: false });

    if (typeof limit === 'number' && limit > 0) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[getPublishedInterviews]', error.message);
      return [];
    }

    return (data ?? []).map((row) =>
      interviewRowToCardItem({
        slug: row.slug as string,
        title: row.title as string,
        excerpt: row.excerpt as string,
        cover_image: (row.cover_image as string | null) ?? null,
        badge: row.badge as string,
      }),
    );
  },
);

export const getPublishedInterviewSlugs = cache(async (): Promise<{ slug: string }[]> => {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('interviews')
    .select('slug')
    .eq('status', PUBLISHED_STATUS);

  if (error) {
    console.error('[getPublishedInterviewSlugs]', error.message);
    return [];
  }

  return (data ?? []).map((row) => ({ slug: row.slug as string }));
});

export const getInterviewBySlug = cache(
  async (slug: string): Promise<InterviewPageData | null> => {
    const supabase = getSupabase();
    if (!supabase) {
      console.error('[getInterviewBySlug] Supabase client is not configured.');
      return null;
    }

    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('slug', slug)
      .eq('status', PUBLISHED_STATUS)
      .maybeSingle();

    if (error) {
      console.error('[getInterviewBySlug]', error.message);
      return null;
    }

    if (!data) return null;

    const interview = data as Interview;
    return {
      ...interview,
      dateLabel: formatInterviewDate(interview.created_at),
    };
  },
);
