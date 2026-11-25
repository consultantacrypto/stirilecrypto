import { NextResponse } from 'next/server';
import { normalizeEmail } from '@/lib/newsletter/email';
import { NEWSLETTER_SIGNUP_DUPLICATE, NEWSLETTER_SIGNUP_SUCCESS } from '@/lib/newsletter';
import { registerSubscriber } from '@/lib/newsletter/signup';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 });
  }

  const email =
    body && typeof body === 'object' && 'email' in body
      ? normalizeEmail((body as { email: unknown }).email)
      : null;

  if (!email) {
    return NextResponse.json(
      { error: 'Introdu o adresă de email validă.' },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();
    const outcome = await registerSubscriber(email, {
      async insert(value) {
        const { error } = await supabase.from('abonati').insert({ email: value });
        if (!error) return { errorCode: null };
        return { errorCode: error.code || 'unknown' };
      },
      async findByEmail(value) {
        try {
          const service = createServiceClient();
          const { data, error } = await service
            .from('abonati')
            .select('unsubscribed_at')
            .eq('email', value)
            .maybeSingle();
          if (error || !data) return { ok: false };
          const unsubscribedAt = (data as { unsubscribed_at?: unknown }).unsubscribed_at;
          return {
            ok: true,
            unsubscribedAt: typeof unsubscribedAt === 'string' ? unsubscribedAt : null,
          };
        } catch {
          return { ok: false };
        }
      },
      async clearUnsubscribed(value) {
        try {
          const service = createServiceClient();
          const { error } = await service
            .from('abonati')
            .update({ unsubscribed_at: null })
            .eq('email', value)
            .not('unsubscribed_at', 'is', null);
          return { ok: !error };
        } catch {
          return { ok: false };
        }
      },
    });

    if (outcome === 'invalid') {
      return NextResponse.json(
        { error: 'Introdu o adresă de email validă.' },
        { status: 400 },
      );
    }

    if (outcome === 'error') {
      console.error('[subscribe] save failed');
      return NextResponse.json(
        { error: 'Nu am putut înregistra înscrierea. Încearcă din nou.' },
        { status: 500 },
      );
    }

    if (outcome === 'duplicate') {
      return NextResponse.json({
        success: true,
        message: NEWSLETTER_SIGNUP_DUPLICATE,
        alreadySubscribed: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: NEWSLETTER_SIGNUP_SUCCESS,
    });
  } catch (err) {
    console.error('[subscribe]', err instanceof Error ? err.name : 'unavailable');
    return NextResponse.json(
      { error: 'Înscrierea nu este disponibilă momentan.' },
      { status: 503 },
    );
  }
}
