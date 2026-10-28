import { NextResponse } from 'next/server';
import { btcChangeFromScreener, marketToneFromChange, marketToneLabel } from '@/lib/market-tone';
import { fetchScreenerData } from '@/lib/screener-data';

export const revalidate = 60;

/** BTC 24h direction from the Piața azi screener. Unknown when that feed is down. */
export async function GET() {
  const screener = await fetchScreenerData(15);
  const change24h = btcChangeFromScreener(screener);
  if (change24h === null) {
    return NextResponse.json({ tone: 'unknown', change24h: null, source: screener.source });
  }
  const tone = marketToneFromChange(change24h);
  return NextResponse.json({
    tone,
    change24h,
    label: marketToneLabel(tone),
    source: screener.source,
  });
}
