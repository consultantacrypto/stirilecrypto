import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mentionedAsset, sanitizeAssetParam, sanitizeSource, withSource } from './placement';

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
});
