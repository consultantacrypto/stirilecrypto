import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Vercel Cron placeholder (GET).
 * Until an auto-scraper exists, this acknowledges the schedule and no-ops.
 * Secure with CRON_SECRET or ETF_SYNC_SECRET when configured.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET?.trim() || process.env.ETF_SYNC_SECRET?.trim();

  if (cronSecret) {
    const expected = `Bearer ${cronSecret}`;
    if (authHeader !== expected) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.json({
    success: true,
    mode: 'manual-pipeline',
    message:
      'ETF cron placeholder OK. Auto-scrape not configured — use /admin/etf for daily entry.',
    next: 'Wire Coinglass/SoSoValue scraper here when ready.',
  });
}
