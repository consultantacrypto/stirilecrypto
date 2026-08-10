import { unstable_cache } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/service';
import { getSupabase } from '@/lib/supabase';
import {
  isEtfAsset,
  periodToFromDate,
  rowToSnapshot,
} from '@/lib/etf/format';
import type {
  EtfAssetSymbol,
  EtfPeriod,
  EtfSnapshot,
  EtfSnapshotRow,
} from '@/lib/etf/types';

const SELECT_COLS =
  'id, asset_symbol, etf_name, snapshot_date, net_flow_usd, inflow_usd, outflow_usd, aum_usd, source, created_at, updated_at';

const SELECT_COLS_LEGACY = 'id, asset_symbol, snapshot_date, net_flow_usd, source, created_at';

function normalizeRows(data: unknown[]): EtfSnapshotRow[] {
  return data.map((raw) => {
    const row = raw as Record<string, unknown>;
    return {
      id: String(row.id),
      asset_symbol: row.asset_symbol as EtfAssetSymbol,
      etf_name: typeof row.etf_name === 'string' ? row.etf_name : 'AGGREGATE',
      snapshot_date: String(row.snapshot_date),
      net_flow_usd: Number(row.net_flow_usd),
      inflow_usd: Number(row.inflow_usd ?? 0),
      outflow_usd: Number(row.outflow_usd ?? 0),
      aum_usd: row.aum_usd == null ? null : Number(row.aum_usd),
      source: String(row.source ?? 'manual'),
      created_at: row.created_at ? String(row.created_at) : undefined,
      updated_at: row.updated_at ? String(row.updated_at) : undefined,
    };
  });
}

async function querySnapshots(
  asset: EtfAssetSymbol,
  fromDate: string,
  excludeLegacy: boolean,
): Promise<EtfSnapshotRow[]> {
  let client;
  try {
    client = createServiceClient();
  } catch {
    client = getSupabase();
  }
  if (!client) return [];

  let query = client
    .from('etf_snapshots')
    .select(SELECT_COLS)
    .eq('asset_symbol', asset)
    .gte('snapshot_date', fromDate)
    .order('snapshot_date', { ascending: true });

  if (excludeLegacy) {
    query = query.neq('source', 'legacy_seed');
  }

  const { data, error } = await query;

  if (error) {
    // Pre-migration schema fallback (no etf_name / inflow columns yet)
    console.warn('[fetchEtfSnapshots] primary query failed, trying legacy select', error.message);
    let legacy = client
      .from('etf_snapshots')
      .select(SELECT_COLS_LEGACY)
      .eq('asset_symbol', asset)
      .gte('snapshot_date', fromDate)
      .order('snapshot_date', { ascending: true });

    if (excludeLegacy) {
      legacy = legacy.neq('source', 'legacy_seed');
    }

    const legacyResult = await legacy;
    if (legacyResult.error) {
      console.error('[fetchEtfSnapshots] legacy', legacyResult.error.message);
      throw new Error(legacyResult.error.message);
    }
    return normalizeRows(legacyResult.data ?? []);
  }

  // Prefer AGGREGATE rows when etf_name exists; keep all if mixed
  const rows = normalizeRows(data ?? []);
  const aggregates = rows.filter((r) => r.etf_name === 'AGGREGATE');
  return aggregates.length > 0 ? aggregates : rows;
}

async function fetchEtfSnapshotsUncached(
  asset: EtfAssetSymbol,
  period: EtfPeriod,
): Promise<EtfSnapshot[]> {
  if (!isEtfAsset(asset)) return [];

  const fromDate = periodToFromDate(period);

  // Prefer fresh rows; fall back to legacy seed so the UI is never blank during transition
  let rows = await querySnapshots(asset, fromDate, true);
  if (rows.length === 0) {
    rows = await querySnapshots(asset, fromDate, false);
  }

  return rows.map(rowToSnapshot);
}

export async function fetchEtfSnapshots(
  asset: EtfAssetSymbol,
  period: EtfPeriod,
): Promise<EtfSnapshot[]> {
  return unstable_cache(
    () => fetchEtfSnapshotsUncached(asset, period),
    ['etf-snapshots-v2', asset, period],
    {
      revalidate: 3600,
      tags: ['etf-snapshots'],
    },
  )();
}

export type UpsertEtfInput = {
  asset: EtfAssetSymbol;
  snapshot_date: string;
  /** Net flow in USD (full units, e.g. 125_000_000) */
  net_flow_usd: number;
  inflow_usd?: number;
  outflow_usd?: number;
  aum_usd?: number | null;
  etf_name?: string;
  source?: string;
};

export async function upsertEtfSnapshot(input: UpsertEtfInput): Promise<EtfSnapshot> {
  const supabase = createServiceClient();
  const etfName = input.etf_name ?? 'AGGREGATE';

  const payload = {
    asset_symbol: input.asset,
    etf_name: etfName,
    snapshot_date: input.snapshot_date,
    net_flow_usd: input.net_flow_usd,
    inflow_usd: input.inflow_usd ?? (input.net_flow_usd > 0 ? input.net_flow_usd : 0),
    outflow_usd: input.outflow_usd ?? (input.net_flow_usd < 0 ? Math.abs(input.net_flow_usd) : 0),
    aum_usd: input.aum_usd ?? null,
    source: input.source ?? 'manual',
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('etf_snapshots')
    .upsert(payload, { onConflict: 'asset_symbol,etf_name,snapshot_date' })
    .select(SELECT_COLS)
    .single();

  if (!error && data) {
    return rowToSnapshot(data as EtfSnapshotRow);
  }

  // Pre-migration fallback: unique on (asset_symbol, snapshot_date)
  console.warn('[upsertEtfSnapshot] primary upsert failed, trying legacy', error?.message);
  const legacyPayload = {
    asset_symbol: input.asset,
    snapshot_date: input.snapshot_date,
    net_flow_usd: input.net_flow_usd,
    source: input.source ?? 'manual',
  };

  const legacy = await supabase
    .from('etf_snapshots')
    .upsert(legacyPayload, { onConflict: 'asset_symbol,snapshot_date' })
    .select(SELECT_COLS_LEGACY)
    .single();

  if (legacy.error || !legacy.data) {
    console.error('[upsertEtfSnapshot] legacy', legacy.error?.message);
    throw new Error(legacy.error?.message ?? error?.message ?? 'Upsert failed');
  }

  return rowToSnapshot(normalizeRows([legacy.data])[0]);
}
