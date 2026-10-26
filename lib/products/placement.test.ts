import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
  checkerCancelEmbedSrc,
  checkerFormEmbedSrc,
  checkerSuccessEmbedSrc,
  mentionedAsset,
  sanitizeAssetParam,
  sanitizeSource,
  withSource,
} from './placement';

describe('placement', () => {
  it('reads a safe asset and source', () => {
    assert.equal(sanitizeAssetParam(' btc '), 'BTC');
    assert.equal(sanitizeAssetParam('btc eth'), '');
    assert.equal(sanitizeSource('Article'), 'article');
    assert.equal(sanitizeSource('home page'), null);
  });

  it('picks the first known coin and ignores ordinary abbreviations', () => {
    assert.equal(mentionedAsset('ETF-urile din SUA urmăresc Bitcoin'), 'BTC');
    assert.equal(mentionedAsset('ETH a depășit BTC în volum'), 'ETH');
    assert.equal(mentionedAsset('Un salt de $SOL după știre'), 'SOL');
    assert.equal(mentionedAsset('SUA, ETF și CEO'), null);
  });

  it('adds src to internal and external links', () => {
    assert.equal(withSource('/analiza-tehnica?asset=BTC', 'article'), '/analiza-tehnica?asset=BTC&src=article');
    assert.equal(
      withSource('https://mihaidaniel.ro/verifica-adresa', 'nav'),
      'https://mihaidaniel.ro/verifica-adresa?src=nav',
    );
  });

  it('embeds the mihaidaniel checker and the Stripe return pages', () => {
    const previous = process.env.ADDRESS_CHECK_URL;
    delete process.env.ADDRESS_CHECK_URL;
    try {
      assert.equal(
        checkerFormEmbedSrc(),
        'https://www.mihaidaniel.ro/verifica-adresa?embed=1&source=stirilecrypto.ro',
      );
      assert.equal(
        checkerSuccessEmbedSrc('cs_test_123'),
        'https://www.mihaidaniel.ro/verifica-adresa/plata/succes?embed=1&session_id=cs_test_123',
      );
      assert.equal(
        checkerCancelEmbedSrc(),
        'https://www.mihaidaniel.ro/verifica-adresa/plata/anulata?embed=1&source=stirilecrypto.ro',
      );
    } finally {
      if (previous === undefined) delete process.env.ADDRESS_CHECK_URL;
      else process.env.ADDRESS_CHECK_URL = previous;
    }
  });

  it('uses ADDRESS_CHECK_URL as the embed origin when it is an http(s) URL', () => {
    const previous = process.env.ADDRESS_CHECK_URL;
    process.env.ADDRESS_CHECK_URL = 'https://preview.example/verifica-adresa';
    try {
      assert.equal(
        checkerFormEmbedSrc(),
        'https://preview.example/verifica-adresa?embed=1&source=stirilecrypto.ro',
      );
    } finally {
      if (previous === undefined) delete process.env.ADDRESS_CHECK_URL;
      else process.env.ADDRESS_CHECK_URL = previous;
    }
  });

  it('does not sandbox the payment iframe', () => {
    const frame = readFileSync(new URL('../../app/verifica-adresa/frame.tsx', import.meta.url), 'utf8');
    assert.equal(frame.includes('sandbox'), false);
    assert.equal(frame.includes('allow="payment"'), true);
  });
});
