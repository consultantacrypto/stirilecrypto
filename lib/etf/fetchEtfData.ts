import { unstable_cache } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/service';
import { getSupabase } from '@/lib/supabase';
import {
  flowsFromDbRow,
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
  'id, asset_symbol, etf_name, snapshot_date, net_flow_usd, inflow, outflow, aum, source, created_at, updated_at';

const SELECT_COLS_LEGACY = 'id, asset_symbol, snapshot_date, net_flow_usd, source, created_at';

function normalizeRows(data: unknown[]): EtfSnapshotRow[] {
  return data.map((raw) => {
    const row = raw as Record<string, unknown>;
    const flows = flowsFromDbRow(row);
    return {
      id: String(row.id),
      asset_symbol: row.asset_symbol as EtfAssetSymbol,
      etf_name: typeof row.etf_name === 'string' ? row.etf_name : 'AGGREGATE',
      snapshot_date: String(row.snapshot_date),
      net_flow_usd: Number(row.net_flow_usd),
      inflow_usd: flows.inflow_usd,
      outflow_usd: flows.outflow_usd,
      aum_usd: flows.aum_usd,
      source: String(row.source ?? 'manual'),
      created_at: row.created_at ? String(row.created_at) : undefined,
      updated_at: row.updated_at ? String(row.updated_at) : undefined,
    };
  });
}

async function querySnapshots(asset: EtfAssetSymbol, fromDate: string): Promise<EtfSnapshotRow[]> {
  let client;
  try {
    client = createServiceClient();
  } catch {
    client = getSupabase();
  }
  if (!client) return [];

  const query = client
    .from('etf_snapshots')
    .select(SELECT_COLS)
    .eq('asset_symbol', asset)
    .gte('snapshot_date', fromDate)
    .neq('source', 'legacy_seed')
    .order('snapshot_date', { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.warn('[fetchEtfSnapshots] primary query failed, trying legacy select', error.message);
    const legacy = await client
      .from('etf_snapshots')
      .select(SELECT_COLS_LEGACY)
      .eq('asset_symbol', asset)
      .gte('snapshot_date', fromDate)
      .neq('source', 'legacy_seed')
      .order('snapshot_date', { ascending: true });

    if (legacy.error) {
      console.error('[fetchEtfSnapshots] legacy', legacy.error.message);
      throw new Error(legacy.error.message);
    }
    return normalizeRows(legacy.data ?? []);
  }

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
  const rows = await querySnapshots(asset, fromDate);
  return rows.map(rowToSnapshot);
}

export async function fetchEtfSnapshots(
  asset: EtfAssetSymbol,
  period: EtfPeriod,
): Promise<EtfSnapshot[]> {
  return unstable_cache(
    () => fetchEtfSnapshotsUncached(asset, period),
    ['etf-snapshots-v3', asset, period],
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
    inflow: input.inflow_usd ?? (input.net_flow_usd > 0 ? input.net_flow_usd : 0),
    outflow: input.outflow_usd ?? (input.net_flow_usd < 0 ? Math.abs(input.net_flow_usd) : 0),
    aum: input.aum_usd ?? null,
    source: input.source ?? 'manual',
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('etf_snapshots')
    .upsert(payload, { onConflict: 'asset_symbol,snapshot_date' })
    .select(SELECT_COLS)
    .single();

  if (!error && data) {
    return rowToSnapshot(normalizeRows([data])[0]);
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
