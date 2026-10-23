export type Horizon = 'days' | 'weeks' | 'months';
export type DeliveryPreference = 'email' | 'pdf';
export type RiskConcern = 'dump' | 'unlocks' | 'liquidity' | 'scam' | 'team';
export type OrderIntent = 'pay' | 'waitlist';

const CONCERNS: readonly RiskConcern[] = ['dump', 'unlocks', 'liquidity', 'scam', 'team'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ASSET_REGEX = /^[A-Za-z0-9]{2,12}$/;

export interface NormalizedOrder {
  intent: OrderIntent;
  product: 'ta_mtf' | 'risk_report';
  bundle: boolean;
  email: string;
  consent: true;
  asset: string | null;
  question: string | null;
  risk: null | {
    coin: string;
    ticker: string;
    network: string;
    contractAddress: string | null;
    nativeAsset: boolean;
    why: string;
    holds: boolean;
    entryPrice: string | null;
    horizon: Horizon;
    concerns: RiskConcern[];
    questions: string | null;
    delivery: DeliveryPreference;
  };
}

function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max);
}

function asRecord(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  return input as Record<string, unknown>;
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
      },
    };
  }

  const intent: OrderIntent = body.intent === 'pay' ? 'pay' : 'waitlist';
  const product = body.product === 'risk_report' ? 'risk_report' : body.product === 'ta_mtf' ? 'ta_mtf' : null;
  if (!product) return { ok: false, error: 'Alege un produs.' };

  const bundle = body.bundle === true;
  const email = clean(body.email, 160).toLowerCase();
  if (!EMAIL_REGEX.test(email)) return { ok: false, error: 'Introdu o adresă de email validă.' };
  if (body.consent !== true) {
    return {
      ok: false,
      error:
        'Bifează acordul pentru livrarea imediată a conținutului digital și pierderea dreptului de retragere.',
    };
  }

  const needsTa = product === 'ta_mtf' || bundle;
  const needsRisk = product === 'risk_report' || bundle;

  let asset: string | null = null;
  let question: string | null = null;
  if (needsTa) {
    const tickerFallback = needsRisk ? clean(body.ticker, 12) : '';
    asset = (clean(body.asset, 12) || tickerFallback).toUpperCase();
    if (!ASSET_REGEX.test(asset)) {
      return { ok: false, error: 'Simbolul activului trebuie să aibă 2–12 litere sau cifre.' };
    }
    const rawQuestion = clean(body.question, 1000);
    question = rawQuestion || null;
  }

  let risk: NormalizedOrder['risk'] = null;
  if (needsRisk) {
    const coin = clean(body.coin, 80);
    const ticker = clean(body.ticker, 12).toUpperCase();
    const network = clean(body.network, 40);
    const nativeAsset = body.nativeAsset === true;
    const contractAddress = clean(body.contractAddress, 128);
    const why = clean(body.why, 2000);
    const entryPrice = clean(body.entryPrice, 40);
    const questions = clean(body.questions, 2000);
    const horizon = body.horizon;
    const delivery = body.delivery;

    if (coin.length < 2) return { ok: false, error: 'Introdu numele monedei.' };
    if (!ASSET_REGEX.test(ticker)) {
      return { ok: false, error: 'Ticker-ul trebuie să aibă 2–12 litere sau cifre.' };
    }
    if (network.length < 2) return { ok: false, error: 'Introdu rețeaua (de exemplu Ethereum, Solana, Bitcoin).' };
    if (!nativeAsset && contractAddress.length < 8) {
      return {
        ok: false,
        error: 'Adaugă adresa contractului sau marchează activul ca nativ, fără contract.',
      };
    }
    if (why.length < 20) {
      return { ok: false, error: 'Spune pe scurt de ce te interesează moneda (cel puțin 20 de caractere).' };
    }
    if (typeof body.holds !== 'boolean') {
      return { ok: false, error: 'Spune dacă deții deja moneda.' };
    }
    if (horizon !== 'days' && horizon !== 'weeks' && horizon !== 'months') {
      return { ok: false, error: 'Alege orizontul de timp: zile, săptămâni sau luni.' };
    }
    if (delivery !== 'email' && delivery !== 'pdf') {
      return { ok: false, error: 'Alege livrarea pe email sau PDF.' };
    }

    const rawConcerns = Array.isArray(body.concerns) ? body.concerns : [];
    const concerns = [...new Set(rawConcerns.filter((item): item is RiskConcern => CONCERNS.includes(item as RiskConcern)))];
    if (concerns.length === 0) {
      return { ok: false, error: 'Alege cel puțin o îngrijorare (dump, deblocări, lichiditate, scam, echipă).' };
    }

    risk = {
      coin,
      ticker,
      network,
      contractAddress: nativeAsset ? null : contractAddress,
      nativeAsset,
      why,
      holds: body.holds,
      entryPrice: body.holds && entryPrice ? entryPrice : null,
      horizon,
      concerns,
      questions: questions || null,
      delivery,
    };
  }

  return {
    ok: true,
    value: {
      intent,
      product,
      bundle,
      email,
      consent: true,
      asset,
      question,
      risk,
    },
  };
}

export function isHoneypot(order: NormalizedOrder): boolean {
  return order.email === 'bot@example.com' && order.asset === 'BOT';
}
