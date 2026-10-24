import { createServiceClient } from '@/lib/supabase/service';
import type { NormalizedOrder } from '@/lib/products/intake';
import type { ProductId } from '@/lib/products/config';

export interface InquiryInsert {
  product: ProductId;
  email: string;
  asset: string | null;
  amountRon: number | null;
  consent: boolean;
  payload: NormalizedOrder | Record<string, unknown>;
  status: 'waitlist' | 'pending_payment' | 'cancelled';
}

function storageConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

export async function storeInquiry(
  row: InquiryInsert,
): Promise<{ ok: true; id: string } | { ok: false; reason: 'unconfigured' | 'failed' }> {
  if (!storageConfigured()) return { ok: false, reason: 'unconfigured' };

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('product_inquiries')
      .insert({
        product: row.product,
        email: row.email,
        asset: row.asset,
        amount_ron: row.amountRon,
        currency: 'RON',
        consent_immediate_delivery: row.consent,
        payload: row.payload,
        status: row.status,
      })
      .select('id')
      .single();

    if (error || !data?.id) {
      console.error('[product_inquiries]', error?.code ?? 'no-id', error?.message ?? 'insert failed');
      return { ok: false, reason: 'failed' };
    }

    return { ok: true, id: String(data.id) };
  } catch (err) {
    console.error('[product_inquiries]', err instanceof Error ? err.message : 'unknown');
    return { ok: false, reason: 'failed' };
  }
}

export async function attachStripeSession(id: string, sessionId: string): Promise<void> {
  if (!storageConfigured()) return;
  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from('product_inquiries')
      .update({ stripe_session_id: sessionId })
      .eq('id', id);
    if (error) console.error('[product_inquiries] session', error.message);
  } catch (err) {
    console.error('[product_inquiries] session', err instanceof Error ? err.message : 'unknown');
  }
}

export async function cancelInquiry(id: string): Promise<void> {
  if (!storageConfigured()) return;
  try {
    const supabase = createServiceClient();
    await supabase.from('product_inquiries').update({ status: 'cancelled' }).eq('id', id);
  } catch (err) {
    console.error('[product_inquiries] cancel', err instanceof Error ? err.message : 'unknown');
  }
}

export async function markInquiryPaid(
  id: string,
  sessionId: string,
): Promise<
  | {
      ok: true;
      changed: boolean;
      email: string;
      asset: string | null;
      amountRon: number | null;
      tier: 'major' | 'altcoin' | null;
    }
  | { ok: false; reason: 'unconfigured' | 'missing' | 'failed' }
> {
  if (!storageConfigured()) return { ok: false, reason: 'unconfigured' };

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('product_inquiries')
      .select('id, email, asset, amount_ron, status, payload')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      console.error('[product_inquiries] paid lookup', error?.message ?? 'missing');
      return { ok: false, reason: 'missing' };
    }

    const paidRow = {
      email: String(data.email),
      asset: data.asset ? String(data.asset) : null,
      amountRon: data.amount_ron == null ? null : Number(data.amount_ron),
      tier: tierFromPayload(data.payload),
    };

    if (data.status === 'paid') {
      return { ok: true, changed: false, ...paidRow };
    }

    const { error: updateError } = await supabase
      .from('product_inquiries')
      .update({ status: 'paid', stripe_session_id: sessionId })
      .eq('id', id)
      .neq('status', 'paid');

    if (updateError) {
      console.error('[product_inquiries] paid', updateError.message);
      return { ok: false, reason: 'failed' };
    }

    return { ok: true, changed: true, ...paidRow };
  } catch (err) {
    console.error('[product_inquiries] paid', err instanceof Error ? err.message : 'unknown');
    return { ok: false, reason: 'failed' };
  }
}

function tierFromPayload(payload: unknown): 'major' | 'altcoin' | null {
  if (!payload || typeof payload !== 'object') return null;
  const tier = (payload as { tier?: unknown }).tier;
  return tier === 'major' || tier === 'altcoin' ? tier : null;
}

export async function notifyInquiry(body: Record<string, unknown>): Promise<boolean> {
  const url = process.env.PRODUCT_ORDER_WEBHOOK_URL?.trim();
  if (!url?.startsWith('https://')) return false;

  const headers: Record<string, string> = { 'content-type': 'application/json' };
  const secret = process.env.PRODUCT_ORDER_WEBHOOK_SECRET?.trim();
  if (secret) headers.authorization = `Bearer ${secret}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch (err) {
    console.error('[product_inquiries] webhook', err instanceof Error ? err.message : 'unknown');
    return false;
  }
}
