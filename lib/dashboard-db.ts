import { DEFAULT_BYBIT_AFFILIATE_URL } from '@/lib/affiliates';
import { getSupabase } from '@/lib/supabase';
import type {
  MicaComplianceItem,
  MicaEntityType,
  PulseTerminalLevel,
  PulseTerminalSnapshot,
  PulseTrend,
} from '@/lib/types/dashboard';

const PUBLISHED_STATUS = 'published';

function parseLevels(value: unknown): PulseTerminalLevel[] {
  if (!Array.isArray(value)) return [];
  const levels: PulseTerminalLevel[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue;
    const row = entry as { price?: unknown; label?: unknown };
    const price = Number(row.price);
    if (!Number.isFinite(price)) continue;
    levels.push({
      price,
      ...(typeof row.label === 'string' ? { label: row.label } : {}),
    });
  }
  return levels;
}

function rowToPulseSnapshot(row: Record<string, unknown>): PulseTerminalSnapshot {
  return {
    id: row.id as string,
    asset_symbol: row.asset_symbol as string,
    asset_label: row.asset_label as string,
    trend: row.trend as PulseTrend,
    support_levels: parseLevels(row.support_levels),
    resistance_levels: parseLevels(row.resistance_levels),
    summary: (row.summary as string | null) ?? null,
    linked_article_slug: (row.linked_article_slug as string | null) ?? null,
    affiliate_partner: (row.affiliate_partner as string) ?? 'bybit',
    affiliate_url: (row.affiliate_url as string) ?? DEFAULT_BYBIT_AFFILIATE_URL,
    status: row.status as PulseTerminalSnapshot['status'],
    published_at: (row.published_at as string | null) ?? null,
    created_at: row.created_at as string | undefined,
    updated_at: row.updated_at as string | undefined,
  };
}

function rowToMicaItem(row: Record<string, unknown>): MicaComplianceItem {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    entity_type: row.entity_type as MicaComplianceItem['entity_type'],
    compliance_status: row.compliance_status as MicaComplianceItem['compliance_status'],
    jurisdiction: (row.jurisdiction as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    source_url: (row.source_url as string | null) ?? null,
    sort_order: Number(row.sort_order ?? 0),
    status: row.status as MicaComplianceItem['status'],
    updated_at: row.updated_at as string | undefined,
    created_at: row.created_at as string | undefined,
  };
}

/** Latest published terminal snapshot for an asset (default BTC). */
export async function getActivePulseTerminal(
  assetSymbol = 'BTC',
): Promise<PulseTerminalSnapshot | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('pulse_terminal_snapshots')
    .select('*')
    .eq('status', PUBLISHED_STATUS)
    .eq('asset_symbol', assetSymbol.toUpperCase())
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[getActivePulseTerminal]', error.message);
    return null;
  }

  return data ? rowToPulseSnapshot(data as Record<string, unknown>) : null;
}

/** All published snapshots — archive / admin preview. */
export async function getPulseTerminalArchive(): Promise<PulseTerminalSnapshot[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('pulse_terminal_snapshots')
    .select('*')
    .eq('status', PUBLISHED_STATUS)
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('[getPulseTerminalArchive]', error.message);
    return [];
  }

  return (data ?? []).map((row) => rowToPulseSnapshot(row as Record<string, unknown>));
}

/** Published MiCA items, optionally filtered by entity type. */
export async function getMicaComplianceItems(
  entityType?: MicaEntityType,
): Promise<MicaComplianceItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  let query = supabase
    .from('mica_compliance_items')
    .select('*')
    .eq('status', PUBLISHED_STATUS)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (entityType) {
    query = query.eq('entity_type', entityType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[getMicaComplianceItems]', error.message);
    return [];
  }

  return (data ?? []).map((row) => rowToMicaItem(row as Record<string, unknown>));
}

/** Admin: all rows (draft + published). */
export async function getAllPulseTerminalSnapshots(): Promise<PulseTerminalSnapshot[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('pulse_terminal_snapshots')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[getAllPulseTerminalSnapshots]', error.message);
    return [];
  }

  return (data ?? []).map((row) => rowToPulseSnapshot(row as Record<string, unknown>));
}

export async function getAllMicaComplianceItems(): Promise<MicaComplianceItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('mica_compliance_items')
    .select('*')
    .order('entity_type', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[getAllMicaComplianceItems]', error.message);
    return [];
  }

  return (data ?? []).map((row) => rowToMicaItem(row as Record<string, unknown>));
}
