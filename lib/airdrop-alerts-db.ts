import {
  AIRDROP_ALERT_SEED,
  publishedAirdropAlerts,
  rowToAirdropAlert,
  type AirdropAlert,
} from '@/lib/airdrop-alert';
import { getSupabase } from '@/lib/supabase';

const COLUMNS =
  'id, slug, name, program_type, program_status, window_label, source_url, source_url_secondary, note, deadline_at, risk_level, sort_order, status, updated_at';

export type AirdropAlertFeed = {
  items: AirdropAlert[];
  /** `cms` is the live table. `seed` is the same Account Research lot, used only if the table is missing. */
  source: 'cms' | 'seed';
};

function isMissingRelation(error: { code?: string; message?: string }): boolean {
  const message = error.message ?? '';
  return (
    error.code === '42P01' ||
    error.code === 'PGRST205' ||
    /does not exist|schema cache|could not find the table/i.test(message)
  );
}

/** Published rows for /airdrop-alert. Drafts stay in the CMS. */
export async function getPublishedAirdropAlerts(): Promise<AirdropAlertFeed> {
  const supabase = getSupabase();
  if (!supabase) {
    return { items: publishedAirdropAlerts(AIRDROP_ALERT_SEED), source: 'seed' };
  }

  const { data, error } = await supabase
    .from('airdrop_alerts')
    .select(COLUMNS)
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    if (isMissingRelation(error)) {
      console.error('[getPublishedAirdropAlerts] table missing, using Account Research seed');
      return { items: publishedAirdropAlerts(AIRDROP_ALERT_SEED), source: 'seed' };
    }
    console.error('[getPublishedAirdropAlerts]', error.message);
    return { items: [], source: 'cms' };
  }

  const items: AirdropAlert[] = [];
  for (const row of data ?? []) {
    const parsed = rowToAirdropAlert(row as Record<string, unknown>);
    if (parsed?.publishStatus === 'published') items.push(parsed);
  }
  return { items, source: 'cms' };
}
