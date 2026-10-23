import { createHmac, timingSafeEqual } from 'node:crypto';

const TOLERANCE_SECONDS = 300;

export interface PaidCheckout {
  inquiryId: string;
  sessionId: string;
  paymentStatus: string;
  email: string | null;
}

function signatures(header: string): { timestamp: string; v1: string[] } | null {
  let timestamp = '';
  const v1: string[] = [];
  for (const part of header.split(',')) {
    const [key, value] = part.split('=', 2);
    if (!key || !value) continue;
    if (key === 't') timestamp = value;
    if (key === 'v1') v1.push(value);
  }
  if (!timestamp || v1.length === 0) return null;
  return { timestamp, v1 };
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Stripe webhook signature, without the Stripe SDK. */
export function verifyStripeSignature(
  payload: string,
  header: string | null,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  if (!header || !secret) return false;
  const parsed = signatures(header);
  if (!parsed) return false;
  const timestamp = Number(parsed.timestamp);
  if (!Number.isFinite(timestamp) || Math.abs(nowSeconds - timestamp) > TOLERANCE_SECONDS) return false;

  const expected = createHmac('sha256', secret).update(`${parsed.timestamp}.${payload}`).digest('hex');
  return parsed.v1.some((candidate) => safeEqual(candidate, expected));
}

export function paidCheckoutFromEvent(event: unknown): PaidCheckout | null {
  if (!event || typeof event !== 'object') return null;
  const record = event as { type?: unknown; data?: { object?: unknown } };
  if (record.type !== 'checkout.session.completed' && record.type !== 'checkout.session.async_payment_succeeded') {
    return null;
  }
  const session = record.data?.object;
  if (!session || typeof session !== 'object') return null;
  const row = session as {
    id?: unknown;
    payment_status?: unknown;
    metadata?: { inquiry_id?: unknown };
    customer_details?: { email?: unknown };
    customer_email?: unknown;
  };
  if (row.payment_status !== 'paid') return null;
  if (typeof row.id !== 'string' || !row.id.startsWith('cs_')) return null;
  const inquiryId = row.metadata?.inquiry_id;
  if (typeof inquiryId !== 'string' || inquiryId.length < 8) return null;
  const email =
    typeof row.customer_details?.email === 'string'
      ? row.customer_details.email
      : typeof row.customer_email === 'string'
        ? row.customer_email
        : null;
  return { inquiryId, sessionId: row.id, paymentStatus: 'paid', email };
}
