import { NextResponse, type NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { upsertEtfSnapshot } from '@/lib/etf/fetchEtfData';
import {
  billionsToUsd,
  isEtfAsset,
  millionsToUsd,
  toFiniteNumber,
} from '@/lib/etf/format';
import type { EtfAssetSymbol } from '@/lib/etf/types';

export const dynamic = 'force-dynamic';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

async function authorize(request: NextRequest, bodySecret: unknown): Promise<boolean> {
  const headerSecret =
    request.headers.get('x-etf-sync-secret') ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  const envSecret = process.env.ETF_SYNC_SECRET?.trim();
  if (envSecret) {
    if (headerSecret === envSecret) return true;
    if (typeof bodySecret === 'string' && bodySecret === envSecret) return true;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return Boolean(user);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Cerere invalidă.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ success: false, error: 'Cerere invalidă.' }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;

  if (!(await authorize(request, payload.secret))) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const assetRaw = typeof payload.asset === 'string' ? payload.asset.toUpperCase() : '';
  if (!isEtfAsset(assetRaw)) {
    return NextResponse.json(
      { success: false, error: 'asset trebuie să fie BTC sau ETH' },
      { status: 400 },
    );
  }
  const asset = assetRaw as EtfAssetSymbol;

  const snapshotDate =
    typeof payload.snapshot_date === 'string' ? payload.snapshot_date.trim() : '';
  if (!DATE_REGEX.test(snapshotDate)) {
    return NextResponse.json(
      { success: false, error: 'snapshot_date trebuie YYYY-MM-DD' },
      { status: 400 },
    );
  }

  // Accept either net_flow_m (millions) or net_flow_usd / net_flow (USD)
  let netFlowUsd: number | null = null;
  if (payload.net_flow_m !== undefined && payload.net_flow_m !== null && payload.net_flow_m !== '') {
    netFlowUsd = millionsToUsd(toFiniteNumber(payload.net_flow_m));
  } else if (payload.net_flow_usd !== undefined) {
    netFlowUsd = toFiniteNumber(payload.net_flow_usd);
  } else if (payload.net_flow !== undefined) {
    // Treat plain net_flow as millions when |value| < 10_000 (admin form convention)
    const raw = toFiniteNumber(payload.net_flow);
    netFlowUsd = Math.abs(raw) < 10_000 ? millionsToUsd(raw) : raw;
  }

  if (netFlowUsd === null || !Number.isFinite(netFlowUsd)) {
    return NextResponse.json(
      { success: false, error: 'net_flow / net_flow_m obligatoriu' },
      { status: 400 },
    );
  }

  let aumUsd: number | null = null;
  if (payload.aum_b !== undefined && payload.aum_b !== null && payload.aum_b !== '') {
    aumUsd = billionsToUsd(toFiniteNumber(payload.aum_b));
  } else if (payload.aum_usd !== undefined && payload.aum_usd !== null && payload.aum_usd !== '') {
    aumUsd = toFiniteNumber(payload.aum_usd);
  } else if (payload.aum !== undefined && payload.aum !== null && payload.aum !== '') {
    const raw = toFiniteNumber(payload.aum);
    aumUsd = Math.abs(raw) < 10_000 ? billionsToUsd(raw) : raw;
  }

  try {
    const data = await upsertEtfSnapshot({
      asset,
      snapshot_date: snapshotDate,
      net_flow_usd: netFlowUsd,
      aum_usd: aumUsd,
      source: 'manual',
    });

    try {
      revalidateTag('etf-snapshots', 'max');
    } catch (tagErr) {
      console.warn('[POST /api/etf/sync] revalidateTag', tagErr);
    }

    return NextResponse.json({
      success: true,
      message: 'ETF data synced successfully',
      data,
    });
  } catch (err) {
    console.error('[POST /api/etf/sync]', err);
    return NextResponse.json({ success: false, error: 'Sync failed' }, { status: 500 });
  }
}
