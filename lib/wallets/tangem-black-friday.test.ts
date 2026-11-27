import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import TangemBlackFridayBanner from '../../components/wallets/TangemBlackFridayBanner';
import {
  TANGEM_BLACK_FRIDAY_CODE,
  TANGEM_BLACK_FRIDAY_COPY,
  TANGEM_BLACK_FRIDAY_CUTOFF_ISO,
  TANGEM_BLACK_FRIDAY_CUTOFF_MS,
  TANGEM_BLACK_FRIDAY_HREF,
  TANGEM_BLACK_FRIDAY_REL,
  isTangemBlackFridayVisible,
  tangemBlackFridayExpiryScript,
  tangemBlackFridayHideCss,
} from './tangem-black-friday';

const COPY = 'Black Friday Tangem: până la 45% reducere cu codul BF2026, până pe 29.11';
const HREF = 'https://www.mihaidaniel.ro/r/tangem?s=sc';

function renderAt(now: number): string {
  return renderToStaticMarkup(createElement(TangemBlackFridayBanner, { now }));
}

describe('Tangem Black Friday banner', () => {
  it('is visible before and at the cutoff, and hidden after it', () => {
    assert.equal(TANGEM_BLACK_FRIDAY_CUTOFF_ISO, '2026-11-30T23:59:59Z');
    assert.equal(TANGEM_BLACK_FRIDAY_CUTOFF_MS, Date.parse('2026-11-30T23:59:59Z'));

    const before = Date.parse('2026-11-27T12:00:00Z');
    assert.equal(isTangemBlackFridayVisible(before), true);
    assert.equal(isTangemBlackFridayVisible(new Date(before)), true);
    assert.equal(isTangemBlackFridayVisible(TANGEM_BLACK_FRIDAY_CUTOFF_MS - 1), true);
    assert.equal(isTangemBlackFridayVisible(TANGEM_BLACK_FRIDAY_CUTOFF_MS), true);
    assert.equal(isTangemBlackFridayVisible(new Date(TANGEM_BLACK_FRIDAY_CUTOFF_MS)), true);
    assert.equal(isTangemBlackFridayVisible(TANGEM_BLACK_FRIDAY_CUTOFF_MS + 1), false);
    assert.equal(isTangemBlackFridayVisible(new Date('2026-12-01T00:00:00.000Z')), false);
    assert.equal(isTangemBlackFridayVisible(Number.NaN), false);

    assert.equal(renderAt(before).includes(`href="${HREF}"`), true);
    assert.equal(renderAt(TANGEM_BLACK_FRIDAY_CUTOFF_MS).includes(`href="${HREF}"`), true);
    assert.equal(renderAt(TANGEM_BLACK_FRIDAY_CUTOFF_MS + 1), '');
  });

  it('uses the offer href, the sponsored rel, and the 29.11 sentence without requesting the url', () => {
    assert.equal(TANGEM_BLACK_FRIDAY_HREF, HREF);
    assert.equal(TANGEM_BLACK_FRIDAY_COPY, COPY);
    assert.equal(TANGEM_BLACK_FRIDAY_CODE, 'BF2026');
    assert.equal(TANGEM_BLACK_FRIDAY_REL, 'sponsored noopener noreferrer');
    assert.equal(COPY.includes('30.11'), false);

    const calls: string[] = [];
    const original = globalThis.fetch;
    globalThis.fetch = (async (input: unknown) => {
      calls.push(String(input));
      throw new Error('network disabled in banner test');
    }) as typeof fetch;

    try {
      const html = renderAt(Date.parse('2026-11-27T12:00:00Z'));
      assert.equal(calls.length, 0);
      assert.equal(html.includes(`href="${HREF}"`), true);
      assert.match(html, /target="_blank"/);
      assert.match(html, /rel="sponsored noopener noreferrer"/);
      assert.equal(html.includes(COPY), true);
      assert.match(html, /data-tangem-bf-code=""[^>]*>BF2026</);
      const script = tangemBlackFridayExpiryScript();
      const css = tangemBlackFridayHideCss();
      assert.equal(html.includes(script), true);
      assert.equal(html.includes(css), true);
      assert.equal(script.includes(String(TANGEM_BLACK_FRIDAY_CUTOFF_MS)), true);
      assert.equal(script.includes('data-tangem-bf-off'), true);
      assert.equal(script.includes('http'), false);
      assert.equal(script.includes('/r/'), false);
      assert.equal(css.includes('http'), false);
    } finally {
      globalThis.fetch = original;
    }
  });
});
