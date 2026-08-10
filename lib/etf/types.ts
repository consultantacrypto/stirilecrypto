export type EtfAssetSymbol = 'BTC' | 'ETH';

export type EtfPeriod = '5d' | '10d' | '30d' | 'ytd';

export type EtfDataSource = 'manual' | 'legacy_seed' | 'auto' | 'cron';

/** Raw DB row (Supabase `etf_snapshots`). */
export interface EtfSnapshotRow {
  id: string;
  asset_symbol: EtfAssetSymbol;
  etf_name: string;
  snapshot_date: string;
  net_flow_usd: number;
  inflow_usd: number;
  outflow_usd: number;
  aum_usd: number | null;
  source: string;
  created_at?: string;
  updated_at?: string;
}

/** API / UI snapshot (normalized). Flows are full USD. */
export interface EtfSnapshot {
  id: string;
  asset: EtfAssetSymbol;
  etfName: string;
  snapshot_date: string;
  net_flow_usd: number;
  /** Convenience: net flow in millions USD */
  net_flow_m: number;
  inflow_usd: number;
  outflow_usd: number;
  aum_usd: number | null;
  /** Convenience: AUM in billions USD when present */
  aum_b: number | null;
  source: string;
  updated_at: string | null;
}

export interface EtfApiSuccess {
  success: true;
  data: EtfSnapshot[];
  lastUpdated: string | null;
  period: EtfPeriod;
  asset: EtfAssetSymbol;
}

export interface EtfApiError {
  success: false;
  error: string;
}

/** @deprecated chart point used by legacy EtfFlowsChart — keep for compatibility */
export interface EtfFlowChartPoint {
  date: string;
  label: string;
  netFlowUsd: number;
}

/** @deprecated */
export type EtfSnapshotsByAsset = Record<EtfAssetSymbol, EtfFlowChartPoint[]>;
