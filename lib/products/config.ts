import { paymentsEnabled } from '@/lib/flags';

const MAX_PRICE_RON = 100_000;

export const ANALYSIS_DELIVERY_FROM = 'contact@stirilecrypto.ro';
export const ANALYSIS_DELIVERY_DEFAULT = '24 de ore în zilele lucrătoare';

function readPrice(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0 || value > MAX_PRICE_RON) return fallback;
  return Math.round(value);
}

function readLabel(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value || fallback;
}

/** Values already allowed by product_inquiries. New orders use ta_mtf only. */
export type ProductId = 'ta_mtf' | 'risk_report' | 'bundle';

export interface ProductOffer {
  id: 'ta_mtf';
  name: string;
  priceRon: number;
  priceConfirmed: true;
  deliveryLabel: string;
}

export interface ProductCatalog {
  ta: ProductOffer;
  paymentsEnabled: boolean;
  chargeable: boolean;
}

export function productCatalog(): ProductCatalog {
  const payments = paymentsEnabled();
  return {
    ta: {
      id: 'ta_mtf',
      name: 'Analiză tehnică multi-timeframe',
      priceRon: readPrice('TA_PRICE_RON', 49),
      priceConfirmed: true,
      deliveryLabel: readLabel('TA_DELIVERY_LABEL', ANALYSIS_DELIVERY_DEFAULT),
    },
    paymentsEnabled: payments,
    chargeable: payments,
  };
}

export function orderQuote(catalog: ProductCatalog): {
  productId: 'ta_mtf';
  amountRon: number;
  chargeable: boolean;
  name: string;
} {
  return {
    productId: 'ta_mtf',
    amountRon: catalog.ta.priceRon,
    chargeable: catalog.chargeable,
    name: 'Analiză tehnică multi-timeframe, cu secțiunea Risc token',
  };
}
