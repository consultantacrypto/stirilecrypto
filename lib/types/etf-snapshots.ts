export type EtfAssetSymbol = 'BTC' | 'ETH';

export interface EtfSnapshotRow {
  id: string;
  asset_symbol: EtfAssetSymbol;
  snapshot_date: string;
  net_flow_usd: number;
  source: string;
  created_at?: string;
}

export interface EtfFlowChartPoint {
  date: string;
  label: string;
  netFlowUsd: number;
}

export type EtfSnapshotsByAsset = Record<EtfAssetSymbol, EtfFlowChartPoint[]>;
