import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  QUICKEXIT_WALLETS_SYNC,
  WALLET_PRODUCTS,
  buildWalletOutboundUrl,
  hasRealCheckoutCode,
} from './quickexit-catalog.sync';

const NO_REF_BRANDS = ['bitbox', 'trezor', 'ngrave'] as const;

describe('QuickExit wallet deep links', () => {
  it('pins the synced copy to the quickexit-app commit', () => {
    assert.equal(QUICKEXIT_WALLETS_SYNC.repo, 'consultantacrypto/quickexit-app');
    assert.match(QUICKEXIT_WALLETS_SYNC.commit, /^[0-9a-f]{40}$/);
  });

  it('keeps the known partner parameters and adds none for BitBox, Trezor, or NGRAVE', () => {
    const bySlug = new Map(WALLET_PRODUCTS.map((product) => [product.slug, buildWalletOutboundUrl(product)]));

    assert.equal(
      bySlug.get('safepal-s1'),
      'https://www.safepal.com/store/s1?ref=n2rmyza&utm_source=quickexit&utm_medium=affiliate&utm_campaign=wallets&utm_content=safepal-safepal-s1',
    );
    assert.equal(
      bySlug.get('ledger-nano-gen5'),
      'https://shop.ledger.com/products/ledger-nano-gen5?r=9111c54498ec&utm_source=quickexit&utm_medium=affiliate&utm_campaign=wallets&utm_content=ledger-ledger-nano-gen5',
    );
    assert.equal(
      bySlug.get('keystone-3-pro-1-year'),
      'https://shop.keyst.one/products/keystone-3-pro?variant=44416761102489&rfsn=9430621.40149c9&utm_source=refersion&utm_medium=affiliate&utm_campaign=9430621.40149c9&utm_content=keystone-keystone-3-pro-1-year',
    );
    assert.match(bySlug.get('tangem-2-cards') ?? '', /^https:\/\/tangem\.com\/en\/pricing\/\?/);
    assert.equal(
      WALLET_PRODUCTS.find((product) => product.slug === 'tangem-2-cards')?.affiliateCode,
      'DANIELMIHAI',
    );

    for (const product of WALLET_PRODUCTS) {
      const url = new URL(bySlug.get(product.slug) ?? '');
      if (NO_REF_BRANDS.includes(product.brandSlug as (typeof NO_REF_BRANDS)[number])) {
        assert.equal(url.searchParams.get('ref'), null, product.slug);
        assert.equal(url.searchParams.get('r'), null, product.slug);
        assert.equal(url.searchParams.get('rfsn'), null, product.slug);
      }
      assert.equal(url.searchParams.get('code'), null, product.slug);
    }
  });

  it('gives the popular badge only to SafePal S1 and a real checkout code only to Tangem', () => {
    const popular = WALLET_PRODUCTS.filter((product) => product.highlight === 'popular').map((product) => product.slug);
    assert.deepEqual(popular, ['safepal-s1']);
    const codes = WALLET_PRODUCTS.filter(hasRealCheckoutCode).map((product) => product.brandSlug);
    assert.deepEqual([...new Set(codes)], ['tangem']);
  });
});
