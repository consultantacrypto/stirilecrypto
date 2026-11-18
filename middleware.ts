import { NextResponse, type NextRequest } from 'next/server';
import { indexNowKeyHttpResponse } from '@/lib/indexnow';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // `/{INDEXNOW_KEY}.txt` cannot be an App Router dynamic segment (a folder
  // named `[key].txt` is a literal path). Respond here only for the env key.
  if (request.nextUrl.pathname.endsWith('.txt')) {
    const keyFile = indexNowKeyHttpResponse(request.nextUrl.pathname);
    if (keyFile) return keyFile;
    return NextResponse.next();
  }

  return updateSession(request);
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/:indexnowKey.txt'],
};
