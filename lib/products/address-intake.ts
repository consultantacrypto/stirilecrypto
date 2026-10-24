import { sanitizeSource } from './placement';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface AddressWaitlist {
  email: string;
  source: string | null;
  contactConsent: true;
}

function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max);
}

export function validateAddressWaitlist(
  input: unknown,
): { ok: true; value: AddressWaitlist; honeypot: boolean } | { ok: false; error: string } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, error: 'Cerere invalidă.' };
  }
  const body = input as Record<string, unknown>;

  if (clean(body.company, 80)) {
    return {
      ok: true,
      honeypot: true,
      value: { email: 'bot@example.com', source: null, contactConsent: true },
    };
  }

  const email = clean(body.email, 160).toLowerCase();
  if (!EMAIL_REGEX.test(email)) return { ok: false, error: 'Introdu o adresă de email validă.' };
  if (body.consent !== true) {
    return { ok: false, error: 'Bifează că vrei să primești anunțul pe email.' };
  }

  return {
    ok: true,
    honeypot: false,
    value: {
      email,
      source: sanitizeSource(typeof body.source === 'string' ? body.source : null),
      contactConsent: true,
    },
  };
}
