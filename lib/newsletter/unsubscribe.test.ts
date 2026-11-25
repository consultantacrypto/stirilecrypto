import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { runUnsubscribeLinkCli, selectUnsubscribeAudience } from './link-cli';
import { createSubscriberDirectory, type SubscriberDirectory } from './store';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  createUnsubscribeToken,
  unsubscribeUrls,
  verifyUnsubscribeToken,
} from './token';
import {
  confirmUnsubscribe,
  handleUnsubscribePost,
  methodNotAllowed,
  resolveUnsubscribePage,
  type UnsubscribeStore,
} from './unsubscribe';

const SECRET = 'newsletter-unsubscribe-secret-value';
const OTHER_SECRET = 'another-newsletter-unsubscribe-secret';
const ID = '11111111-1111-4111-8111-111111111111';
const OTHER_ID = '22222222-2222-4222-8222-222222222222';
const EMAIL = 'reader@example.com';
const NOW = new Date('2026-11-25T08:00:00.000Z');

function store(overrides: Partial<UnsubscribeStore> = {}): UnsubscribeStore & {
  calls: { find: string[]; mark: Array<{ id: string; atIso: string }> };
} {
  const calls = { find: [] as string[], mark: [] as Array<{ id: string; atIso: string }> };
  return {
    calls,
    async findSubscriber(id) {
      calls.find.push(id);
      return overrides.findSubscriber ? overrides.findSubscriber(id) : { ok: true, row: { id, unsubscribedAt: null } };
    },
    async markUnsubscribed(id, atIso) {
      calls.mark.push({ id, atIso });
      return overrides.markUnsubscribed
        ? overrides.markUnsubscribed(id, atIso)
        : { ok: true, changed: true };
    },
  };
}

describe('unsubscribe token', () => {
  it('round-trips a subscriber id and hides the email', () => {
    const links = unsubscribeUrls({ id: ID, secret: SECRET, origin: 'https://www.stirilecrypto.ro' });
    assert.equal(verifyUnsubscribeToken(links.token, SECRET, NOW).ok, true);
    assert.equal(links.token.includes(EMAIL), false);
    assert.equal(links.token.includes('example.com'), false);
    assert.equal(links.pageUrl.startsWith('https://www.stirilecrypto.ro/newsletter/dezabonare?token='), true);
    assert.equal(links.oneClickUrl.includes('/api/newsletter/unsubscribe?token='), true);
    assert.equal(links.listUnsubscribeHeader, `<${links.oneClickUrl}>`);
    assert.equal(links.listUnsubscribePostHeader, 'List-Unsubscribe=One-Click');

    const payload = JSON.parse(Buffer.from(links.token.split('.')[0], 'base64url').toString('utf8')) as {
      id?: string;
      email?: string;
    };
    assert.equal(payload.id, ID);
    assert.equal(payload.email, undefined);
  });

  it('rejects tampering, the wrong secret, a foreign id, and an email used as an id', () => {
    const token = createUnsubscribeToken({ id: ID, secret: SECRET });
    const [payload, signature] = token.split('.');
    assert.equal(verifyUnsubscribeToken(`${payload}x.${signature}`, SECRET).ok, false);
    assert.equal(verifyUnsubscribeToken(`${payload}.${signature}x`, SECRET).ok, false);
    assert.equal(verifyUnsubscribeToken(token, OTHER_SECRET).ok, false);
    assert.notEqual(createUnsubscribeToken({ id: ID, secret: SECRET }), createUnsubscribeToken({ id: OTHER_ID, secret: SECRET }));
    assert.throws(() => createUnsubscribeToken({ id: EMAIL, secret: SECRET }));
    assert.throws(() => unsubscribeUrls({ id: ID, secret: SECRET, origin: 'http://evil.example' }));
    assert.throws(() => unsubscribeUrls({ id: ID, secret: SECRET, origin: 'https://www.stirilecrypto.ro/newsletter' }));
  });

  it('honours exp and leaves tokens without exp valid', () => {
    const expired = createUnsubscribeToken({
      id: ID,
      secret: SECRET,
      exp: Math.floor(NOW.getTime() / 1000) - 5,
    });
    const fresh = createUnsubscribeToken({
      id: ID,
      secret: SECRET,
      exp: Math.floor(NOW.getTime() / 1000) + 60,
    });
    assert.deepEqual(verifyUnsubscribeToken(expired, SECRET, NOW), { ok: false, reason: 'expired' });
    assert.equal(verifyUnsubscribeToken(fresh, SECRET, NOW).ok, true);
    assert.equal(verifyUnsubscribeToken(createUnsubscribeToken({ id: ID, secret: SECRET }), SECRET, NOW).ok, true);
  });

  it('rejects a signed payload that includes an email', () => {
    const encoded = Buffer.from(JSON.stringify({ v: 1, id: ID, email: EMAIL }), 'utf8').toString('base64url');
    const signature = createHmac('sha256', SECRET)
      .update(`newsletter-unsubscribe.${encoded}`)
      .digest('base64url');
    assert.deepEqual(verifyUnsubscribeToken(`${encoded}.${signature}`, SECRET, NOW), {
      ok: false,
      reason: 'invalid',
    });
  });
});

