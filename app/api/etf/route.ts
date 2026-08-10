import { NextResponse, type NextRequest } from 'next/server';
import { fetchEtfSnapshots } from '@/lib/etf/fetchEtfData';
import { isEtfAsset, isEtfPeriod } from '@/lib/etf/format';
import type { EtfApiError, EtfApiSuccess, EtfAssetSymbol, EtfPeriod } from '@/lib/etf/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assetParam = (searchParams.get('asset') ?? 'BTC').toUpperCase();
    const periodParam = (searchParams.get('period') ?? '5d').toLowerCase();

    if (!isEtfAsset(assetParam)) {
      const body: EtfApiError = { success: false, error: 'asset must be BTC or ETH' };
      return NextResponse.json(body, { status: 400 });
    }

    if (!isEtfPeriod(periodParam)) {
      const body: EtfApiError = { success: false, error: 'period must be 5d, 10d, 30d, or ytd' };
      return NextResponse.json(body, { status: 400 });
    }

    const asset = assetParam as EtfAssetSymbol;
    const period = periodParam as EtfPeriod;
    const data = await fetchEtfSnapshots(asset, period);
    const lastUpdated =
      data.length > 0 ? data[data.length - 1].snapshot_date : null;

    const body: EtfApiSuccess = {
      success: true,
      data,
      lastUpdated,
      period,
      asset,
    };

    return NextResponse.json(body, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      },
    });
  } catch (err) {
    console.error('[GET /api/etf]', err);
    const body: EtfApiError = { success: false, error: 'Failed to fetch ETF data' };
    return NextResponse.json(body, { status: 500 });
  }
}
