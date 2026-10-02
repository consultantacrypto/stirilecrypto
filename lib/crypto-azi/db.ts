import { getSupabase } from '@/lib/supabase';
import { bucharestDateIso, normalizeTakeaways } from '@/lib/crypto-azi/format';
import type { CryptoDailyBrief } from '@/lib/crypto-azi/types';

function mapRow(row: Record<string, unknown>): CryptoDailyBrief {
  return {
    id: String(row.id),
    brief_date: String(row.brief_date),
    status: row.status as CryptoDailyBrief['status'],
    title: String(row.title ?? ''),
    introduction: String(row.introduction ?? ''),
    takeaways: normalizeTakeaways(row.takeaways),
    published_at: (row.published_at as string | null) ?? null,
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
    author_id: (row.author_id as string | null) ?? null,
    author_name: (row.author_name as string | null) ?? null,
  };
}

export type PublicBriefResult = {
  brief: CryptoDailyBrief | null;
  /** true when showing today's published brief */
  isToday: boolean;
  /** true when falling back to an older published brief */
  isFallback: boolean;
};

/**
 * Pure selection used by getPublicCryptoBrief and fixture QA.
 * Only considers status === 'published'. Draft/archived never win.
 */
export function selectPublicBriefFromRows(
  rows: Array<Pick<CryptoDailyBrief, 'brief_date' | 'status'> & Partial<CryptoDailyBrief>>,
  now = new Date(),
): PublicBriefResult {
  const today = bucharestDateIso(now);
  const published = rows.filter((r) => r.status === 'published');

  if (published.length === 0) {
    return { brief: null, isToday: false, isFallback: false };
  }

  const todayRow = published.find((r) => r.brief_date === today);
  if (todayRow && todayRow.id) {
    return {
      brief: todayRow as CryptoDailyBrief,
      isToday: true,
      isFallback: false,
    };
  }

  const sorted = [...published].sort((a, b) =>
    String(b.brief_date).localeCompare(String(a.brief_date)),
  );
  const latest = sorted[0];
  if (!latest?.id) {
    return { brief: null, isToday: false, isFallback: false };
  }

  return {
    brief: latest as CryptoDailyBrief,
    isToday: false,
    isFallback: true,
  };
}

/**
 * Public read via anon client (no cookies) — safe for ISR/static generation.
 * RLS: only published rows are visible to anon/authenticated JWT.
 * Admin draft/archived reads go through server actions + service_role.
 */
export async function getPublicCryptoBrief(
  now = new Date(),
): Promise<PublicBriefResult> {
  const today = bucharestDateIso(now);
  const supabase = getSupabase();
  if (!supabase) {
    return { brief: null, isToday: false, isFallback: false };
  }

  try {
    const { data: todayRow, error: todayError } = await supabase
      .from('crypto_daily_briefs')
      .select('*')
      .eq('status', 'published')
      .eq('brief_date', today)
      .maybeSingle();

    if (todayError) {
      console.error('[crypto-azi] today brief', todayError.message);
    }

    if (todayRow) {
      return {
        brief: mapRow(todayRow as Record<string, unknown>),
        isToday: true,
        isFallback: false,
      };
    }

    const { data: latestRows, error: latestError } = await supabase
      .from('crypto_daily_briefs')
      .select('*')
      .eq('status', 'published')
      .order('brief_date', { ascending: false })
      .limit(1);

    if (latestError) {
      console.error('[crypto-azi] latest brief', latestError.message);
      return { brief: null, isToday: false, isFallback: false };
    }

    const latest = latestRows?.[0];
    if (!latest) {
      return { brief: null, isToday: false, isFallback: false };
    }

    return {
      brief: mapRow(latest as Record<string, unknown>),
      isToday: false,
      isFallback: true,
    };
  } catch (err) {
    console.error('[crypto-azi] getPublicCryptoBrief', err);
    return { brief: null, isToday: false, isFallback: false };
  }
}
