import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { describe, it } from 'node:test';
import { validateAddressWaitlist } from './address-intake';
import { validateOrder } from './intake';
import { paidCheckoutFromEvent, verifyStripeSignature } from './stripe-event';

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

  it('accepts a technical-analysis waitlist without the optional risk fields', () => {
    const result = validateOrder({
      ...consent,
      intent: 'waitlist',
      product: 'ta_mtf',
      asset: 'eth',
      question: 'Ce structură vezi pe 1D?',
      delivery: 'email',
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.value.product, 'ta_mtf');
      assert.equal(result.value.asset, 'ETH');
      assert.equal(result.value.risk, null);
      assert.equal(result.value.bundle, false);
      assert.equal(result.value.source, null);
    }
  });

  it('keeps a placement source on the analysis order', () => {
    const result = validateOrder({
      ...consent,
      product: 'ta_mtf',
      asset: 'BTC',
      source: 'article',
    });
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.value.source, 'article');
  });

  it('stores optional risk details on the analysis product', () => {
    const result = validateOrder({
      ...consent,
      product: 'risk_report',
      ticker: 'xmpl',
      coin: 'Exemplum',
      network: 'Exemplaris',
      nativeAsset: true,
      concerns: ['liquidity', 'dump'],
      why: 'Doar context opțional.',
    });
    assert.equal(result.ok, true);
    if (result.ok && result.value.risk) {
      assert.equal(result.value.product, 'ta_mtf');
      assert.equal(result.value.asset, 'XMPL');
      assert.equal(result.value.risk.coin, 'Exemplum');
      assert.deepEqual(result.value.risk.concerns, ['liquidity', 'dump']);
      assert.equal(result.value.risk.contractAddress, null);
    }
  });

  it('keeps a posted tier and ignores a posted price', () => {
    const major = validateOrder({
      ...consent,
      product: 'ta_mtf',
      asset: 'pepe',
      tier: 'major',
      amountRon: 49,
      amountBani: 4900,
    });
    assert.equal(major.ok, true);
    if (major.ok) {
      assert.equal(major.value.requestedTier, 'major');
      assert.equal('amountRon' in major.value, false);
      assert.equal('amountBani' in major.value, false);
    }

    const unknown = validateOrder({ ...consent, product: 'ta_mtf', asset: 'BTC', tier: 49 });
    assert.equal(unknown.ok, true);
    if (unknown.ok) assert.equal(unknown.value.requestedTier, null);
  });
});

describe('validateAddressWaitlist', () => {
  it('requires the notify consent and keeps the placement', () => {
    const missing = validateAddressWaitlist({ email: 'cititor@example.com', consent: false });
    assert.equal(missing.ok, false);
    const saved = validateAddressWaitlist({ email: 'cititor@example.com', consent: true, source: 'nav' });
    assert.equal(saved.ok, true);
    if (saved.ok) {
      assert.equal(saved.value.source, 'nav');
      assert.equal(saved.honeypot, false);
    }
  });
});

describe('stripe webhook', () => {
  it('accepts a fresh signature and reads a paid session', () => {
    const secret = 'whsec_test';
    const now = 1_700_000_000;
    const payload = JSON.stringify({
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          payment_status: 'paid',
          metadata: { inquiry_id: '11111111-1111-1111-1111-111111111111' },
          customer_details: { email: 'cititor@example.com' },
        },
      },
    });
    const signature = createHmac('sha256', secret).update(`${now}.${payload}`).digest('hex');
    assert.equal(verifyStripeSignature(payload, `t=${now},v1=${signature}`, secret, now), true);
    assert.equal(verifyStripeSignature(payload, `t=${now},v1=deadbeef`, secret, now), false);

    const paid = paidCheckoutFromEvent(JSON.parse(payload));
    assert.equal(paid?.inquiryId, '11111111-1111-1111-1111-111111111111');
    assert.equal(paid?.email, 'cititor@example.com');
  });

  it('ignores an unpaid session', () => {
    const paid = paidCheckoutFromEvent({
      type: 'checkout.session.completed',
      data: { object: { id: 'cs_test_123', payment_status: 'unpaid', metadata: { inquiry_id: 'abcdefgh' } } },
    });
    assert.equal(paid, null);
  });
});
