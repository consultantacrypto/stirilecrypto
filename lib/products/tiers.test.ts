import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { defaultTier, isMajorAsset, resolveAnalysisTier } from './tiers';

describe('analysis tiers', () => {
  it('prices a top-30 coin at 79 RON, 7900 bani', () => {
    for (const asset of ['BTC', 'eth', 'SOL', 'XRP', 'BNB']) {
      const priced = resolveAnalysisTier(asset, 'major');
      assert.equal(priced.tier, 'major');
      assert.equal(priced.amountRon, 79);
      assert.equal(priced.amountBani, 7900);
      assert.equal(priced.forcedAltcoin, false);
    }
  });

  it('preselects from the asset when the buyer does not send a tier', () => {
    assert.equal(defaultTier('BTC'), 'major');
    assert.equal(defaultTier('PEPE'), 'altcoin');
    assert.equal(resolveAnalysisTier('LINK', null).amountBani, 7900);
    assert.equal(resolveAnalysisTier('XMPL', undefined).amountBani, 13900);
  });

  it('forces the altcoin price when the asset is outside the top 30', () => {
    const priced = resolveAnalysisTier('PEPE', 'major');
    assert.equal(priced.tier, 'altcoin');
    assert.equal(priced.amountRon, 139);
    assert.equal(priced.amountBani, 13900);
    assert.equal(priced.forcedAltcoin, true);
    assert.equal(isMajorAsset('PEPE'), false);
  });

  it('lets a top-30 buyer choose the altcoin price, and ignores a client amount', () => {
    const priced = resolveAnalysisTier('BTC', 'altcoin');
    assert.equal(priced.tier, 'altcoin');
    assert.equal(priced.amountBani, 13900);
    const spoofed = resolveAnalysisTier('BTC', 49);
    assert.equal(spoofed.amountBani, 7900);
  });

  it('treats the old TON ticker as Gram, a top-30 asset', () => {
    assert.equal(resolveAnalysisTier('TON', 'major').amountBani, 7900);
    assert.equal(resolveAnalysisTier('GRAM', null).amountBani, 7900);
  });
});
