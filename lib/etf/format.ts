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
  const aum = row.aum_usd == null ? null : toFiniteNumber(row.aum_usd, NaN);
  return {
    id: row.id,
    asset: row.asset_symbol,
    etfName: row.etf_name || 'AGGREGATE',
    snapshot_date: row.snapshot_date,
    net_flow_usd: net,
    net_flow_m: usdToMillions(net),
    inflow_usd: toFiniteNumber(row.inflow_usd),
    outflow_usd: toFiniteNumber(row.outflow_usd),
    aum_usd: aum !== null && Number.isFinite(aum) ? aum : null,
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
