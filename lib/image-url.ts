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

const SUPABASE_OBJECT_PATH = '/storage/v1/object/public/';

/**
 * Supabase image transform. The site leaves next/image unoptimized because the
 * Vercel image optimizer is not enabled, so card covers request a smaller file directly.
 *
 * `resize=contain` scales to `width` and keeps the source aspect ratio.
 * `resize=cover` (the render default) with no height keeps the source height
 * and center-crops, which turned 1140×650 covers into 720×650 on the homepage.
 */
export function displayCoverUrl(src: string, width = 960): string {
  const marker = src.indexOf(SUPABASE_OBJECT_PATH);
  if (marker < 0) return src;
  const origin = src.slice(0, marker);
  const objectPath = src.slice(marker + SUPABASE_OBJECT_PATH.length).split('?')[0];
  if (!objectPath) return src;
  const params = new URLSearchParams({
    width: String(width),
    quality: '60',
    resize: 'contain',
  });
  return `${origin}/storage/v1/render/image/public/${objectPath}?${params.toString()}`;
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
