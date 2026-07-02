export type PulseTrend = 'bullish' | 'bearish' | 'neutral' | 'range';
export type DashboardPublishStatus = 'draft' | 'published';
export type MicaEntityType = 'exchange' | 'stablecoin';
export type MicaComplianceStatus = 'safe' | 'risky' | 'banned' | 'transitional';

export interface PulseTerminalLevel {
  price: number;
  label?: string;
}

export interface PulseTerminalSnapshot {
  id: string;
  asset_symbol: string;
  asset_label: string;
  trend: PulseTrend;
  support_levels: PulseTerminalLevel[];
  resistance_levels: PulseTerminalLevel[];
  summary: string | null;
  linked_article_slug: string | null;
  affiliate_partner: string;
  affiliate_url: string;
  status: DashboardPublishStatus;
  published_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MicaComplianceItem {
  id: string;
  name: string;
  slug: string;
  entity_type: MicaEntityType;
  compliance_status: MicaComplianceStatus;
  jurisdiction: string | null;
  notes: string | null;
  source_url: string | null;
  sort_order: number;
  status: DashboardPublishStatus;
  updated_at?: string;
  created_at?: string;
}
