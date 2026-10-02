/**
 * Targeted product-correctness checks with simulated data only.
 * No writes to Supabase / production.
 *
 * Run: npx --yes tsx scripts/qa-product-correctness.ts
 */

import assert from 'node:assert/strict';
import { formatFlowMillions } from '../lib/etf/format';
import {
  formatPulseTimestamp,
  getPulseFreshnessStatus,
} from '../lib/market-pulse-freshness';

let failed = 0;

function check(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS  ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL  ${name}`);
    console.error(`      ${(err as Error).message}`);
  }
}

async function checkAsync(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`PASS  ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL  ${name}`);
    console.error(`      ${(err as Error).message}`);
  }
}

check('ETF: real zero formats as 0.0M (valid zero)', () => {
  assert.equal(formatFlowMillions(0), '0.0M');
});

check('ETF: positive total formats with +', () => {
  assert.equal(formatFlowMillions(1_500_000), '+1.5M');
});

check('ETF: empty series decision ≠ zero display', () => {
  const data: { net_flow_usd: number }[] = [];
  const error = null;
  const showUnavailable = !error && data.length === 0;
  const showZero = data.length > 0 && data.every((r) => r.net_flow_usd === 0);
  assert.equal(showUnavailable, true);
  assert.equal(showZero, false);
});

check('ETF: error path preferred over unavailable', () => {
  const data: { net_flow_usd: number }[] = [];
  const error = 'upstream timeout';
  const showError = Boolean(error);
  const showUnavailable = !error && data.length === 0;
  assert.equal(showError, true);
  assert.equal(showUnavailable, false);
});

check('ETF: valid total with real zeros still renders total', () => {
  const rows = [{ net_flow_usd: 0 }, { net_flow_usd: 0 }];
  const total = rows.reduce((a, r) => a + r.net_flow_usd, 0);
  assert.equal(formatFlowMillions(total), '0.0M');
  assert.equal(rows.length > 0, true);
});

{
  const now = new Date('2026-10-02T12:00:00.000Z');

  check('Market Pulse: missing timestamp → unknown', () => {
    assert.equal(getPulseFreshnessStatus(null, now), 'unknown');
    assert.equal(getPulseFreshnessStatus('', now), 'unknown');
    assert.equal(getPulseFreshnessStatus('not-a-date', now), 'unknown');
  });

  check('Market Pulse: recent → fresh', () => {
    assert.equal(getPulseFreshnessStatus('2026-10-02T06:00:00.000Z', now), 'fresh');
  });

  check('Market Pulse: expired (>24h) → archived', () => {
    assert.equal(getPulseFreshnessStatus('2026-07-06T09:31:00.000Z', now), 'archived');
  });

  check('Market Pulse: missing timestamp display fallback', () => {
    const formatted = formatPulseTimestamp(null);
    assert.equal(formatted.dateTime, null);
    assert.match(formatted.display, /necunoscut/i);
  });
}

function resolveScreenerSource({
  fetchOk,
  coins,
  lastGood,
}: {
  fetchOk: boolean;
  coins: { id: string }[];
  lastGood: { coins: { id: string }[]; fetchedAt: string } | null;
}) {
  if (fetchOk && Array.isArray(coins) && coins.length > 0) {
    return { source: 'coingecko' as const, coins };
  }
  if (lastGood?.coins?.length) {
    return { source: 'stale' as const, coins: lastGood.coins };
  }
  return { source: 'unavailable' as const, coins: [] as { id: string }[] };
}

check('CoinGecko: live', () => {
  const r = resolveScreenerSource({
    fetchOk: true,
    coins: [{ id: 'bitcoin' }],
    lastGood: null,
  });
  assert.equal(r.source, 'coingecko');
  assert.equal(r.coins.length, 1);
});

check('CoinGecko: stale fallback', () => {
  const r = resolveScreenerSource({
    fetchOk: false,
    coins: [],
    lastGood: { coins: [{ id: 'bitcoin' }], fetchedAt: '2026-10-01T00:00:00.000Z' },
  });
  assert.equal(r.source, 'stale');
  assert.equal(r.coins.length, 1);
});

check('CoinGecko: unavailable (no demo)', () => {
  const r = resolveScreenerSource({ fetchOk: false, coins: [], lastGood: null });
  assert.equal(r.source, 'unavailable');
  assert.equal(r.coins.length, 0);
  assert.equal(JSON.stringify(r.coins).includes('Demo'), false);
});

const WAITLIST_SUCCESS = 'Înscrierea pe lista de așteptare a fost înregistrată.';
const WAITLIST_DUPLICATE = 'Această adresă este deja pe lista de așteptare.';

function simulateSubscribeResponse({
  insertErrorCode,
  insertThrows,
}: {
  insertErrorCode?: string;
  insertThrows?: boolean;
}) {
  if (insertThrows) {
    return {
      status: 503,
      body: { error: 'Serviciul de listă de așteptare nu este disponibil momentan.' },
    };
  }
  if (insertErrorCode === '23505') {
    return {
      status: 200,
      body: {
        success: true,
        message: WAITLIST_DUPLICATE,
        alreadySubscribed: true,
      },
    };
  }
  if (insertErrorCode) {
    return {
      status: 500,
      body: { error: 'Nu am putut înregistra înscrierea. Încearcă din nou.' },
    };
  }
  return { status: 200, body: { success: true, message: WAITLIST_SUCCESS } };
}

check('Newsletter: simulated success message', () => {
  const r = simulateSubscribeResponse({});
  assert.equal(r.status, 200);
  assert.equal(r.body.message, WAITLIST_SUCCESS);
  assert.equal(/inbox|verific/i.test(JSON.stringify(r.body)), false);
});

check('Newsletter: simulated duplicate message', () => {
  const r = simulateSubscribeResponse({ insertErrorCode: '23505' });
  assert.equal(r.body.message, WAITLIST_DUPLICATE);
  assert.equal((r.body as { alreadySubscribed?: boolean }).alreadySubscribed, true);
});

check('Newsletter: simulated save error (no false success)', () => {
  const r = simulateSubscribeResponse({ insertErrorCode: '42P01' });
  assert.equal(r.status, 500);
  assert.equal((r.body as { success?: boolean }).success, undefined);
  assert.match((r.body as { error: string }).error, /înregistra|Încearcă/i);
});

async function runLiveApiChecks() {
  await checkAsync('Premium: POST /api/premium/checkout → 503 (no insert)', async () => {
    const base = process.env.QA_BASE_URL || 'http://localhost:3010';
    let res: Response;
    try {
      res = await fetch(`${base}/api/premium/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset: 'BTC', email: 'qa-no-write@example.com' }),
      });
    } catch (err) {
      assert.fail(`Server unreachable at ${base}: ${(err as Error).message}`);
    }
    assert.equal(res.status, 503);
    const body = (await res.json()) as { error?: string };
    assert.match(body.error || '', /indisponibile/i);
  });

  await checkAsync('Newsletter: invalid email → 400 without DB write', async () => {
    const base = process.env.QA_BASE_URL || 'http://localhost:3010';
    let res: Response;
    try {
      res = await fetch(`${base}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'not-an-email' }),
      });
    } catch (err) {
      assert.fail(`Server unreachable at ${base}: ${(err as Error).message}`);
    }
    assert.equal(res.status, 400);
    const body = (await res.json()) as { error?: string };
    assert.ok(body.error);
  });
}

runLiveApiChecks().then(() => {
  console.log('');
  if (failed) {
    console.error(`${failed} check(s) failed`);
    process.exit(1);
  }
  console.log('All simulated QA checks passed');
});
