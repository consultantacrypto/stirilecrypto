import { paymentsEnabled } from '@/lib/flags';

const MAX_PRICE_RON = 100_000;

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

export type ProductId = 'ta_mtf' | 'risk_report' | 'bundle';

export interface ProductOffer {
  id: Exclude<ProductId, 'bundle'>;
  name: string;
  priceRon: number;
  /** False means the figure is a placeholder and must not be charged. */
  priceConfirmed: boolean;
  deliveryLabel: string;
}

export interface ProductCatalog {
  ta: ProductOffer;
  risk: ProductOffer;
  /** Sum, or BUNDLE_PRICE_RON when that env var is a valid price. */
  bundlePriceRon: number;
  bundlePriceConfirmed: boolean;
  paymentsEnabled: boolean;
  chargeTa: boolean;
  chargeRisk: boolean;
}

export function productCatalog(): ProductCatalog {
  const taPrice = readPrice('TA_PRICE_RON', 49);
  const riskPrice = readPrice('RISK_REPORT_PRICE_RON', 149);
  const riskConfirmed = process.env.RISK_REPORT_PRICE_CONFIRMED?.trim().toLowerCase() === 'true';
  const bundleOverride = process.env.BUNDLE_PRICE_RON?.trim();
  const bundlePriceRon = bundleOverride ? readPrice('BUNDLE_PRICE_RON', taPrice + riskPrice) : taPrice + riskPrice;
  const payments = paymentsEnabled();

  return {
    ta: {
      id: 'ta_mtf',
      name: 'Analiză tehnică multi-timeframe',
      priceRon: taPrice,
      priceConfirmed: true,
      deliveryLabel: readLabel('TA_DELIVERY_LABEL', '24–48 de ore lucrătoare'),
    },
    risk: {
      id: 'risk_report',
      name: 'Raport de risc pentru o monedă crypto',
      priceRon: riskPrice,
      priceConfirmed: riskConfirmed,
      deliveryLabel: readLabel('RISK_DELIVERY_LABEL', '2–4 zile lucrătoare'),
    },
    bundlePriceRon,
    bundlePriceConfirmed: riskConfirmed,
    paymentsEnabled: payments,
    chargeTa: payments,
    chargeRisk: payments && riskConfirmed,
  };
}

export function orderAmount(
  catalog: ProductCatalog,
  product: 'ta_mtf' | 'risk_report',
  bundle: boolean,
): { productId: ProductId; amountRon: number; chargeable: boolean; name: string } {
  if (bundle) {
    return {
      productId: 'bundle',
      amountRon: catalog.bundlePriceRon,
      chargeable: catalog.chargeTa && catalog.chargeRisk && catalog.bundlePriceConfirmed,
      name: `${catalog.ta.name} + ${catalog.risk.name}`,
    };
  }
  if (product === 'ta_mtf') {
    return {
      productId: 'ta_mtf',
      amountRon: catalog.ta.priceRon,
      chargeable: catalog.chargeTa,
      name: catalog.ta.name,
    };
  }
  return {
    productId: 'risk_report',
    amountRon: catalog.risk.priceRon,
    chargeable: catalog.chargeRisk,
    name: catalog.risk.name,
  };
}
