import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { validateOrder } from './intake';

const consent = {
  email: 'cititor@example.com',
  consent: true,
};

describe('validateOrder', () => {
  it('rejects a technical-analysis order without the withdrawal consent', () => {
    const result = validateOrder({
      product: 'ta_mtf',
      email: 'cititor@example.com',
      asset: 'BTC',
      consent: false,
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.error, /retragere/i);
  });

  it('accepts a technical-analysis waitlist', () => {
    const result = validateOrder({
      ...consent,
      intent: 'waitlist',
      product: 'ta_mtf',
      asset: 'eth',
      question: 'Ce structură vezi pe 1D?',
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.value.asset, 'ETH');
      assert.equal(result.value.risk, null);
      assert.equal(result.value.intent, 'waitlist');
    }
  });

  it('requires the risk intake when the products are bundled', () => {
    const result = validateOrder({
      ...consent,
      product: 'ta_mtf',
      bundle: true,
      asset: 'SOL',
    });
    assert.equal(result.ok, false);
  });

  it('accepts a full risk report with a native asset', () => {
    const result = validateOrder({
      ...consent,
      product: 'risk_report',
      coin: 'Exemplum',
      ticker: 'xmpl',
      network: 'Exemplaris',
      nativeAsset: true,
      why: 'Vreau să înțeleg concentrarea deținătorilor înainte să aloc timp research-ului.',
      holds: false,
      horizon: 'weeks',
      concerns: ['liquidity', 'scam', 'liquidity'],
      delivery: 'pdf',
      questions: 'Ce s-ar urmări la următoarea deblocare?',
    });
    assert.equal(result.ok, true);
    if (result.ok && result.value.risk) {
      assert.equal(result.value.risk.ticker, 'XMPL');
      assert.deepEqual(result.value.risk.concerns, ['liquidity', 'scam']);
      assert.equal(result.value.risk.contractAddress, null);
    }
  });
});
