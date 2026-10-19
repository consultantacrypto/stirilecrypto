import { NextRequest } from 'next/server';
import { authorizeEditor, editorJson } from '@/lib/editor/http';
import {
  acceptEditorImage,
  classifyEditorImageContentType,
  contentLengthStatus,
  isDuplicateStorageError,
  copyBytes,
  parseEditorImageBody,
  publicImageUrl,
  readLimitedBody,
} from '@/lib/editor/images';
import { IMAGINI_STIRI_BUCKET } from '@/lib/storage/constants';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const TOO_LARGE = { error: 'Image too large (max 5 MB).' };
const EMPTY_FILE = { error: 'Empty file.' };

/**
 * POST /api/editor/images
 * Auth runs before the body is read. Multipart `file` or a raw
 * image/webp|png|jpeg body, capped at 5 MB, stored under editor-covers/.
 */
export async function POST(request: NextRequest) {
  const denied = authorizeEditor(request);
  if (denied) return denied;

  const classified = classifyEditorImageContentType(request.headers.get('content-type'));
  if (!classified.ok) return editorJson({ error: classified.error }, classified.status);

  const lengthStatus = contentLengthStatus(request.headers.get('content-length'), classified.cap);
  if (lengthStatus === 'too-large') return editorJson(TOO_LARGE, 413);
  if (lengthStatus === 'empty') return editorJson(EMPTY_FILE, 400);

  let limited: Awaited<ReturnType<typeof readLimitedBody>>;
  try {
    limited = await readLimitedBody(request.body, classified.cap);
  } catch {
    return editorJson({ error: 'Could not read request body.' }, 400);
  }
  if (!limited.ok) {
    return limited.reason === 'too-large' ? editorJson(TOO_LARGE, 413) : editorJson(EMPTY_FILE, 400);
  }

  const parsed = await parseEditorImageBody({
    kind: classified.kind,
    contentType: request.headers.get('content-type') ?? '',
    body: limited.bytes,
    queryFilename: request.nextUrl.searchParams.get('filename'),
  });
  if (!parsed.ok) return editorJson({ error: parsed.error }, parsed.status);

  const accepted = acceptEditorImage(parsed.bytes, classified.declared, parsed.name);
  if (!accepted.ok) return editorJson({ error: accepted.error }, accepted.status);

  const url = publicImageUrl(accepted.path);
  if (!url) return editorJson({ error: 'Storage is not configured.' }, 503);

  try {
    const supabase = createServiceClient();
    const { error } = await supabase.storage.from(IMAGINI_STIRI_BUCKET).upload(accepted.path, copyBytes(accepted.bytes), {
      contentType: accepted.mime,
      upsert: false,
      cacheControl: '31536000',
    });
    if (error) {
      console.error('[editor/images] upload failed', error.message);
      if (isDuplicateStorageError(error)) return editorJson({ error: 'Upload conflict. Retry.' }, 409);
      return editorJson({ error: 'Upload failed.' }, 500);
    }
  } catch (error) {
    console.error('[editor/images]', error);
    if (error instanceof Error && error.message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return editorJson({ error: 'Storage is not configured.' }, 503);
    }
    return editorJson({ error: 'Upload failed.' }, 500);
  }

  return editorJson(
    {
      path: accepted.path,
      bucket: IMAGINI_STIRI_BUCKET,
      url,
      content_type: accepted.mime,
      bytes: accepted.bytes.byteLength,
    },
    201,
  );
}
