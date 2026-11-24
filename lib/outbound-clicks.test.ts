import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { classifyOutbound, gaParam, outboundPlacement } from './outbound-clicks';

describe('outbound click classification', () => {
  it('marks consultancy hosts and affiliate links, and leaves ordinary links alone', () => {
    assert.equal(classifyOutbound('https://www.mihaidaniel.ro/', null), 'consultancy');
    assert.equal(classifyOutbound('https://mihaidaniel.ro/consultanta-crypto', ''), 'consultancy');
    assert.equal(classifyOutbound('https://partner.bybit.eu/b/STIRICRYPTO', 'noopener'), 'affiliate');
    assert.equal(classifyOutbound('https://www.binance.com/join?ref=35329648', null), 'affiliate');
    assert.equal(classifyOutbound('https://www.okx.com/join/77249876', null), 'affiliate');
    assert.equal(classifyOutbound('https://url.hk/i/en/kqz74', null), 'affiliate');
    assert.equal(classifyOutbound('https://example.com/offer', 'noopener sponsored'), 'affiliate');
    assert.equal(
      classifyOutbound('https://www.binance.com/join?ref=1&utm_medium=affiliate', null),
      'affiliate',
    );
    assert.equal(classifyOutbound('https://www.binance.com/en/about', null), null);
    assert.equal(classifyOutbound('https://www.linkedin.com/in/mihaidanielmarius/', null), null);
    assert.equal(classifyOutbound('/analiza-tehnica', null), null);
  });

  it('prefers data-placement, then the campaign, then the page path', () => {
    assert.equal(outboundPlacement('footer', 'https://www.mihaidaniel.ro/', '/taxe'), 'footer');
    assert.equal(
      outboundPlacement(
        null,
        'https://www.binance.com/join?ref=35329648&utm_campaign=cta-binance',
        '/market',
      ),
      'cta-binance',
    );
    assert.equal(outboundPlacement('  ', 'https://www.mihaidaniel.ro/', '/autori/daniel-mihai'), '/autori/daniel-mihai');
    assert.equal(gaParam(`https://example.com/${'a'.repeat(120)}`).length, 100);
  });
});
