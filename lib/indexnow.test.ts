import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import {
  indexNowKeyHttpResponse,
  indexNowUrlsForSlug,
  matchingIndexNowKey,
  notifyIndexNow,
  readIndexNowKey,
} from './indexnow';

const KEY = 'a'.repeat(32);
const originalFetch = globalThis.fetch;
const originalKey = process.env.INDEXNOW_KEY;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.INDEXNOW_KEY;
  else process.env.INDEXNOW_KEY = originalKey;
});

describe('IndexNow', () => {
  it('posts the host, key location, and article urls', async () => {
    process.env.INDEXNOW_KEY = KEY;
    const calls: { url: string; body: string }[] = [];
    globalThis.fetch = async (input, init) => {
      calls.push({
        url: String(input),
        body: String(init?.body ?? ''),
      });
      return new Response('OK', { status: 200 });
    };

    await notifyIndexNow(indexNowUrlsForSlug('bitcoin-100k'));

    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://api.indexnow.org/indexnow');
    assert.deepEqual(JSON.parse(calls[0].body), {
      host: 'www.stirilecrypto.ro',
      key: KEY,
      keyLocation: `https://www.stirilecrypto.ro/${KEY}.txt`,
      urlList: [
        'https://www.stirilecrypto.ro/stiri/bitcoin-100k',
        'https://www.stirilecrypto.ro/',
        'https://www.stirilecrypto.ro/stiri',
        'https://www.stirilecrypto.ro/hub/bitcoin',
        'https://www.stirilecrypto.ro/hub/mica',
        'https://www.stirilecrypto.ro/hub/securitate',
      ],
    });
  });

  it('does not throw when fetch fails or the key is missing', async () => {
    process.env.INDEXNOW_KEY = KEY;
    globalThis.fetch = async () => {
      throw new Error('network down');
    };
    await notifyIndexNow(['https://www.stirilecrypto.ro/stiri/x']);

    globalThis.fetch = async () => new Response('nope', { status: 422 });
    await notifyIndexNow(['https://www.stirilecrypto.ro/stiri/x']);

    delete process.env.INDEXNOW_KEY;
    let called = false;
    globalThis.fetch = async () => {
      called = true;
      return new Response('OK', { status: 200 });
    };
    await notifyIndexNow(['https://www.stirilecrypto.ro/stiri/x']);
    assert.equal(called, false);
    assert.equal(readIndexNowKey(), null);
    assert.equal(matchingIndexNowKey(KEY), null);
  });

  it('serves the key file only for the configured key', async () => {
    delete process.env.INDEXNOW_KEY;
    assert.equal(matchingIndexNowKey('anything'), null);

    process.env.INDEXNOW_KEY = KEY;
    assert.equal(matchingIndexNowKey(KEY), KEY);
    assert.equal(matchingIndexNowKey(`${KEY}.txt`), KEY);
    assert.equal(matchingIndexNowKey('not-the-key'), null);

    const response = indexNowKeyHttpResponse(`/${KEY}.txt`);
    assert.equal(response?.status, 200);
    assert.equal(await response?.text(), KEY);
    assert.equal(indexNowKeyHttpResponse('/robots.txt'), null);
    assert.equal(indexNowKeyHttpResponse('/llms.txt'), null);
  });
});
