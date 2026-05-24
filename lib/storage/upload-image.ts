import { getStoragePublicUrl } from '@/lib/image-url';
import { sanitizeFileName } from '@/lib/slugify';
import { createServiceClient } from '@/lib/supabase/service';

export const STORAGE_BUCKET = 'imagini-stiri';

const MAX_FILE_BYTES = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

/**
 * Upload an image via service role (bypasses Storage RLS). Server-only.
 */
export async function uploadImageToStorage(file: File): Promise<string> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error('Tip de fișier nepermis. Folosește JPG, PNG, WebP, GIF sau AVIF.');
  }

  if (file.size === 0) {
    throw new Error('Fișierul este gol.');
  }

  if (file.size > MAX_FILE_BYTES) {
    throw new Error('Imaginea depășește limita de 10 MB.');
  }

  const uniqueName = `${Date.now()}-${sanitizeFileName(file.name)}`;
  const supabase = createServiceClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(uniqueName, buffer, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Upload eșuat: ${uploadError.message}`);
  }

  return getStoragePublicUrl(supabase, STORAGE_BUCKET, uniqueName);
}
