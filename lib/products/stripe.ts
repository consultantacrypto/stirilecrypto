import { ALTCOIN_PRICE_BANI, MAJOR_PRICE_BANI, type AnalysisTier } from './tiers';

export interface CheckoutInput {
  name: string;
  description: string;
  amountBani: number;
  email: string;
  origin: string;
  inquiryId: string;
  product: string;
  tier: AnalysisTier;
  source?: string | null;
}

/** The only amounts Checkout may charge. A client-posted price never reaches this. */
export function checkoutSessionBody(input: CheckoutInput): URLSearchParams | null {
  if (input.amountBani !== MAJOR_PRICE_BANI && input.amountBani !== ALTCOIN_PRICE_BANI) return null;

  const body = new URLSearchParams();
  body.set('mode', 'payment');
  body.set('customer_email', input.email);
  body.set('success_url', `${input.origin}/comenzi/succes?session_id={CHECKOUT_SESSION_ID}`);
  body.set('cancel_url', `${input.origin}/comenzi/anulare`);
  body.set('line_items[0][quantity]', '1');
  body.set('line_items[0][price_data][currency]', 'ron');
  body.set('line_items[0][price_data][unit_amount]', String(input.amountBani));
  body.set('line_items[0][price_data][product_data][name]', input.name.slice(0, 250));
  body.set('line_items[0][price_data][product_data][description]', input.description.slice(0, 500));
  body.set('metadata[inquiry_id]', input.inquiryId);
  body.set('metadata[product]', input.product);
  body.set('metadata[tier]', input.tier);
  if (input.source) body.set('metadata[src]', input.source.slice(0, 32));
  body.set('payment_intent_data[metadata][inquiry_id]', input.inquiryId);
  body.set('payment_intent_data[metadata][tier]', input.tier);
  return body;
}

export async function createStripeCheckout(
  input: CheckoutInput,
): Promise<{ ok: true; id: string; url: string } | { ok: false; error: string }> {
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) return { ok: false, error: 'Plățile nu sunt configurate.' };

  const body = checkoutSessionBody(input);
  if (!body) return { ok: false, error: 'Tariful comenzii nu este valid. Nu s-a încasat nimic.' };

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
      signal: AbortSignal.timeout(10000),
    });
    const json = (await response.json()) as { id?: string; url?: string; error?: { message?: string } };
    if (!response.ok || !json.url || !json.id) {
      console.error('[stripe]', json.error?.message ?? response.status);
      return { ok: false, error: 'Nu am putut deschide pagina de plată. Nu s-a încasat nimic.' };
    }
    return { ok: true, id: json.id, url: json.url };
  } catch (err) {
    console.error('[stripe]', err instanceof Error ? err.message : 'unknown');
    return { ok: false, error: 'Nu am putut deschide pagina de plată. Nu s-a încasat nimic.' };
  }
}
