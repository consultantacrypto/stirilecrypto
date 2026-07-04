import { unstable_cache } from 'next/cache';
import { getSupabase } from '@/lib/supabase';
import type {
  EtfAssetSymbol,
  EtfFlowChartPoint,
  EtfSnapshotsByAsset,
} from '@/lib/types/etf-snapshots';

const DAYS_PER_ASSET = 5;
const CACHE_REVALIDATE_SECONDS = 3600;

const EMPTY_RESULT: EtfSnapshotsByAsset = {
  BTC: [],
  ETH: [],
};

function formatChartLabel(isoDate: string): string {
  const parsed = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
}

function rowToChartPoint(row: {
  snapshot_date: string;
  net_flow_usd: number | string;
}): EtfFlowChartPoint {
  const netFlowUsd = Number(row.net_flow_usd);
  return {
    date: row.snapshot_date,
    label: formatChartLabel(row.snapshot_date),
    netFlowUsd: Number.isFinite(netFlowUsd) ? netFlowUsd : 0,
  };
}

function sliceLastFiveChronological(
  rows: { snapshot_date: string; net_flow_usd: number | string }[],
): EtfFlowChartPoint[] {
  const sortedDesc = [...rows].sort((a, b) => b.snapshot_date.localeCompare(a.snapshot_date));
  const lastFive = sortedDesc.slice(0, DAYS_PER_ASSET);
  return lastFive
    .sort((a, b) => a.snapshot_date.localeCompare(b.snapshot_date))
    .map(rowToChartPoint);
}

async function fetchEtfSnapshotsLast5Days(
  assets: EtfAssetSymbol[],
): Promise<EtfSnapshotsByAsset> {
  const supabase = getSupabase();
  if (!supabase) return EMPTY_RESULT;

  const uniqueAssets = [...new Set(assets)] as EtfAssetSymbol[];
  if (uniqueAssets.length === 0) return EMPTY_RESULT;

  const { data, error } = await supabase
    .from('etf_snapshots')
    .select('asset_symbol, snapshot_date, net_flow_usd')
    .in('asset_symbol', uniqueAssets)
    .order('snapshot_date', { ascending: false });

  if (error) {
    console.error('[getEtfSnapshotsLast5Days]', error.message);
    return EMPTY_RESULT;
  }

  const grouped: Record<string, { snapshot_date: string; net_flow_usd: number | string }[]> = {};
  for (const asset of uniqueAssets) {
    grouped[asset] = [];
  }

  for (const row of data ?? []) {
    const symbol = row.asset_symbol as string;
    if (grouped[symbol]) {
      grouped[symbol].push({
        snapshot_date: row.snapshot_date as string,
        net_flow_usd: row.net_flow_usd as number | string,
      });
    }
  }

  return {
    BTC: grouped.BTC ? sliceLastFiveChronological(grouped.BTC) : [],
    ETH: grouped.ETH ? sliceLastFiveChronological(grouped.ETH) : [],
  };
}

/** Last 5 daily ETF net-flow snapshots per asset, cached for hourly revalidation. */
export async function getEtfSnapshotsLast5Days(
  assets: EtfAssetSymbol[] = ['BTC', 'ETH'],
): Promise<EtfSnapshotsByAsset> {
  const cacheKey = assets.slice().sort().join(',');

  return unstable_cache(
    () => fetchEtfSnapshotsLast5Days(assets),
    ['etf-snapshots-last-5', cacheKey],
    {
      revalidate: CACHE_REVALIDATE_SECONDS,
      tags: ['etf-snapshots'],
    },
  )();
}
