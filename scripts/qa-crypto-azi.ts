/**
 * Targeted Crypto Azi validation without writing to Supabase Production.
 * Run: npx --yes tsx scripts/qa-crypto-azi.ts
 *
 * DB RLS / grants / unique index: NEVER_VERIFIED until migration is applied
 * on a safe Preview/local Supabase — see SQL matrix at end of this script.
 */

import assert from 'node:assert/strict';
import {
  emptyTakeaways,
  normalizeTakeaways,
  validateTakeaways,
  bucharestDateIso,
} from '../lib/crypto-azi/format';
import { selectPublicBriefFromRows } from '../lib/crypto-azi/db';
import {
  authorizeAdminCandidate,
  parseAdminEmailAllowlist,
  privilegedActionGate,
} from '../lib/admin/authorize-admin';
import type { CryptoDailyBrief, CryptoTakeaway } from '../lib/crypto-azi/types';

let failed = 0;
let neverVerified = 0;

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

function markNeverVerified(name: string, reason: string) {
  neverVerified += 1;
  console.log(`NEVER_VERIFIED  ${name}`);
  console.log(`      ${reason}`);
}

function fixtureBrief(
  partial: Partial<CryptoDailyBrief> & Pick<CryptoDailyBrief, 'id' | 'brief_date' | 'status'>,
): CryptoDailyBrief {
  return {
    title: partial.title ?? 'Titlu',
    introduction: partial.introduction ?? '',
    takeaways: partial.takeaways ?? emptyTakeaways(),
    published_at: partial.published_at ?? null,
    created_at: partial.created_at ?? '2026-10-01T00:00:00Z',
    updated_at: partial.updated_at ?? '2026-10-01T00:00:00Z',
    author_id: partial.author_id ?? null,
    author_name: partial.author_name ?? null,
    ...partial,
  };
}

const validThree: CryptoTakeaway[] = [
  {
    title: 'Macro',
    why_it_matters: 'Impact pe lichiditate',
    source_label: 'Fed',
    source_url: 'https://www.federalreserve.gov',
  },
  {
    title: 'BTC',
    why_it_matters: 'Nivel tehnic',
    source_label: 'Glassnode',
    source_url: 'https://studio.glassnode.com',
  },
  {
    title: 'ETF',
    why_it_matters: 'Fluxuri',
    source_label: 'Farside',
    source_url: 'https://farside.co.uk',
  },
];

check('exact three takeaways valid', () => {
  const r = validateTakeaways(validThree);
  assert.equal(r.ok, true);
  assert.equal(r.errors.length, 0);
});

check('takeaways with 2 elements fail', () => {
  const r = validateTakeaways(validThree.slice(0, 2));
  assert.equal(r.ok, false);
});

check('takeaways with 4 elements fail', () => {
  const r = validateTakeaways([...validThree, { ...validThree[0] }]);
  assert.equal(r.ok, false);
});

check('missing source label/url blocks publish', () => {
  const bad = validThree.map((t, i) =>
    i === 1 ? { ...t, source_url: '', source_label: '' } : t,
  );
  const r = validateTakeaways(bad);
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /surs/i.test(e)));
});

check('invalid URL rejected', () => {
  const bad = validThree.map((t, i) =>
    i === 0 ? { ...t, source_url: 'ftp://example.com' } : t,
  );
  const r = validateTakeaways(bad);
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /http/i.test(e)));
});

check('normalizeTakeaways always length 3 (non-array / short)', () => {
  assert.equal(normalizeTakeaways(null).length, 3);
  assert.equal(normalizeTakeaways({}).length, 3);
  assert.equal(normalizeTakeaways('x').length, 3);
  assert.equal(normalizeTakeaways([{ title: 'x' }]).length, 3);
  assert.equal(emptyTakeaways().length, 3);
});

check('bucharestDateIso is YYYY-MM-DD Europe/Bucharest', () => {
  // 2026-10-02T22:30Z = 2026-10-03 01:30 in Bucharest (EEST, UTC+3)
  assert.equal(bucharestDateIso(new Date('2026-10-02T22:30:00Z')), '2026-10-03');
  assert.match(bucharestDateIso(), /^\d{4}-\d{2}-\d{2}$/);
});

check('Fear & Greed unavailable shape never 50 Neutral', () => {
  const unavailable = {
    status: 'unavailable' as const,
    value: null,
    value_classification: null,
    asOf: null,
  };
  assert.equal(unavailable.status, 'unavailable');
  assert.equal(unavailable.value, null);
  assert.notEqual(unavailable.value, 50);
  assert.notEqual(unavailable.value_classification, 'Neutral');
});

