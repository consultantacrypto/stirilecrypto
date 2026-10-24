import { NextResponse } from 'next/server';
import { validateAddressWaitlist } from '@/lib/products/address-intake';
import { notifyInquiry, storeInquiry } from '@/lib/products/store';

export const dynamic = 'force-dynamic';

const SAVED = 'Emailul a fost înregistrat. Nu s-a încasat nimic. Te anunțăm când verificarea este deschisă.';
const NOTIFIED = 'Cererea a fost trimisă. Nu s-a încasat nimic. Te anunțăm când verificarea este deschisă.';
const SAVE_FAILED =
  'Nu am putut înregistra emailul. Nu s-a încasat nimic. Scrie-ne la consultantacrypto.ro@gmail.com.';

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > 8_000) {
    return NextResponse.json({ error: 'Cererea este prea mare.' }, { status: 413 });
  }

  let parsed: unknown;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 });
  }

  const validated = validateAddressWaitlist(parsed);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }
  if (validated.honeypot) {
    return NextResponse.json({ ok: true, message: SAVED });
  }

  const entry = validated.value;
  const stored = await storeInquiry({
    product: 'address_check',
    email: entry.email,
    asset: null,
    amountRon: null,
    consent: false,
    payload: {
      product: 'address_check',
      email: entry.email,
      source: entry.source,
      contactConsent: true,
    },
    status: 'waitlist',
  });

  const notified = await notifyInquiry({
    type: 'address_check_waitlist',
    mode: 'waitlist',
    product: 'address_check',
    email: entry.email,
    source: entry.source,
    inquiryId: stored.ok ? stored.id : null,
  });

  if (!stored.ok && !notified) {
    return NextResponse.json({ error: SAVE_FAILED }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    stored: stored.ok,
    message: stored.ok ? SAVED : NOTIFIED,
  });
}
