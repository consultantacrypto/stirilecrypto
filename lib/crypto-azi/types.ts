export type CryptoBriefStatus = 'draft' | 'published' | 'archived';

export type CryptoTakeaway = {
  title: string;
  why_it_matters: string;
  source_label: string;
  source_url: string;
};

export type CryptoDailyBrief = {
  id: string;
  brief_date: string;
  status: CryptoBriefStatus;
  title: string;
  introduction: string;
  takeaways: CryptoTakeaway[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_id: string | null;
  author_name: string | null;
};

export type CryptoDailyBriefInsert = {
  brief_date: string;
  status: CryptoBriefStatus;
  title: string;
  introduction: string;
  takeaways: CryptoTakeaway[];
  published_at?: string | null;
  author_id?: string | null;
  author_name?: string | null;
};

export type CryptoDailyBriefUpdate = Partial<CryptoDailyBriefInsert>;

export type MarketIndicatorStatus = 'live' | 'stale' | 'unavailable';

export type MarketIndicator = {
  id: 'btc_price' | 'market_cap' | 'btc_dominance' | 'fear_greed';
  label: string;
  status: MarketIndicatorStatus;
  displayValue: string | null;
  detail: string | null;
  asOf: string | null;
};
