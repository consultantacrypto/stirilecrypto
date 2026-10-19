import { NextRequest } from 'next/server';
import { EditorApiError, getEditorArticle, updateEditorArticle } from '@/lib/editor/articles';
import { authorizeEditor, editorJson, parseArticleId } from '@/lib/editor/http';
import { validatePatchBody } from '@/lib/editor/validate';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const denied = authorizeEditor(request);
  if (denied) return denied;

  const id = parseArticleId((await context.params).id);
  if (!id) return editorJson({ error: 'Article id must be a UUID.' }, 400);

  try {
    return editorJson(await getEditorArticle(id));
  } catch (error) {
    return editorError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const denied = authorizeEditor(request);
  if (denied) return denied;

  const id = parseArticleId((await context.params).id);
  if (!id) return editorJson({ error: 'Article id must be a UUID.' }, 400);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return editorJson({ error: 'Invalid JSON body.' }, 400);
  }

  const parsed = validatePatchBody(body);
  if (!parsed.ok) return editorJson({ error: parsed.error }, 400);

  try {
    return editorJson(await updateEditorArticle(id, parsed.value));
  } catch (error) {
    return editorError(error);
  }
}

function editorError(error: unknown) {
  if (error instanceof EditorApiError) {
    return editorJson({ error: error.message }, error.status);
  }
  console.error('[editor/articles/:id]', error);
  return editorJson({ error: 'Internal server error.' }, 500);
}
