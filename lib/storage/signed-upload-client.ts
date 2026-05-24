import { createSignedImageUploadUrlAction } from '@/lib/actions/storage';
import { compressCoverImageForUpload } from '@/lib/storage/compress-cover-image';
import { getStoragePublicUrl } from '@/lib/image-url';
import { IMAGINI_STIRI_BUCKET } from '@/lib/storage/constants';
import { createClient } from '@/lib/supabase/client';

/**
 * 1. Client-side WebP compression (~200KB cap).
 * 2. Server action mints signed PUT URL (service role).
 * 3. Browser PUTs file bytes to Supabase Storage.
 * 4. Returns the public object URL for form state / auto-save.
 */
export async function uploadCoverImageSigned(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Fișierul trebuie să fie o imagine (JPG, PNG, WebP).');
  }

  const uploadFile =
    file.type === 'image/webp' && file.size <= 220_000 ? file : await compressCoverImageForUpload(file);

  const signed = await createSignedImageUploadUrlAction(uploadFile.name);
  if (!signed.success) {
    throw new Error(signed.error);
  }

  const contentType = uploadFile.type || 'image/webp';
  const putResponse = await fetch(signed.signedUrl, {
    method: 'PUT',
    body: uploadFile,
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
