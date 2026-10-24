import { NextResponse } from 'next/server';
import { getPublishedFeedPage, HOME_FEED_PAGE_SIZE } from '@/lib/articles-db';

export const revalidate = 120;

function readInt(value: string | null, fallback: number, max: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.min(max, Math.floor(parsed));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = readInt(searchParams.get('offset'), 0, 5000);
  const limit = readInt(searchParams.get('limit'), HOME_FEED_PAGE_SIZE, 18);
  const page = await getPublishedFeedPage(offset, Math.max(12, limit));

  return NextResponse.json(page, {
    headers: {
      'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
    },
  });
}
