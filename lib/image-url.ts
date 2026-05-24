import { getSupabaseEnv } from '@/lib/supabase/env';

export const PLACEHOLDER_IMAGE = '/placeholder.jpg';

const STORAGE_BUCKET = 'imagini-stiri';

type StorageClient = {
  storage: {
    from: (bucket: string) => {
      getPublicUrl: (path: string) => { data: { publicUrl: string } };
    };
  };
};

/** Full public URL after upload or from Media Library. */
export function getStoragePublicUrl(
  supabase: StorageClient,
  bucket: string,
  path: string,
): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  const url = data.publicUrl?.trim();
  if (!url) {
    throw new Error('Nu s-a putut genera URL-ul public pentru imagine.');
  }
  return url;
}

/**
 * Normalize any stored or legacy image value into a string safe for `next/image`.
 * Never returns empty string — uses PLACEHOLDER_IMAGE instead.
 */
export function normalizeImageUrl(raw: string | null | undefined): string {
  const url = raw?.trim();
  if (!url || url === 'null' || url === 'undefined') {
    return PLACEHOLDER_IMAGE;
  }
  if (url.startsWith('blob:')) {
    return PLACEHOLDER_IMAGE;
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/')) {
    return url;
  }

  const env = getSupabaseEnv();
  if (env) {
    const base = env.url.replace(/\/$/, '');
    const objectPath = url.startsWith(`${STORAGE_BUCKET}/`)
      ? url.slice(STORAGE_BUCKET.length + 1)
      : url;
    return `${base}/storage/v1/object/public/${STORAGE_BUCKET}/${objectPath}`;
  }

  return PLACEHOLDER_IMAGE;
}

/** Map DB/static fields to a display-safe image URL. */
export function resolveImageUrl(source: {
  image_url?: string | null;
  image?: string | null;
}): string {
  return normalizeImageUrl(source.image_url ?? source.image);
}

/** Persist only real URLs — never blob previews or the placeholder. */
export function prepareImageUrlForStorage(raw: string | null | undefined): string | null {
  const trimmed = raw?.trim();
  if (!trimmed || trimmed.startsWith('blob:')) {
    return null;
  }

  const normalized = normalizeImageUrl(trimmed);
  if (normalized === PLACEHOLDER_IMAGE) {
    return null;
  }

  return normalized;
}
