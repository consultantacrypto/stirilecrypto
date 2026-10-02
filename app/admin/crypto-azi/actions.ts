'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminUser } from '@/lib/admin/require-admin';
import { createServiceClient } from '@/lib/supabase/service';
import {
  normalizeTakeaways,
  validateTakeaways,
} from '@/lib/crypto-azi/format';
import type {
  CryptoBriefStatus,
  CryptoDailyBrief,
  CryptoTakeaway,
} from '@/lib/crypto-azi/types';

export type CryptoAziActionResult =
  | { success: true; id: string }
  | { success: false; error: string };

export type CryptoAziBriefInput = {
  brief_date: string;
  status: CryptoBriefStatus;
  title: string;
  introduction: string;
  takeaways: CryptoTakeaway[];
  published_at?: string | null;
};

function mapRow(row: Record<string, unknown>): CryptoDailyBrief {
  return {
    id: String(row.id),
    brief_date: String(row.brief_date),
    status: row.status as CryptoBriefStatus,
    title: String(row.title ?? ''),
    introduction: String(row.introduction ?? ''),
    takeaways: normalizeTakeaways(row.takeaways),
    published_at: (row.published_at as string | null) ?? null,
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
    author_id: (row.author_id as string | null) ?? null,
    author_name: (row.author_name as string | null) ?? null,
  };
}

function revalidateCryptoAziPaths() {
  revalidatePath('/', 'layout');
  revalidatePath('/crypto-azi');
  revalidatePath('/admin/crypto-azi');
  revalidatePath('/sitemap.xml');
}

/**
 * Validate + build DB payload. Throws on invalid publish payload.
 * Must run after requireAdminUser and before createServiceClient.
 */
function buildPayload(
  input: CryptoAziBriefInput,
  user: { id: string; email?: string | null },
  previousPublishedAt: string | null,
) {
  if (!input.brief_date?.trim()) {
    throw new Error('Data briefingului este obligatorie.');
  }
  if (!['draft', 'published', 'archived'].includes(input.status)) {
    throw new Error('Status invalid.');
  }

  const takeaways = normalizeTakeaways(input.takeaways).map((t) => ({
    title: t.title.trim(),
    why_it_matters: t.why_it_matters.trim(),
    source_label: t.source_label.trim(),
    source_url: t.source_url.trim(),
  }));

  if (input.status === 'published') {
    const check = validateTakeaways(takeaways);
    if (!check.ok) {
      throw new Error(check.errors[0] ?? 'Takeaways invalide pentru publicare.');
    }
    if (!input.title.trim()) {
      throw new Error('Titlul este obligatoriu pentru publicare.');
    }
  }

  return {
    brief_date: input.brief_date.trim(),
    status: input.status,
    title: input.title.trim(),
    introduction: input.introduction.trim(),
    takeaways,
    published_at:
      input.status === 'published'
        ? previousPublishedAt ?? new Date().toISOString()
        : previousPublishedAt,
    author_id: user.id,
    // Display-only; never used for authorization.
    author_name: user.email ?? 'Redacție',
  };
}

/** Admin listing — auth → service_role (drafts are not JWT-readable). */
export async function listCryptoBriefsAdminAction(): Promise<CryptoDailyBrief[]> {
  const auth = await requireAdminUser();
  if (!auth.ok) return [];

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('crypto_daily_briefs')
      .select('*')
      .order('brief_date', { ascending: false });
    if (error) {
      console.error('[listCryptoBriefsAdminAction]', error.message);
      return [];
    }
    return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
  } catch (err) {
    console.error('[listCryptoBriefsAdminAction]', err);
    return [];
  }
}

export async function getCryptoBriefAdminAction(
  id: string,
): Promise<CryptoDailyBrief | null> {
  const auth = await requireAdminUser();
  if (!auth.ok) return null;
  if (!id?.trim()) return null;

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('crypto_daily_briefs')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error || !data) return null;
    return mapRow(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function createCryptoBriefAction(
  input: CryptoAziBriefInput,
): Promise<CryptoAziActionResult> {
  const auth = await requireAdminUser();
  if (!auth.ok) return { success: false, error: auth.error };

  let payload: ReturnType<typeof buildPayload>;
  try {
    payload = buildPayload(input, auth.user, null);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Payload invalid.',
    };
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('crypto_daily_briefs')
      .insert(payload)
      .select('id')
      .single();
    if (error || !data?.id) {
      return { success: false, error: error?.message ?? 'Insert eșuat.' };
    }
    revalidateCryptoAziPaths();
    return { success: true, id: data.id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Insert eșuat.',
    };
  }
}

export async function updateCryptoBriefAction(
  id: string,
  input: CryptoAziBriefInput,
  previousPublishedAt: string | null,
): Promise<CryptoAziActionResult> {
  const auth = await requireAdminUser();
  if (!auth.ok) return { success: false, error: auth.error };
  if (!id?.trim()) return { success: false, error: 'ID lipsă.' };

  let payload: ReturnType<typeof buildPayload>;
  try {
    payload = buildPayload(input, auth.user, previousPublishedAt);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Payload invalid.',
    };
  }

  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from('crypto_daily_briefs')
      .update(payload)
      .eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    revalidateCryptoAziPaths();
    return { success: true, id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Update eșuat.',
    };
  }
}

export async function deleteCryptoBriefAction(
  id: string,
): Promise<CryptoAziActionResult> {
  const auth = await requireAdminUser();
  if (!auth.ok) return { success: false, error: auth.error };
  if (!id?.trim()) return { success: false, error: 'ID lipsă.' };

  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from('crypto_daily_briefs').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidateCryptoAziPaths();
    return { success: true, id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Ștergere eșuată.',
    };
  }
}