describe('unsubscribe confirmation', () => {
  it('does not open the store for a bad token', async () => {
    let opened = 0;
    const result = await confirmUnsubscribe({
      token: 'not-a-token',
      secret: SECRET,
      now: NOW,
      getStore: () => {
        opened += 1;
        return store();
      },
    });
    assert.equal(result, 'invalid');
    assert.equal(opened, 0);
  });

  it('marks the subscriber once and does not write when they are already unsubscribed', async () => {
    const active = store();
    assert.equal(
      await confirmUnsubscribe({
        token: createUnsubscribeToken({ id: ID, secret: SECRET }),
        secret: SECRET,
        now: NOW,
        getStore: () => active,
      }),
      'unsubscribed',
    );
    assert.deepEqual(active.calls.find, [ID]);
    assert.equal(active.calls.mark.length, 1);
    assert.equal(active.calls.mark[0].id, ID);
    assert.equal(active.calls.mark[0].atIso.includes(EMAIL), false);

    const done = store({
      async findSubscriber(id) {
        return { ok: true, row: { id, unsubscribedAt: '2026-11-01T00:00:00.000Z' } };
      },
    });
    assert.equal(
      await confirmUnsubscribe({
        token: createUnsubscribeToken({ id: ID, secret: SECRET }),
        secret: SECRET,
        now: NOW,
        getStore: () => done,
      }),
      'already',
    );
    assert.equal(done.calls.mark.length, 0);
  });

  it('reports an unknown id, a missing secret, and a failed write without claiming success', async () => {
    const missing = store({
      async findSubscriber() {
        return { ok: true, row: null };
      },
    });
    assert.equal(
      await confirmUnsubscribe({
        token: createUnsubscribeToken({ id: ID, secret: SECRET }),
        secret: SECRET,
        getStore: () => missing,
      }),
      'invalid',
    );
    assert.equal(missing.calls.mark.length, 0);

    assert.equal(
      await confirmUnsubscribe({
        token: createUnsubscribeToken({ id: ID, secret: SECRET }),
        secret: null,
        getStore: () => store(),
      }),
      'unavailable',
    );

    const failed = store({
      async markUnsubscribed() {
        return { ok: false };
      },
    });
    assert.equal(
      await confirmUnsubscribe({
        token: createUnsubscribeToken({ id: ID, secret: SECRET }),
        secret: SECRET,
        getStore: () => failed,
      }),
      'unavailable',
    );
  });
});

