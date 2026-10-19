import { NextRequest } from 'next/server';
import { authorizeEditor, editorJson } from '@/lib/editor/http';
import {
  EDITOR_IMAGE_MAX_BYTES,
  buildEditorImagePath,
  publicImageUrl,
  sniffImageType,
} from '@/lib/editor/images';
import { IMAGINI_STIRI_BUCKET } from '@/lib/storage/constants';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/editor/images
 * Body: multipart/form-data with a `file` field, or the raw image bytes
 * (Content-Type image/webp|png|jpeg, optional `?filename=`). Max 5 MB.
 * Uploads to imagini-stiri/editor-covers/<safe-name> with the service role.
 */
export async function POST(request: NextRequest) {
  const denied = authorizeEditor(request);
  if (denied) return denied;

  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (declaredLength > EDITOR_IMAGE_MAX_BYTES + 64 * 1024) {
    return editorJson({ error: 'Image too large (max 5 MB).' }, 413);
  }

  const contentType = (request.headers.get('content-type') ?? '').toLowerCase();
  let bytes: Uint8Array;
  let name: string | null = request.nextUrl.searchParams.get('filename');

  try {
    if (contentType.startsWith('multipart/form-data')) {
      const form = await request.formData();
      const file = form.get('file');
      if (!file || typeof file === 'string') {
        return editorJson({ error: 'Missing `file` field.' }, 400);
      }
      if (file.size > EDITOR_IMAGE_MAX_BYTES) {
        return editorJson({ error: 'Image too large (max 5 MB).' }, 413);
      }
      name = (form.get('filename') as string | null) || file.name || name;
      bytes = new Uint8Array(await file.arrayBuffer());
    } else if (/^image\/(webp|png|jpeg)\b/.test(contentType)) {
      bytes = new Uint8Array(await request.arrayBuffer());
    } else {
      return editorJson({ error: 'Send multipart/form-data or an image/webp, image/png or image/jpeg body.' }, 415);
    }
  } catch {
    return editorJson({ error: 'Could not read request body.' }, 400);
  }

  if (bytes.byteLength === 0) return editorJson({ error: 'Empty file.' }, 400);
  if (bytes.byteLength > EDITOR_IMAGE_MAX_BYTES) {
    return editorJson({ error: 'Image too large (max 5 MB).' }, 413);
  }

  const mime = sniffImageType(bytes);
  if (!mime) return editorJson({ error: 'Only WebP, PNG or JPEG images are accepted.' }, 415);

  const path = buildEditorImagePath(name, mime);
  if (!path) return editorJson({ error: 'Invalid filename.' }, 400);

  try {
    const supabase = createServiceClient();
    const { error } = await supabase.storage
      .from(IMAGINI_STIRI_BUCKET)
      .upload(path, bytes, { contentType: mime, upsert: false, cacheControl: '31536000' });
    if (error) {
      console.error('[editor/images] upload failed', error.message);
      return editorJson({ error: 'Upload failed.' }, 500);
    }
  } catch (error) {
    console.error('[editor/images]', error);
    return editorJson({ error: 'Storage is not configured.' }, 503);
  }

  return editorJson(
    { path, bucket: IMAGINI_STIRI_BUCKET, url: publicImageUrl(path), content_type: mime, bytes: bytes.byteLength },
    201,
  );
}
