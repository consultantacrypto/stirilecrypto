import { sanitizeSource } from './placement';

export type Horizon = 'days' | 'weeks' | 'months';
export type DeliveryPreference = 'email' | 'pdf';
export type RiskConcern = 'dump' | 'unlocks' | 'liquidity' | 'scam' | 'team';
export type OrderIntent = 'pay' | 'waitlist';

const CONCERNS: readonly RiskConcern[] = ['dump', 'unlocks', 'liquidity', 'scam', 'team'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ASSET_REGEX = /^[A-Za-z0-9]{2,12}$/;

export interface OptionalRisk {
  coin: string | null;
  network: string | null;
  contractAddress: string | null;
  nativeAsset: boolean;
  why: string | null;
  holds: boolean | null;
  entryPrice: string | null;
  horizon: Horizon | null;
  concerns: RiskConcern[];
  questions: string | null;
  delivery: DeliveryPreference | null;
}

export interface NormalizedOrder {
  intent: OrderIntent;
  product: 'ta_mtf';
  bundle: false;
  email: string;
  consent: true;
  asset: string | null;
  question: string | null;
  risk: OptionalRisk | null;
  source: string | null;
}

function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max);
}

function asRecord(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  return input as Record<string, unknown>;
}

function optionalRisk(body: Record<string, unknown>): OptionalRisk | null {
  const coin = clean(body.coin, 80);
  const network = clean(body.network, 40);
  const contractAddress = clean(body.contractAddress, 128);
  const why = clean(body.why, 2000);
  const questions = clean(body.questions, 2000);
  const entryPrice = clean(body.entryPrice, 40);
  const horizon = body.horizon === 'days' || body.horizon === 'weeks' || body.horizon === 'months' ? body.horizon : null;
  const delivery = body.delivery === 'email' || body.delivery === 'pdf' ? body.delivery : null;
  const holds = typeof body.holds === 'boolean' ? body.holds : null;
  const nativeAsset = body.nativeAsset === true;
  const rawConcerns = Array.isArray(body.concerns) ? body.concerns : [];
  const concerns = [...new Set(rawConcerns.filter((item): item is RiskConcern => CONCERNS.includes(item as RiskConcern)))];

  const filled = Boolean(
    coin ||
      network ||
      contractAddress ||
      why ||
      questions ||
      entryPrice ||
      horizon ||
      holds !== null ||
      nativeAsset ||
      concerns.length > 0,
  );

  if (!filled) return null;

  return {
    coin: coin || null,
    network: network || null,
    contractAddress: nativeAsset ? null : contractAddress || null,
    nativeAsset,
    why: why || null,
    holds,
    entryPrice: holds && entryPrice ? entryPrice : null,
    horizon,
    concerns,
    questions: questions || null,
    delivery,
  };
}

export function validateOrder(input: unknown): { ok: true; value: NormalizedOrder } | { ok: false; error: string } {
  const body = asRecord(input);
  if (!body) return { ok: false, error: 'Cerere invalidă.' };

  if (clean(body.company, 80)) {
    return {
      ok: true,
      value: {
        intent: 'waitlist',
        product: 'ta_mtf',
        bundle: false,
        email: 'bot@example.com',
        consent: true,
        asset: 'BOT',
        question: null,
        risk: null,
        source: null,
      },
    };
  }

  const intent: OrderIntent = body.intent === 'pay' ? 'pay' : 'waitlist';
  if (body.product !== 'ta_mtf' && body.product !== 'risk_report') {
    return { ok: false, error: 'Alege un produs.' };
  }

  const email = clean(body.email, 160).toLowerCase();
  if (!EMAIL_REGEX.test(email)) return { ok: false, error: 'Introdu o adresă de email validă.' };
  if (body.consent !== true) {
    return {
      ok: false,
      error:
        'Bifează acordul pentru livrarea imediată a conținutului digital și pierderea dreptului de retragere.',
    };
  }

  const asset = (clean(body.asset, 12) || clean(body.ticker, 12)).toUpperCase();
  if (!ASSET_REGEX.test(asset)) {
    return { ok: false, error: 'Simbolul activului trebuie să aibă 2–12 litere sau cifre.' };
  }
  const rawQuestion = clean(body.question, 1000);

  return {
    ok: true,
    value: {
      intent,
      product: 'ta_mtf',
      bundle: false,
      email,
      consent: true,
      asset,
      question: rawQuestion || null,
      risk: optionalRisk(body),
      source: sanitizeSource(typeof body.source === 'string' ? body.source : null),
    },
  };
}

export function isHoneypot(order: NormalizedOrder): boolean {
  return order.email === 'bot@example.com' && order.asset === 'BOT';
}