describe('unsubscribe page', () => {
  it('renders a confirmation for a valid token and does not look up when the secret is missing', async () => {
    const token = createUnsubscribeToken({ id: ID, secret: SECRET });
    let lookups = 0;
    const state = await resolveUnsubscribePage({
      token,
      secret: SECRET,
      now: NOW,
      findSubscriber: async (id) => {
        lookups += 1;
        return { ok: true, row: { id, unsubscribedAt: null } };
      },
    });
    assert.deepEqual(state, { kind: 'confirm', token });
    assert.equal(lookups, 1);

    let blocked = 0;
    const unavailable = await resolveUnsubscribePage({
      token,
      secret: null,
      findSubscriber: async () => {
        blocked += 1;
        return { ok: true, row: null };
      },
    });
    assert.deepEqual(unavailable, { kind: 'unavailable' });
    assert.equal(blocked, 0);
  });

  it('shows already-unsubscribed, expired, and invalid states, and ignores the database after a redirect', async () => {
    const token = createUnsubscribeToken({ id: ID, secret: SECRET });
    const already = await resolveUnsubscribePage({
      token,
      secret: SECRET,
      findSubscriber: async (id) => ({ ok: true, row: { id, unsubscribedAt: '2026-11-01T00:00:00.000Z' } }),
    });
    assert.deepEqual(already, { kind: 'already' });

    const expiredToken = createUnsubscribeToken({
      id: ID,
      secret: SECRET,
      exp: Math.floor(NOW.getTime() / 1000) - 1,
    });
    assert.deepEqual(
      await resolveUnsubscribePage({ token: expiredToken, secret: SECRET, now: NOW }),
      { kind: 'expired' },
    );
    assert.deepEqual(await resolveUnsubscribePage({ token: 'nope', secret: SECRET }), { kind: 'invalid' });

    let lookups = 0;
    const redirected = await resolveUnsubscribePage({
      token,
      result: 'unsubscribed',
      secret: SECRET,
      findSubscriber: async () => {
        lookups += 1;
        return { ok: false };
      },
    });
    assert.deepEqual(redirected, { kind: 'unsubscribed' });
    assert.equal(lookups, 0);
  });

  it('keeps the page on a read and the POST route on the confirmation', () => {
    const page = readFileSync(new URL('../../app/newsletter/dezabonare/page.tsx', import.meta.url), 'utf8');
    const route = readFileSync(new URL('../../app/api/newsletter/unsubscribe/route.ts', import.meta.url), 'utf8');
    const directory = readFileSync(new URL('./store.ts', import.meta.url), 'utf8');
    const script = readFileSync(new URL('../../scripts/unsubscribe-link.ts', import.meta.url), 'utf8');

    assert.equal(page.includes('confirmUnsubscribe'), false);
    assert.equal(page.includes('markUnsubscribed'), false);
    assert.equal(page.includes('.update('), false);
    assert.equal(page.includes('method="post"'), true);
    assert.equal(page.includes('name="confirm"'), true);
    assert.equal(page.includes('Doar deschiderea acestui link nu te dezabonează.'), true);
    assert.equal(page.includes('Te-ai dezabonat. Nu vei mai primi newsletterul Știrile Crypto.'), true);
    assert.equal(page.includes("const HOME_URL = 'https://www.stirilecrypto.ro'"), true);
    assert.equal(page.includes('<HomeLink />'), true);

    assert.equal(route.includes('export function GET()'), true);
    assert.equal(route.includes('methodNotAllowed'), true);
    assert.equal(route.includes('confirmUnsubscribe'), true);

    const directoryBody = directory.slice(directory.indexOf('export function createSubscriberDirectory'));
    assert.equal(directoryBody.includes('.update('), false);
    assert.equal(directoryBody.includes('.insert('), false);
    assert.equal(directoryBody.includes('.delete('), false);
    assert.equal(script.includes('.update('), false);
    assert.equal(script.includes('.insert('), false);
    assert.equal(script.includes('.delete('), false);
  });
});

