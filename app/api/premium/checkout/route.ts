import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/json-ld';
import { productCatalog } from '@/lib/products/config';
import { isHoneypot, validateOrder } from '@/lib/products/intake';
import { createStripeCheckout } from '@/lib/products/stripe';
import { attachStripeSession, cancelInquiry, notifyInquiry, storeInquiry } from '@/lib/products/store';
import { analysisCheckoutCopy, resolveAnalysisTier } from '@/lib/products/tiers';

export const dynamic = 'force-dynamic';

const WAITLIST_SAVED =
  'Cererea a fost înregistrată pe lista de așteptare. Nu s-a încasat nimic. Te contactăm când comanda poate fi onorată.';
const WAITLIST_NOTIFIED =
  'Cererea a fost trimisă echipei. Nu s-a încasat nimic. Te contactăm când comanda poate fi onorată.';
const SAVE_FAILED =
  'Nu am putut înregistra cererea. Nu s-a încasat nimic. Scrie-ne la contact@stirilecrypto.ro și include simbolul activului.';

function originFrom(request: Request): string {
  const origin = request.headers.get('origin')?.trim();
  if (origin && /^https?:\/\//.test(origin)) return origin.replace(/\/$/, '');
  return SITE_URL;
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > 20_000) {
    return NextResponse.json({ error: 'Cererea este prea mare.' }, { status: 413 });
  }

  let parsed: unknown;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 });
  }

  const validated = validateOrder(parsed);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const order = validated.value;
  if (isHoneypot(order)) {
    return NextResponse.json({ ok: true, mode: 'waitlist', message: WAITLIST_SAVED });
  }

  const catalog = productCatalog();
  const priced = resolveAnalysisTier(order.asset, order.requestedTier);
  const copy = analysisCheckoutCopy(priced.tier);
  const payload = {
    ...order,
    tier: priced.tier,
    amountRon: priced.amountRon,
    amountBani: priced.amountBani,
    forcedAltcoin: priced.forcedAltcoin,
  };

  if (order.intent === 'pay') {
    if (!catalog.chargeable) {
      return NextResponse.json(
        {
          error:
            'Plata nu a putut fi deschisă. Încearcă din nou sau scrie la contact@stirilecrypto.ro.',
        },
        { status: 409 },
      );
    }

    const stored = await storeInquiry({
      product: 'ta_mtf',
      email: order.email,
      asset: order.asset,
      amountRon: priced.amountRon,
      consent: true,
      payload,
      status: 'pending_payment',
    });

    if (!stored.ok) {
      return NextResponse.json({ error: SAVE_FAILED }, { status: 503 });
    }

    const session = await createStripeCheckout({
      name: copy.name,
      description: copy.description,
      amountBani: priced.amountBani,
      email: order.email,
      origin: originFrom(request),
      inquiryId: stored.id,
      product: 'ta_mtf',
      tier: priced.tier,
      source: order.source,
    });

    if (!session.ok) {
      await cancelInquiry(stored.id);
      return NextResponse.json({ error: session.error }, { status: 502 });
    }

    await attachStripeSession(stored.id, session.id);
    return NextResponse.json({ ok: true, mode: 'checkout', url: session.url });
  }

  const stored = await storeInquiry({
    product: 'ta_mtf',
    email: order.email,
    asset: order.asset,
    amountRon: priced.amountRon,
    consent: true,
    payload,
    status: 'waitlist',
  });

  const notified = await notifyInquiry({
    type: 'product_inquiry',
    mode: 'waitlist',
    product: 'ta_mtf',
    email: order.email,
    asset: order.asset,
    tier: priced.tier,
    amountRon: priced.amountRon,
    amountBani: priced.amountBani,
    inquiryId: stored.ok ? stored.id : null,
    order: payload,
  });

  if (!stored.ok && !notified) {
    return NextResponse.json({ error: SAVE_FAILED }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    mode: 'waitlist',
    stored: stored.ok,
    message: stored.ok ? WAITLIST_SAVED : WAITLIST_NOTIFIED,
  });
}
