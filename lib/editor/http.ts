import { NextRequest, NextResponse } from 'next/server';
import { bearerTokensMatch, readBearerToken } from '@/lib/editor/token';

export function editorJson(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

/** 503 when the token is unset, 401 otherwise. Returns null when the request is allowed. */
export function authorizeEditor(request: NextRequest): NextResponse | null {
  const expected = process.env.EDITOR_API_TOKEN?.trim() ?? '';
  if (!expected) {
    console.error('[editor] EDITOR_API_TOKEN is not set');
    return editorJson({ error: 'Editor API is not configured.' }, 503);
  }

  const provided = readBearerToken(request.headers.get('authorization'));
  if (!provided || !bearerTokensMatch(provided, expected)) {
    return editorJson({ error: 'Unauthorized' }, 401);
  }

  return null;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseArticleId(id: string): string | null {
  const trimmed = id.trim();
  return UUID_PATTERN.test(trimmed) ? trimmed : null;
}
