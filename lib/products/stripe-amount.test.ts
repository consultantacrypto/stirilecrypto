import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { checkoutSessionBody } from './stripe';
import { analysisCheckoutCopy, resolveAnalysisTier } from './tiers';

const base = {
  email: 'cititor@example.com',
  origin: 'https://www.stirilecrypto.ro',
  inquiryId: '11111111-1111-1111-1111-111111111111',
  product: 'ta_mtf',
  source: 'nav',
};

describe('checkout session amount', () => {
  it('charges 7900 bani for a top-30 coin that asked for the major tier', () => {
    const priced = resolveAnalysisTier('BTC', 'major');
    const copy = analysisCheckoutCopy(priced.tier);
    const body = checkoutSessionBody({
      ...base,
      name: copy.name,
      description: copy.description,
      amountBani: priced.amountBani,
      tier: priced.tier,
    });
    assert.ok(body);
    assert.equal(body.get('line_items[0][price_data][currency]'), 'ron');
    assert.equal(body.get('line_items[0][price_data][unit_amount]'), '7900');
    assert.equal(body.get('metadata[tier]'), 'major');
    assert.match(body.get('line_items[0][price_data][product_data][name]') ?? '', /79 RON/);
    assert.match(body.get('line_items[0][price_data][product_data][description]') ?? '', /Risc token/);
  });

  it('charges 13900 bani when a non-listed asset posts the major tier', () => {
    const priced = resolveAnalysisTier('PEPE', 'major');
    const copy = analysisCheckoutCopy(priced.tier);
    const body = checkoutSessionBody({
      ...base,
      name: copy.name,
      description: copy.description,
      amountBani: priced.amountBani,
      tier: priced.tier,
    });
    assert.ok(body);
    assert.equal(priced.forcedAltcoin, true);
    assert.equal(body.get('line_items[0][price_data][unit_amount]'), '13900');
    assert.equal(body.get('metadata[tier]'), 'altcoin');
    assert.match(body.get('line_items[0][price_data][product_data][name]') ?? '', /139 RON/);
  });

  it('refuses any unit amount other than the two server prices', () => {
    const copy = analysisCheckoutCopy('major');
    assert.equal(
      checkoutSessionBody({
        ...base,
        name: copy.name,
        description: copy.description,
        amountBani: 4900,
        tier: 'major',
      }),
      null,
    );
    assert.equal(
      checkoutSessionBody({
        ...base,
        name: copy.name,
        description: copy.description,
        amountBani: 79,
        tier: 'major',
      }),
      null,
    );
  });
});
