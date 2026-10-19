import { IMAGINI_STIRI_BUCKET } from '@/lib/storage/constants';

export const EDITOR_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
/** Multipart boundaries and part headers sit outside the file bytes. */
export const EDITOR_IMAGE_MULTIPART_SLACK_BYTES = 64 * 1024;
export const EDITOR_IMAGE_PREFIX = 'editor-covers';

const MAX_FILENAME_CHARS = 240;

export type EditorImageMime = 'image/webp' | 'image/png' | 'image/jpeg';

const EXTENSIONS: Record<EditorImageMime, string> = {
  'image/webp': 'webp',
  'image/png': 'png',
  'image/jpeg': 'jpg',
};

const MULTIPART_TYPE = /^multipart\/form-data\s*(?:;|$)/i;
const RAW_IMAGE_TYPE = /^image\/(webp|png|jpeg)\s*(?:;|$)/i;
const SAFE_OBJECT_PATH = /^editor-covers\/[a-z0-9]+(?:-[a-z0-9]+)*\.(webp|png|jpg)$/;

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const PNG_IHDR = [0x49, 0x48, 0x44, 0x52];

export type EditorImageClass =
  | { ok: true; kind: 'multipart'; cap: number; declared: null }
  | { ok: true; kind: 'raw'; cap: number; declared: EditorImageMime }
  | { ok: false; status: 415; error: string };

export type EditorImageFailure = { ok: false; status: number; error: string };

export type ContentLengthDecision = 'ok' | 'empty' | 'too-large';

export type LimitedBody =
  | { ok: true; bytes: Uint8Array }
  | { ok: false; reason: 'empty' | 'too-large' };

function startsWith(buf: Uint8Array, bytes: readonly number[], offset = 0): boolean {
  if (buf.length < offset + bytes.length) return false;
  for (let i = 0; i < bytes.length; i += 1) {
    if (buf[offset + i] !== bytes[i]) return false;
  }
  return true;
}

function hasJpegEndOfImage(buf: Uint8Array): boolean {
  for (let i = buf.length - 2; i >= 2; i -= 1) {
    if (buf[i] === 0xff && buf[i + 1] === 0xd9) return true;
  }
  return false;
}

/**
 * Detect WebP, PNG, or JPEG from the bytes. A declared Content-Type or filename
 * is never enough: PNG must carry a full signature plus IHDR, WebP must be a
 * RIFF/WEBP container whose first chunk is VP8, VP8L, or VP8X, and JPEG must
 * start with SOI plus a real marker and contain an end-of-image marker.
 */
export function sniffImageType(buf: Uint8Array): EditorImageMime | null {
  if (
    buf.length >= 16 &&
    startsWith(buf, [0x52, 0x49, 0x46, 0x46]) &&
    startsWith(buf, [0x57, 0x45, 0x42, 0x50], 8) &&
    buf[12] === 0x56 &&
    buf[13] === 0x50 &&
    buf[14] === 0x38 &&
    (buf[15] === 0x20 || buf[15] === 0x4c || buf[15] === 0x58)
  ) {
    return 'image/webp';
  }

  if (buf.length >= 16 && startsWith(buf, PNG_SIGNATURE) && startsWith(buf, PNG_IHDR, 12)) {
    return 'image/png';
  }

  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    const marker = buf[3];
    if (marker >= 0xc0 && marker !== 0xff && hasJpegEndOfImage(buf)) return 'image/jpeg';
  }

  return null;
}

/** Object keys we are willing to upload. `..`, extra slashes, and other types cannot match. */
export function isSafeEditorObjectPath(path: string): boolean {
  return path.length <= 160 && SAFE_OBJECT_PATH.test(path);
}

/**
 * Build `editor-covers/<slug>-<timestamp>-<random>.<ext>`.
 * Slashes, backslashes, NUL, and `..` are rejected. The slug keeps only `[a-z0-9-]`.
 */
export function buildEditorImagePath(rawName: string | null | undefined, mime: EditorImageMime): string | null {
  const ext = EXTENSIONS[mime];
  if (!ext) return null;
  if (typeof rawName === 'string' && rawName.length > 0) {
    if (rawName.length > MAX_FILENAME_CHARS) return null;
    if (rawName.includes('\0') || rawName.includes('..') || /[\\/]/.test(rawName)) return null;
  }

  const stem = (rawName ?? '')
    .replace(/\.[a-z0-9]+$/i, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');

  const nonce = randomHex(4);
  const path = `${EDITOR_IMAGE_PREFIX}/${stem || 'cover'}-${Date.now()}-${nonce}.${ext}`;
  return isSafeEditorObjectPath(path) ? path : null;
}

export function publicImageUrl(path: string): string | null {
  if (!isSafeEditorObjectPath(path)) return null;
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(base)) return null;
  const encoded = path.split('/').map((segment) => encodeURIComponent(segment)).join('/');
  return `${base}/storage/v1/object/public/${IMAGINI_STIRI_BUCKET}/${encoded}`;
}

