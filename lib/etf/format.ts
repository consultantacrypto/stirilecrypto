import type { EtfAssetSymbol, EtfPeriod, EtfSnapshot, EtfSnapshotRow } from '@/lib/etf/types';

const PERIOD_DAYS: Record<Exclude<EtfPeriod, 'ytd'>, number> = {
  '5d': 5,
  '10d': 10,
  '30d': 30,
};

export function isEtfAsset(value: string): value is EtfAssetSymbol {
  return value === 'BTC' || value === 'ETH';
}

export function isEtfPeriod(value: string): value is EtfPeriod {
  return value === '5d' || value === '10d' || value === '30d' || value === 'ytd';
}

export function periodToFromDate(period: EtfPeriod, now = new Date()): string {
  const from = new Date(now);
  if (period === 'ytd') {
    from.setMonth(0, 1);
  } else {
    from.setDate(from.getDate() - PERIOD_DAYS[period]);
  }
  return from.toISOString().slice(0, 10);
}

export function flowsFromDbRow(row: Record<string, unknown>): {
  inflow_usd: number;
  outflow_usd: number;
  aum_usd: number | null;
} {
  const inflow = row.inflow ?? row.inflow_usd;
  const outflow = row.outflow ?? row.outflow_usd;
  const aumRaw = row.aum !== undefined ? row.aum : row.aum_usd;
  const aumMissing = aumRaw == null || aumRaw === '';
  const aum = aumMissing ? null : toFiniteNumber(aumRaw, NaN);
  return {
    inflow_usd: toFiniteNumber(inflow),
    outflow_usd: toFiniteNumber(outflow),
    aum_usd: aum !== null && Number.isFinite(aum) ? aum : null,
  };
}

export function toFiniteNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function millionsToUsd(millions: number): number {
  return millions * 1_000_000;
}

export function billionsToUsd(billions: number): number {
  return billions * 1_000_000_000;
}

export function usdToMillions(usd: number): number {
  return usd / 1_000_000;
}

export function usdToBillions(usd: number): number {
  return usd / 1_000_000_000;
}

export function formatFlowMillions(usd: number, digits = 1): string {
  const m = usdToMillions(usd);
  const sign = m > 0 ? '+' : '';
  return `${sign}${m.toFixed(digits)}M`;
}

export function formatAumBillions(usd: number | null, digits = 1): string {
  if (usd === null || !Number.isFinite(usd)) return 'N/A';
  return `$${usdToBillions(usd).toFixed(digits)}B`;
}

export function rowToSnapshot(row: EtfSnapshotRow): EtfSnapshot {
  const net = toFiniteNumber(row.net_flow_usd);
  const flows = flowsFromDbRow(row as unknown as Record<string, unknown>);
  const aum = flows.aum_usd;
  return {
    id: row.id,
    asset: row.asset_symbol,
    etfName: row.etf_name || 'AGGREGATE',
    snapshot_date: row.snapshot_date,
    net_flow_usd: net,
    net_flow_m: usdToMillions(net),
    inflow_usd: flows.inflow_usd,
    outflow_usd: flows.outflow_usd,
    aum_usd: aum,
    aum_b: aum !== null && Number.isFinite(aum) ? usdToBillions(aum) : null,
    source: row.source,
    updated_at: row.updated_at ?? row.created_at ?? null,
  };
}

export function isStaleDate(isoDate: string | null, maxAgeDays = 3): boolean {
  if (!isoDate) return true;
  const then = new Date(`${isoDate}T12:00:00Z`).getTime();
  if (Number.isNaN(then)) return true;
  return Date.now() - then > maxAgeDays * 24 * 60 * 60 * 1000;
}
