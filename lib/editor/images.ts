import { IMAGINI_STIRI_BUCKET } from '@/lib/storage/constants';

export const EDITOR_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const EDITOR_IMAGE_PREFIX = 'editor-covers';

const TYPES: Record<string, string> = {
  'image/webp': 'webp',
  'image/png': 'png',
  'image/jpeg': 'jpg',
};

/** Detect the real type from magic bytes; never trust the declared Content-Type alone. */
export function sniffImageType(buf: Uint8Array): string | null {
  if (buf.length >= 12 && buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'image/webp';
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png';
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  return null;
}

/**
 * Build `editor-covers/<safe-name>.<ext>`. Only [a-z0-9-] survives in the stem, so
 * `..`, `/`, `\` and encoded separators cannot escape the prefix. Returns null if nothing usable remains.
 */
export function buildEditorImagePath(rawName: string | null | undefined, mime: string): string | null {
  const ext = TYPES[mime];
  if (!ext) return null;
  const base = (rawName ?? '').split(/[\\/]/).pop() ?? '';
  const stem = base
    .replace(/\.[a-z0-9]+$/i, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  if (rawName && /(^|[\\/])\.\.([\\/]|$)/.test(rawName)) return null;
  return `${EDITOR_IMAGE_PREFIX}/${stem || 'cover'}-${Date.now()}.${ext}`;
}

export function publicImageUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/+$/, '');
  return `${base}/storage/v1/object/public/${IMAGINI_STIRI_BUCKET}/${path}`;
}
