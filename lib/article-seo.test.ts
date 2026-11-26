import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ARTICLE_SEO_OVERRIDES, articleSeoOverride, articleSeoTitle } from './article-seo';

describe('article seo overrides', () => {
  it('keeps the five briefed titles, H1s, and metas, and strips the brand suffix once', () => {
    const expected = {
      'carduri-crypto-raportare-anaf-taxe-mica-dac8': {
        title: 'Carduri crypto și raportarea ANAF (DAC8)',
        h1: 'Ce carduri crypto sunt raportate la ANAF, după MiCA și DAC8',
      },
      'romania-in-operatiunea-globala-care-a-gasit-39-de-miliarde-de-dolari-in-bani-si-crypto-din-tepe':
        {
          title: 'Țepe crypto de 39 mld $, inclusiv România',
          h1: 'România, în operațiunea globală care a găsit 39 de miliarde de dolari din țepe cu crypto',
        },
      'fara-kyc-nu-inseamna-anonim-card-crypto-portofel-ip-plati-romania': {
        title: 'Card crypto fără KYC: nu înseamnă anonim',
        h1: '„Fără KYC” la un card crypto nu înseamnă anonim',
      },
      'pi-network-paypal-pay-with-crypto-integrare-oficiala': {
        title: 'Pi Network în PayPal Pay with Crypto',
        h1: 'PayPal confirmă Pi Network în funcția Pay with Crypto',
      },
      'trezor-confirma-3-safe-5-implant-cryptobilis-taie-80-la-suta-revanzatori': {
        title: 'Trezor confirmă 3 Safe 5 cu implant',
        h1: 'Trezor confirmă implanturi pe 3 Safe 5 și reduce 80% din revânzători',
      },
    };

    assert.deepEqual(Object.keys(ARTICLE_SEO_OVERRIDES).sort(), Object.keys(expected).sort());

    for (const [slug, fields] of Object.entries(expected)) {
      const override = articleSeoOverride(slug);
      assert.ok(override);
      assert.equal(articleSeoTitle(override), fields.title);
      assert.equal(`${articleSeoTitle(override)} | Știrile Crypto`, override.title);
      assert.equal(override.h1, fields.h1);
      assert.equal(override.description.includes('ş'), false);
      assert.equal(override.description.includes('ţ'), false);
      assert.equal(override.h1.includes('ş'), false);
      assert.equal(override.h1.includes('ţ'), false);
    }

    assert.equal(articleSeoOverride('alt-articol'), null);
  });
});
