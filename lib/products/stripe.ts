interface CheckoutInput {
  name: string;
  amountRon: number;
  email: string;
  origin: string;
  inquiryId: string;
  product: string;
}

export async function createStripeCheckout(
  input: CheckoutInput,
): Promise<{ ok: true; id: string; url: string } | { ok: false; error: string }> {
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) return { ok: false, error: 'Plățile nu sunt configurate.' };

  const body = new URLSearchParams();
  body.set('mode', 'payment');
  body.set('customer_email', input.email);
  body.set('success_url', `${input.origin}/comenzi/succes?session_id={CHECKOUT_SESSION_ID}`);
  body.set('cancel_url', `${input.origin}/comenzi/anulare`);
  body.set('line_items[0][quantity]', '1');
  body.set('line_items[0][price_data][currency]', 'ron');
  body.set('line_items[0][price_data][unit_amount]', String(input.amountRon * 100));
  body.set('line_items[0][price_data][product_data][name]', input.name.slice(0, 250));
  body.set('metadata[inquiry_id]', input.inquiryId);
  body.set('metadata[product]', input.product);
  body.set('payment_intent_data[metadata][inquiry_id]', input.inquiryId);

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
