import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TICKER_REGEX = /^[A-Za-z0-9]{2,12}$/;

type PaymentProvider = 'stripe' | 'binance_pay';

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (!email || !EMAIL_REGEX.test(email)) return null;
  return email;
}

function normalizeTicker(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const ticker = value.trim().toUpperCase();
  if (!TICKER_REGEX.test(ticker)) return null;
  return ticker;
}

function normalizeProvider(value: unknown): PaymentProvider | null {
  if (value === 'stripe' || value === 'binance_pay') return value;
  return null;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const email = normalizeEmail(payload.email);
  const ticker = normalizeTicker(payload.ticker);
  const paymentProvider = normalizeProvider(payload.payment_provider);

  if (!email) {
    return NextResponse.json({ error: 'Introdu o adresă de email validă.' }, { status: 400 });
  }

  if (!ticker) {
    return NextResponse.json(
      { error: 'Ticker invalid. Folosește 2–12 caractere alfanumerice.' },
      { status: 400 },
    );
  }

  if (!paymentProvider) {
    return NextResponse.json({ error: 'Selectează o metodă de plată.' }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from('premium_orders')
      .insert({
        email,
        ticker,
        amount_ron: 100,
        payment_provider: paymentProvider,
        payment_status: 'pending',
        delivery_status: 'queued',
      })
      .select('id')
      .single();

    if (error) {
      console.error('[premium/checkout]', error.message);
      return NextResponse.json(
        { error: 'Nu am putut înregistra comanda. Încearcă din nou.' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      orderId: data.id,
      message:
        paymentProvider === 'stripe'
          ? 'Comanda a fost înregistrată. Integrarea Stripe Checkout urmează în curând.'
          : 'Comanda a fost înregistrată. Integrarea Binance Pay urmează în curând.',
      paymentProvider,
    });
  } catch (err) {
    console.error('[premium/checkout]', err);
    return NextResponse.json(
      { error: 'Serviciul de plată nu este disponibil momentan.' },
      { status: 503 },
    );
  }
}
