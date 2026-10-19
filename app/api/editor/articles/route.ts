import { NextRequest } from 'next/server';
import { EditorApiError, createEditorArticle, listEditorArticles } from '@/lib/editor/articles';
import { authorizeEditor, editorJson } from '@/lib/editor/http';
import { parseEditorListQuery, validateCreateBody } from '@/lib/editor/validate';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const denied = authorizeEditor(request);
  if (denied) return denied;

  const parsed = parseEditorListQuery(request.nextUrl.searchParams);
  if (!parsed.ok) return editorJson({ error: parsed.error }, 400);

  try {
    const result = await listEditorArticles(parsed.value);
    return editorJson(result);
  } catch (error) {
    return editorError(error);
  }
}

export async function POST(request: NextRequest) {
  const denied = authorizeEditor(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return editorJson({ error: 'Invalid JSON body.' }, 400);
  }

  const parsed = validateCreateBody(body);
  if (!parsed.ok) return editorJson({ error: parsed.error }, 400);

  try {
    const article = await createEditorArticle(parsed.value);
    return editorJson(article, 201);
  } catch (error) {
    return editorError(error);
  }
}

function editorError(error: unknown) {
  if (error instanceof EditorApiError) {
    return editorJson({ error: error.message }, error.status);
  }
  console.error('[editor/articles]', error);
  return editorJson({ error: 'Internal server error.' }, 500);
}
