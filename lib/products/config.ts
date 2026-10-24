import { paymentsEnabled } from '@/lib/flags';
import { ALTCOIN_PRICE_RON, MAJOR_PRICE_RON } from './tiers';

export const ANALYSIS_DELIVERY_FROM = 'contact@stirilecrypto.ro';
export const ANALYSIS_DELIVERY_DEFAULT = '24 de ore în zilele lucrătoare';

function readLabel(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value || fallback;
}

/** ta_mtf is the paid analysis. The tier (major | altcoin) lives on the inquiry payload. */
export type ProductId = 'ta_mtf' | 'risk_report' | 'bundle' | 'address_check';

export interface ProductOffer {
  id: 'ta_mtf';
  name: string;
  majorPriceRon: number;
  altcoinPriceRon: number;
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
      majorPriceRon: MAJOR_PRICE_RON,
      altcoinPriceRon: ALTCOIN_PRICE_RON,
      priceConfirmed: true,
      deliveryLabel: readLabel('TA_DELIVERY_LABEL', ANALYSIS_DELIVERY_DEFAULT),
    },
    paymentsEnabled: payments,
    chargeable: payments,
  };
}
