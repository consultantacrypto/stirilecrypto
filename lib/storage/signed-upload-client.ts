import { createSignedImageUploadUrlAction } from '@/lib/actions/storage';
import { getStoragePublicUrl } from '@/lib/image-url';
import { IMAGINI_STIRI_BUCKET } from '@/lib/storage/constants';
import { createClient } from '@/lib/supabase/client';

/**
 * 1. Server action mints signed PUT URL (service role).
 * 2. Browser PUTs raw file bytes to Supabase Storage.
 * 3. Returns the public object URL for form state / auto-save.
 */
export async function uploadCoverImageSigned(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Fișierul trebuie să fie o imagine (JPG, PNG, WebP).');
  }

  const signed = await createSignedImageUploadUrlAction(file.name);
  if (!signed.success) {
    throw new Error(signed.error);
  }

  const contentType = file.type || 'application/octet-stream';
  const putResponse = await fetch(signed.signedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': contentType,
    },
  });

  if (!putResponse.ok) {
    const detail = await putResponse.text().catch(() => '');
    throw new Error(
      `Upload eșuat (${putResponse.status}): ${detail || putResponse.statusText}`,
    );
  }

  const supabase = createClient();
  return getStoragePublicUrl(supabase, IMAGINI_STIRI_BUCKET, signed.path);
}