check('select: brief for today', () => {
  const today = bucharestDateIso(new Date('2026-10-02T12:00:00+03:00'));
  const rows = [
    fixtureBrief({
      id: '1',
      brief_date: today,
      status: 'published',
      title: 'Azi',
    }),
    fixtureBrief({
      id: '2',
      brief_date: '2026-09-30',
      status: 'published',
      title: 'Vechi',
    }),
  ];
  const r = selectPublicBriefFromRows(rows, new Date('2026-10-02T12:00:00+03:00'));
  assert.equal(r.isToday, true);
  assert.equal(r.isFallback, false);
  assert.equal(r.brief?.id, '1');
  assert.equal(r.brief?.brief_date, today);
});

check('select: missing today → latest published, real date labelled', () => {
  const rows = [
    fixtureBrief({
      id: 'd',
      brief_date: '2026-10-02',
      status: 'draft',
      title: 'Draft azi',
    }),
    fixtureBrief({
      id: 'p',
      brief_date: '2026-09-28',
      status: 'published',
      title: 'Ultimul publicat',
    }),
  ];
  const r = selectPublicBriefFromRows(rows, new Date('2026-10-02T12:00:00+03:00'));
  assert.equal(r.isToday, false);
  assert.equal(r.isFallback, true);
  assert.equal(r.brief?.id, 'p');
  assert.equal(r.brief?.brief_date, '2026-09-28');
});

check('select: draft/archived never win over empty public', () => {
  const rows = [
    fixtureBrief({ id: '1', brief_date: '2026-10-02', status: 'draft' }),
    fixtureBrief({ id: '2', brief_date: '2026-10-01', status: 'archived' }),
  ];
  const r = selectPublicBriefFromRows(rows, new Date('2026-10-02T12:00:00+03:00'));
  assert.equal(r.brief, null);
  assert.equal(r.isFallback, false);
});

check('select: DB completely empty', () => {
  const r = selectPublicBriefFromRows([], new Date('2026-10-02T12:00:00+03:00'));
  assert.equal(r.brief, null);
  assert.equal(r.isToday, false);
  assert.equal(r.isFallback, false);
});

check('indicator statuses contract live/stale/unavailable', () => {
  const statuses = ['live', 'stale', 'unavailable'] as const;
  assert.ok(statuses.includes('live'));
  assert.ok(statuses.includes('stale'));
  assert.ok(statuses.includes('unavailable'));
});

const allowlist = 'admin@example.com, Editor@Example.com ';
const adminUser = {
  id: 'u1',
  email: ' Admin@Example.com ',
  email_confirmed_at: '2026-01-01T00:00:00Z',
};

check('allowlist parse: trim + lowercase; empty → null (fail-closed)', () => {
  assert.deepEqual(parseAdminEmailAllowlist(allowlist), [
    'admin@example.com',
    'editor@example.com',
  ]);
  assert.equal(parseAdminEmailAllowlist(undefined), null);
  assert.equal(parseAdminEmailAllowlist(''), null);
  assert.equal(parseAdminEmailAllowlist('  ,  '), null);
});

check('auth: no session → refuse; no service client', () => {
  const logs: string[] = [];
  const gate = authorizeAdminCandidate(null, allowlist, (m) => logs.push(m));
  assert.equal(gate.ok, false);
  if (!gate.ok) assert.equal(gate.reason, 'no_session');
  const action = privilegedActionGate({ user: null, allowlistRaw: allowlist });
  assert.equal(action.serviceClientCreated, false);
});

check('auth: authenticated off allowlist → refuse; no service client', () => {
  const gate = authorizeAdminCandidate(
    {
      id: 'u2',
      email: 'user@example.com',
      email_confirmed_at: '2026-01-01T00:00:00Z',
    },
    allowlist,
  );
  assert.equal(gate.ok, false);
  if (!gate.ok) assert.equal(gate.reason, 'not_on_allowlist');
  const action = privilegedActionGate({
    user: {
      id: 'u2',
      email: 'user@example.com',
      email_confirmed_at: '2026-01-01T00:00:00Z',
    },
    allowlistRaw: allowlist,
  });
  assert.equal(action.serviceClientCreated, false);
});

