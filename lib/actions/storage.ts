'use server';

import { IMAGINI_STIRI_BUCKET } from '@/lib/storage/constants';
import { sanitizeFileName } from '@/lib/slugify';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

export type SignedImageUploadUrlResult =
  | { success: true; signedUrl: string; path: string }
  | { success: false; error: string };

async function requireAdminUser(): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { ok: false, error: 'Neautorizat.' };
  }

  return { ok: true };
}

/**
 * Mint a short-lived signed PUT URL for `imagini-stiri` (service role; bypasses Storage RLS).
 */
export async function createSignedImageUploadUrlAction(
  originalFileName: string,
): Promise<SignedImageUploadUrlResult> {
  const auth = await requireAdminUser();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }

  const safeName = sanitizeFileName(originalFileName || 'image.jpg');
  const path = `${Date.now()}-${safeName}`;

  try {
    const supabaseAdmin = createServiceClient();
    const { data, error } = await supabaseAdmin.storage
      .from(IMAGINI_STIRI_BUCKET)
      .createSignedUploadUrl(path, { upsert: true });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data?.signedUrl) {
      return { success: false, error: 'Nu s-a putut genera URL-ul de upload.' };
    }

    return {
      success: true,
      signedUrl: data.signedUrl,
      path: data.path ?? path,
    };
  } catch (err) {
    console.error('[createSignedImageUploadUrlAction]', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Eroare la generarea URL-ului de upload.',
    };
  }
}
