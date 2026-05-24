import { getStoragePublicUrl } from '@/lib/image-url';
import { createClient } from '@/lib/supabase/client';
import { sanitizeFileName } from '@/lib/slugify';

export const IMAGINI_STIRI_BUCKET = 'imagini-stiri';

/** Direct browser upload to Supabase Storage (requires Storage RLS for authenticated users). */
export async function uploadCoverImageClient(file: File): Promise<string> {
  const supabase = createClient();
  const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;

  const { error } = await supabase.storage.from(IMAGINI_STIRI_BUCKET).upload(fileName, file, {
    upsert: true,
    cacheControl: '3600',
  });

  if (error) {
    throw new Error(`Upload eșuat: ${error.message}`);
  }

  return getStoragePublicUrl(supabase, IMAGINI_STIRI_BUCKET, fileName);
}
