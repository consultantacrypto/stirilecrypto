import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildLlmsTxt } from './llms-txt';

describe('llms.txt', () => {
  it('keeps the reference pages and formats the latest articles', () => {
    const body = buildLlmsTxt([
      {
        title: 'Bitcoin trece de 100.000',
        slug: 'bitcoin-100k',
        excerpt: 'Mișcarea vine după intrări în ETF-uri.',
        publishedAt: '2026-11-12T13:44:23Z',
      },
    ]);

    assert.match(body, /^# Știrile Crypto/);
    assert.match(body, /Operator: QuickExit, LLC\./);
    assert.match(body, /https:\/\/www\.stirilecrypto\.ro\/hub\/stiri-crypto-romania/);
    assert.match(body, /https:\/\/www\.stirilecrypto\.ro\/feed\.xml/);
    assert.match(
      body,
      /- \[Bitcoin trece de 100\.000\]\(https:\/\/www\.stirilecrypto\.ro\/stiri\/bitcoin-100k\): Mișcarea vine după intrări în ETF-uri\. \(2026-11-12\)/,
    );
    assert.match(body, /https:\/\/www\.stiriai\.ro/);
    assert.match(body, /https:\/\/www\.mihaidaniel\.ro/);
    assert.equal(body.includes('/llms.txt'), false);
  });
});
