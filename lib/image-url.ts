import { getSupabaseEnv } from '@/lib/supabase/env';

export const PLACEHOLDER_IMAGE = '/placeholder.jpg';

import { IMAGINI_STIRI_BUCKET } from '@/lib/storage/constants';

const STORAGE_BUCKET = IMAGINI_STIRI_BUCKET;

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

const SUPABASE_OBJECT_URL =
  /^(https:\/\/[a-z0-9-]+\.supabase\.co)\/storage\/v1\/object\/public\/([^?#]+)(?:\?[^#]*)?$/i;

/**
 * Smaller display URL for cards and lists.
 * Supabase Storage image transformation is on for this project, so a 100KB+
 * cover can be requested at the rendered width. Other hosts, including files
 * in /public, are returned unchanged. The article hero keeps the original URL.
 */
export function thumbnailImageUrl(src: string, width = 240): string {
  const safeWidth = Math.min(1200, Math.max(64, Math.round(width)));
  const match = src.match(SUPABASE_OBJECT_URL);
  if (!match) return src;
  return `${match[1]}/storage/v1/render/image/public/${match[2]}?width=${safeWidth}&quality=60`;
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