export function classifyEditorImageContentType(contentType: string | null): EditorImageClass {
  const header = contentType ?? '';
  if (MULTIPART_TYPE.test(header)) {
    return {
      ok: true,
      kind: 'multipart',
      cap: EDITOR_IMAGE_MAX_BYTES + EDITOR_IMAGE_MULTIPART_SLACK_BYTES,
      declared: null,
    };
  }

  const match = RAW_IMAGE_TYPE.exec(header);
  if (!match) {
    return {
      ok: false,
      status: 415,
      error: 'Send multipart/form-data or an image/webp, image/png or image/jpeg body.',
    };
  }

  const subtype = match[1].toLowerCase();
  const declared: EditorImageMime =
    subtype === 'png' ? 'image/png' : subtype === 'webp' ? 'image/webp' : 'image/jpeg';
  return { ok: true, kind: 'raw', cap: EDITOR_IMAGE_MAX_BYTES, declared };
}

/**
 * Trust Content-Length only when it is a decimal integer. Missing or non-numeric
 * values are not treated as small; the stream cap still applies.
 */
export function contentLengthStatus(header: string | null, maxBytes: number): ContentLengthDecision {
  if (header == null) return 'ok';
  const value = header.trim();
  if (!/^\d+$/.test(value)) return 'ok';
  const length = Number(value);
  if (!Number.isFinite(length) || length > maxBytes) return 'too-large';
  if (length === 0) return 'empty';
  return 'ok';
}

/** Read at most `maxBytes`. The overflowing chunk is not kept. */
export async function readLimitedBody(
  stream: ReadableStream<Uint8Array> | null,
  maxBytes: number,
): Promise<LimitedBody> {
  if (!stream) return { ok: false, reason: 'empty' };

  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const size = value?.byteLength ?? 0;
      if (size === 0) continue;
      if (total > maxBytes - size) {
        try {
          await reader.cancel();
        } catch {
          // The extra bytes are already discarded with this reader.
        }
        return { ok: false, reason: 'too-large' };
      }
      chunks.push(value);
      total += size;
    }
  } finally {
    reader.releaseLock();
  }

  if (total === 0) return { ok: false, reason: 'empty' };

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { ok: true, bytes };
}

export function editorImageFilename(input: {
  query: string | null;
  field: unknown;
  fileName: string;
}): string | null {
  const fromField = typeof input.field === 'string' ? input.field.trim() : '';
  const fromFile = input.fileName.trim();
  const fromQuery = input.query?.trim() ?? '';
  return fromField || fromFile || fromQuery || null;
}

export async function parseEditorImageBody(input: {
  kind: 'multipart' | 'raw';
  contentType: string;
  body: Uint8Array;
  queryFilename: string | null;
}): Promise<{ ok: true; bytes: Uint8Array; name: string | null } | EditorImageFailure> {
  if (input.kind === 'raw') {
    return { ok: true, bytes: input.body, name: blankToNull(input.queryFilename) };
  }

  let form: FormData;
  try {
    form = await new Request('http://127.0.0.1/api/editor/images', {
      method: 'POST',
      headers: { 'content-type': input.contentType },
      body: copyBytes(input.body),
    }).formData();
  } catch {
    return { ok: false, status: 400, error: 'Could not read request body.' };
  }

  const file = form.get('file');
  if (!file || typeof file === 'string') {
    return { ok: false, status: 400, error: 'Missing `file` field.' };
  }
  if (file.size > EDITOR_IMAGE_MAX_BYTES) {
    return { ok: false, status: 413, error: 'Image too large (max 5 MB).' };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes.byteLength > EDITOR_IMAGE_MAX_BYTES) {
    return { ok: false, status: 413, error: 'Image too large (max 5 MB).' };
  }

  return {
    ok: true,
    bytes,
    name: editorImageFilename({
      query: input.queryFilename,
      field: form.get('filename'),
      fileName: file.name,
    }),
  };
}

export function acceptEditorImage(
  bytes: Uint8Array,
  declared: EditorImageMime | null,
  name: string | null,
): { ok: true; bytes: Uint8Array; mime: EditorImageMime; path: string } | EditorImageFailure {
  if (bytes.byteLength === 0) return { ok: false, status: 400, error: 'Empty file.' };
  if (bytes.byteLength > EDITOR_IMAGE_MAX_BYTES) {
    return { ok: false, status: 413, error: 'Image too large (max 5 MB).' };
  }

  const mime = sniffImageType(bytes);
  if (!mime) {
    return { ok: false, status: 415, error: 'Only WebP, PNG or JPEG images are accepted.' };
  }
  if (declared && declared !== mime) {
    return { ok: false, status: 415, error: 'Content-Type does not match the image bytes.' };
  }

  const path = buildEditorImagePath(name, mime);
  if (!path) return { ok: false, status: 400, error: 'Invalid filename.' };
  return { ok: true, bytes, mime, path };
}

export function isDuplicateStorageError(error: {
  message?: string;
  status?: number | string;
  statusCode?: number | string;
}): boolean {
  const status = Number(error.status);
  const statusCode = String(error.statusCode ?? '').toLowerCase();
  const message = (error.message ?? '').toLowerCase();
  return (
    status === 409 ||
    statusCode === '409' ||
    statusCode === 'duplicate' ||
    message.includes('already exists') ||
    message.includes('duplicate')
  );
}

function blankToNull(value: string | null): string | null {
  const trimmed = value?.trim() ?? '';
  return trimmed || null;
}

/** A standalone ArrayBuffer. Typed arrays are not a Fetch `BodyInit` under current DOM types. */
export function copyBytes(bytes: Uint8Array): ArrayBuffer {
  const copy = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(copy).set(bytes);
  return copy;
}

function randomHex(bytes: number): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  let hex = '';
  for (const byte of buf) hex += byte.toString(16).padStart(2, '0');
  return hex;
}
