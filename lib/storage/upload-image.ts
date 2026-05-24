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

const EXTENSION_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
};

function resolveImageContentType(file: File): string {
  const fromBrowser = file.type?.trim();
  if (fromBrowser && ALLOWED_MIME_TYPES.has(fromBrowser)) {
    return fromBrowser;
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const fromExtension = EXTENSION_TO_MIME[ext];
  if (fromExtension) {
    return fromExtension;
  }

  throw new Error('Tip de fișier nepermis. Folosește JPG, PNG, WebP, GIF sau AVIF.');
}

/**
 * Upload an image via service role (bypasses Storage RLS). Server-only.
 * Reads binary via ArrayBuffer — never pass the raw File/Blob to storage.upload.
 */
export async function uploadImageToStorage(file: File): Promise<string> {
  const contentType = resolveImageContentType(file);

  if (file.size === 0) {
    throw new Error('Fișierul este gol.');
  }

  if (file.size > MAX_FILE_BYTES) {
    throw new Error('Imaginea depășește limita de 10 MB.');
  }

  const arrayBuffer = await file.arrayBuffer();

  if (arrayBuffer.byteLength === 0) {
    throw new Error('Fișierul nu a putut fi citit (buffer gol).');
  }

  if (arrayBuffer.byteLength !== file.size) {
    throw new Error(
      `Fișier incomplet citit (${arrayBuffer.byteLength} bytes din ${file.size}).`,
    );
  }

  const body = new Uint8Array(arrayBuffer);
  const uniqueName = `${Date.now()}-${sanitizeFileName(file.name)}`;
  const supabase = createServiceClient();

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(uniqueName, body, {
      contentType,
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Upload eșuat: ${uploadError.message}`);
  }

  return getStoragePublicUrl(supabase, STORAGE_BUCKET, uniqueName);
}