describe('unsubscribe HTTP', () => {
  it('rejects GET and a POST that is not a confirmation or one-click', async () => {
    const get = methodNotAllowed();
    assert.equal(get.status, 405);
    assert.equal(get.headers.get('allow'), 'POST');

    let calls = 0;
    const response = await handleUnsubscribePost(
      new Request('https://www.stirilecrypto.ro/api/newsletter/unsubscribe?token=abc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'token=abc',
      }),
      {
        secret: SECRET,
        perform: async () => {
          calls += 1;
          return 'unsubscribed';
        },
      },
    );
    assert.equal(response.status, 400);
    assert.equal(calls, 0);
  });

  it('redirects a confirmed POST and returns 200 for RFC 8058 one-click', async () => {
    const token = createUnsubscribeToken({ id: ID, secret: SECRET });
    const seen: string[] = [];
    const confirmed = await handleUnsubscribePost(
      new Request('https://www.stirilecrypto.ro/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ confirm: '1', token }).toString(),
      }),
      {
        secret: SECRET,
        perform: async (value) => {
          seen.push(value);
          return 'unsubscribed';
        },
      },
    );
    assert.equal(confirmed.status, 303);
    assert.equal(confirmed.headers.get('location'), '/newsletter/dezabonare?result=unsubscribed');

    const oneClick = await handleUnsubscribePost(
      new Request(`https://www.stirilecrypto.ro/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'List-Unsubscribe=One-Click',
      }),
      {
        secret: SECRET,
        perform: async (value) => {
          seen.push(value);
          return 'already';
        },
      },
    );
    assert.equal(oneClick.status, 200);
    assert.equal(await oneClick.text(), 'already');
    assert.deepEqual(seen, [token, token]);
  });
});

describe('unsubscribe link command', () => {
  const env = { NEWSLETTER_UNSUBSCRIBE_SECRET: SECRET } as unknown as NodeJS.ProcessEnv;

  it('prints a link from an id without calling the directory', async () => {
    let reads = 0;
    const lines: string[] = [];
    const lookup: SubscriberDirectory = {
      async findIdByEmail() {
        reads += 1;
        return null;
      },
      async list() {
        reads += 1;
        return { rows: [], unsubscribedColumn: true };
      },
    };
    const code = await runUnsubscribeLinkCli(['--id', ID], {
      env,
      lookup,
      stdout: (line) => lines.push(line),
      stderr: () => undefined,
    });
    assert.equal(code, 0);
    assert.equal(reads, 0);
    assert.equal(lines[0].startsWith('page_url\thttps://www.stirilecrypto.ro/newsletter/dezabonare?token='), true);
    assert.match(lines.join('\n'), /List-Unsubscribe\t</);
    assert.match(lines.join('\n'), /List-Unsubscribe-Post\tList-Unsubscribe=One-Click/);
    assert.equal(lines.join('\n').includes(EMAIL), false);
    assert.equal(lines.join('\n').includes(SECRET), false);
  });

  it('reads one email and refuses to run a lookup that was not provided', async () => {
    const lines: string[] = [];
    const errors: string[] = [];
    let reads = 0;
    const code = await runUnsubscribeLinkCli(['--email', ` ${EMAIL.toUpperCase()} `], {
      env,
      lookup: {
        async findIdByEmail(email) {
          reads += 1;
          assert.equal(email, EMAIL);
          return { id: ID };
        },
        async list() {
          throw new Error('list should not run');
        },
      },
      stdout: (line) => lines.push(line),
      stderr: (line) => errors.push(line),
    });
    assert.equal(code, 0);
    assert.equal(reads, 1);
    assert.equal(lines[0], `email\t${EMAIL}`);
    assert.equal(errors.length, 0);

    const missing = await runUnsubscribeLinkCli(['--all'], {
      env,
      stdout: () => undefined,
      stderr: (line) => errors.push(line),
    });
    assert.equal(missing, 1);
    assert.match(errors.at(-1) ?? '', /no read-only directory/i);
  });

  it('omits the test address and already-unsubscribed rows, and keeps the one-click headers', async () => {
    const lines: string[] = [];
    const errors: string[] = [];
    const gone = '44444444-4444-4444-8444-444444444444';
    const code = await runUnsubscribeLinkCli(['--all'], {
      env,
      lookup: {
        async findIdByEmail() {
          throw new Error('find should not run');
        },
        async list() {
          return {
            unsubscribedColumn: true,
            rows: [
              { id: ID, email: EMAIL, unsubscribedAt: null },
              { id: gone, email: 'Test@Example.com', unsubscribedAt: null },
              { id: OTHER_ID, email: 'gone@example.com', unsubscribedAt: '2026-11-01T00:00:00.000Z' },
            ],
          };
        },
      },
      stdout: (line) => lines.push(line),
      stderr: (line) => errors.push(line),
    });
    assert.equal(code, 0);
    assert.equal(lines[0], 'email\tpage_url\tone_click_url\tList-Unsubscribe\tList-Unsubscribe-Post');
    assert.equal(lines.length, 2);
    assert.match(lines[1], new RegExp(`^${EMAIL}\\t`));
    assert.match(lines[1], /List-Unsubscribe=One-Click/);
    assert.match(lines[1], /<https:\/\/www\.stirilecrypto\.ro\/api\/newsletter\/unsubscribe\?token=/);
    assert.equal(lines.join('\n').includes('test@example.com'), false);
    assert.equal(lines.join('\n').includes('gone@example.com'), false);
    assert.match(errors[0], /Listed 1 subscriber link\(s\)/);
    assert.match(errors[0], /Excluded 1 test address\(es\)/);
    assert.match(errors[0], /Excluded 1 already-unsubscribed row\(s\)/);
    assert.match(errors[0], /Read only/);
  });
});

describe('subscriber directory', () => {
  function listingClient(responses: Array<{ data: unknown; error: { code?: string; message?: string } | null }>) {
    const selects: string[] = [];
    const client = {
      from(table: string) {
        assert.equal(table, 'abonati');
        return {
          select(columns: string) {
            return {
              order() {
                const response = responses[selects.length];
                selects.push(columns);
                return Promise.resolve(response);
              },
              eq() {
                return this;
              },
              maybeSingle() {
                return Promise.resolve(responses[0]);
              },
            };
          },
        };
      },
    };
    return { client: client as unknown as SupabaseClient, selects };
  }

  it('reads unsubscribed_at when the column exists and does not write', async () => {
    const { client, selects } = listingClient([
      {
        data: [
          { id: ID, email: EMAIL, unsubscribed_at: null },
          { id: OTHER_ID, email: 'gone@example.com', unsubscribed_at: '2026-11-01T00:00:00.000Z' },
        ],
        error: null,
      },
    ]);
    const list = await createSubscriberDirectory(client).list();
    assert.deepEqual(selects, ['id, email, unsubscribed_at']);
    assert.equal(list.unsubscribedColumn, true);
    assert.equal(list.rows[1].unsubscribedAt, '2026-11-01T00:00:00.000Z');
    const audience = selectUnsubscribeAudience(list, ['test@example.com']);
    assert.equal(audience.included.length, 1);
    assert.equal(audience.excludedUnsubscribed, 1);
  });

  it('falls back to id and email when unsubscribed_at is missing', async () => {
    const { client, selects } = listingClient([
      { data: null, error: { code: '42703', message: 'column unsubscribed_at does not exist' } },
      { data: [{ id: ID, email: 'Test@Example.com' }, { id: OTHER_ID, email: EMAIL }], error: null },
    ]);
    const list = await createSubscriberDirectory(client).list();
    assert.deepEqual(selects, ['id, email, unsubscribed_at', 'id, email']);
    assert.equal(list.unsubscribedColumn, false);
    const audience = selectUnsubscribeAudience(list, ['test@example.com']);
    assert.deepEqual(
      audience.included.map((row) => row.email),
      [EMAIL],
    );
    assert.equal(audience.excludedTest, 1);
    assert.equal(audience.excludedUnsubscribed, 0);
  });
});
