import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { sourcesMatchExceptSiteUtm, urlsMatchExceptUtmSource } from './wallets-sync-compare.mjs';

const SAFEPAL_QE =
  'https://www.safepal.com/store/s1?ref=n2rmyza&utm_source=quickexit&utm_medium=affiliate&utm_campaign=wallets&utm_content=safepal-safepal-s1';
const SAFEPAL_SC =
  'https://www.safepal.com/store/s1?ref=n2rmyza&utm_source=stirilecrypto&utm_medium=affiliate&utm_campaign=wallets&utm_content=safepal-safepal-s1';

describe('wallet sync comparison', () => {
  it('passes when only utm_source differs', () => {
    assert.equal(urlsMatchExceptUtmSource(SAFEPAL_QE, SAFEPAL_SC), true);
    assert.equal(
      urlsMatchExceptUtmSource(
        'https://shop.ledger.com/products/ledger-nano-gen5?r=9111c54498ec&utm_source=quickexit&utm_medium=affiliate&utm_campaign=wallets&utm_content=ledger-ledger-nano-gen5',
        'https://shop.ledger.com/products/ledger-nano-gen5?r=9111c54498ec&utm_source=stirilecrypto&utm_medium=affiliate&utm_campaign=wallets&utm_content=ledger-ledger-nano-gen5',
      ),
      true,
    );
    assert.equal(
      sourcesMatchExceptSiteUtm(
        'url.searchParams.set("utm_source", "stirilecrypto");',
        'url.searchParams.set("utm_source", "quickexit");',
      ),
      true,
    );
  });

  it('fails when a ref, r, or rfsn differs', () => {
    assert.equal(urlsMatchExceptUtmSource(SAFEPAL_QE, SAFEPAL_SC.replace('ref=n2rmyza', 'ref=other')), false);
    assert.equal(
      urlsMatchExceptUtmSource(
        'https://shop.ledger.com/products/ledger-nano-gen5?r=9111c54498ec&utm_source=quickexit&utm_medium=affiliate',
        'https://shop.ledger.com/products/ledger-nano-gen5?r=000000000000&utm_source=stirilecrypto&utm_medium=affiliate',
      ),
      false,
    );
    assert.equal(
      urlsMatchExceptUtmSource(
        'https://shop.keyst.one/products/keystone-3-pro?variant=44416761102489&rfsn=9430621.40149c9&utm_source=refersion&utm_medium=affiliate&utm_campaign=9430621.40149c9',
        'https://shop.keyst.one/products/keystone-3-pro?variant=44416761102489&rfsn=0000000.0000000&utm_source=refersion&utm_medium=affiliate&utm_campaign=9430621.40149c9',
      ),
      false,
    );
    assert.equal(
      sourcesMatchExceptSiteUtm(
        'const SAFEPAL = "https://www.safepal.com/store/s1?ref=changed";',
        'const SAFEPAL = "https://www.safepal.com/store/s1?ref=n2rmyza";',
      ),
      false,
    );
  });
});
