import { NextResponse } from 'next/server';
import { ANALYSIS_DELIVERY_FROM, ANALYSIS_DELIVERY_DEFAULT } from '@/lib/products/config';
import { paidCheckoutFromEvent, verifyStripeSignature } from '@/lib/products/stripe-event';
import { markInquiryPaid, notifyInquiry } from '@/lib/products/store';

export const dynamic = 'force-dynamic';

/**
 * Stripe tells us a Checkout Session was paid. The success page is not this signal.
 * Payments stay off until PAYMENTS_ENABLED and STRIPE_SECRET_KEY are set; this route
 * still rejects calls until STRIPE_WEBHOOK_SECRET is set.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: 'Webhook neconfigurat.' }, { status: 503 });
  }

  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!verifyStripeSignature(payload, signature, secret)) {
    return NextResponse.json({ error: 'Semnătură invalidă.' }, { status: 400 });
  }

  let event: unknown;
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: 'Corp invalid.' }, { status: 400 });
  }

  const paid = paidCheckoutFromEvent(event);
  if (!paid) {
    return NextResponse.json({ received: true });
  }

  const marked = await markInquiryPaid(paid.inquiryId, paid.sessionId);
  if (!marked.ok) {
    return NextResponse.json({ error: 'Comanda nu a putut fi marcată plătită.' }, { status: 500 });
  }

  if (marked.changed) {
    await notifyInquiry({
      type: 'product_order_paid',
      mode: 'paid',
      inquiryId: paid.inquiryId,
      sessionId: paid.sessionId,
      email: marked.email,
      asset: marked.asset,
      amountRon: marked.amountRon,
      deliverFrom: ANALYSIS_DELIVERY_FROM,
      deliveryLabel: process.env.TA_DELIVERY_LABEL?.trim() || ANALYSIS_DELIVERY_DEFAULT,
      note: 'Pregătire manuală: un coleg redactează analiza, Daniel Mihai o revizuiește, apoi pleacă pe email.',
    });
  }

  return NextResponse.json({ received: true });
}