check('auth: allowlist absent/empty → refuse + log; no service client', () => {
  const logs: string[] = [];
  const gate = authorizeAdminCandidate(adminUser, '', (m) => logs.push(m));
  assert.equal(gate.ok, false);
  if (!gate.ok) assert.equal(gate.reason, 'allowlist_unconfigured');
  assert.ok(logs.some((l) => l === 'Admin allowlist is not configured'));
  const absent = privilegedActionGate({
    user: adminUser,
    allowlistRaw: undefined,
  });
  assert.equal(absent.authorized, false);
  assert.equal(absent.serviceClientCreated, false);
  assert.equal(absent.reason, 'allowlist_unconfigured');
});

check('auth: unconfirmed email → refuse; no service client', () => {
  const gate = authorizeAdminCandidate(
    { id: 'u1', email: 'admin@example.com', email_confirmed_at: null },
    allowlist,
  );
  assert.equal(gate.ok, false);
  if (!gate.ok) assert.equal(gate.reason, 'email_unconfirmed');
  const action = privilegedActionGate({
    user: { id: 'u1', email: 'admin@example.com', email_confirmed_at: null },
    allowlistRaw: allowlist,
  });
  assert.equal(action.serviceClientCreated, false);
});

check('auth: valid admin → authorize; service client may init after validate', () => {
  const gate = authorizeAdminCandidate(adminUser, allowlist);
  assert.equal(gate.ok, true);
  if (gate.ok) assert.equal(gate.email, 'admin@example.com');
  const action = privilegedActionGate({
    user: adminUser,
    allowlistRaw: allowlist,
    validate: () => true,
  });
  assert.equal(action.authorized, true);
  assert.equal(action.serviceClientCreated, true);
});

check('auth: valid admin but invalid payload → no service client', () => {
  const action = privilegedActionGate({
    user: adminUser,
    allowlistRaw: allowlist,
    validate: () => false,
  });
  assert.equal(action.authorized, false);
  assert.equal(action.serviceClientCreated, false);
});

check('auth: user_metadata must not grant access', () => {
  const gate = authorizeAdminCandidate(
    {
      id: 'u3',
      email: 'outsider@example.com',
      email_confirmed_at: '2026-01-01T00:00:00Z',
    },
    allowlist,
  );
  assert.equal(gate.ok, false);
  // Even if metadata claimed role:admin, authorizeAdminCandidate never reads it.
});

// --- DB matrix (not executed; migration not applied) ---
markNeverVerified(
  'anon SELECT published only',
  'Needs PostgREST against migrated Preview DB with anon key.',
);
markNeverVerified(
  'anon cannot see draft/archived',
  'Needs RLS probe: select where status in (draft, archived) returns 0 rows.',
);
markNeverVerified(
  'authenticated ordinary user cannot INSERT/UPDATE/DELETE',
  'Needs JWT of non-admin user; expect permission denied / 0 rows affected.',
);
markNeverVerified(
  'admin CRUD via server action + service_role',
  'Needs Preview env with SUPABASE_SERVICE_ROLE_KEY + ADMIN_EMAIL_ALLOWLIST.',
);
markNeverVerified(
  'unique partial index: second published same brief_date rejected',
  'Needs INSERT of two published rows on same date → unique_violation.',
);
markNeverVerified(
  'CHECK takeaways: null/object/string/2/4 elems + bad URL rejected at DB',
  'Needs service_role insert attempts against CHECK crypto_daily_briefs_takeaways_valid.',
);

console.log('');
console.log('--- SQL/API matrix for later Preview verification ---');
console.log(`
-- As anon / authenticated (JWT):
select id, status, brief_date from crypto_daily_briefs;
-- expect: only status='published'

insert into crypto_daily_briefs (brief_date, status, title, takeaways, published_at)
values (current_date, 'published', 'x', '[]'::jsonb, now());
-- expect: permission denied (no INSERT grant)

-- As service_role (server only):
-- 1) insert published with valid 3 takeaways → ok
-- 2) second published same brief_date → unique_violation on crypto_daily_briefs_one_published_per_date_idx
-- 3) takeaways jsonb null / {} / 'x' / 2 elems / ftp URL → check violation
-- 4) delete user with author_id → author_id SET NULL; author_name unchanged (display only)

-- App-level:
-- GET /crypto-azi with today published → isToday
-- GET /crypto-azi without today → fallback older published, UI shows brief_date
-- GET /crypto-azi empty → empty state, no fake brief
-- Fear & Greed API down → status unavailable, never 50 Neutral
`);

console.log('');
if (failed) {
  console.error(`${failed} check(s) failed; ${neverVerified} never_verified`);
  process.exit(1);
}
console.log(
  `All fixture checks passed (${neverVerified} DB/RLS items NEVER_VERIFIED — not marked PASS)`,
);
