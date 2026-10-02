import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const WAITLIST_SUCCESS = 'Înscrierea pe lista de așteptare a fost înregistrată.';
const WAITLIST_DUPLICATE = 'Această adresă este deja pe lista de așteptare.';

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (!email || !EMAIL_REGEX.test(email)) return null;
  return email;
}

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

    const { error } = await supabase.from('abonati').insert({ email });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({
          success: true,
          message: WAITLIST_DUPLICATE,
          alreadySubscribed: true,
        });
      }

      console.error('[subscribe]', error.message);
      return NextResponse.json(
        { error: 'Nu am putut înregistra înscrierea. Încearcă din nou.' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: WAITLIST_SUCCESS,
    });
  } catch (err) {
    console.error('[subscribe]', err);
    return NextResponse.json(
      { error: 'Serviciul de listă de așteptare nu este disponibil momentan.' },
      { status: 503 },
    );
  }
}
