import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { linkPhrases, plainText } from './inline-links';
import {
  BITCOIN_DEFINITION,
  BITCOIN_DEFINITION_LINKS,
  BITCOIN_DESCRIPTION,
  BITCOIN_H1,
  BITCOIN_JSONLD_DESCRIPTION,
  BITCOIN_JSONLD_NAME,
  BITCOIN_SITE_ANSWER,
  BITCOIN_SITE_LINKS,
  BITCOIN_TITLE,
  BITCOIN_WHERE_ITEMS,
  buildBitcoinCollectionJsonLd,
  buildBitcoinItemListJsonLd,
} from './hub-bitcoin';

describe('bitcoin hub copy', () => {
  it('uses the brief title, H1, and definition, and publishes CollectionPage JSON-LD', () => {
    assert.equal(BITCOIN_TITLE, 'Știri Bitcoin azi, în română | Știrile Crypto');
    assert.equal(BITCOIN_H1, 'Știri Bitcoin azi, pentru cititorii din România');
    assert.equal(
      BITCOIN_DESCRIPTION,
      'Știri Bitcoin în română: ultimele noutăți, analize on-chain și Pulsul Bitcoin, actualizate zilnic de Știrile Crypto.',
    );
    assert.equal(BITCOIN_JSONLD_NAME, 'Știri Bitcoin în română, pentru cititorii din România');
    assert.match(BITCOIN_JSONLD_DESCRIPTION, /Pulsul Bitcoin, publicat 7 zile din 7/);
    assert.equal(plainText(linkPhrases(BITCOIN_DEFINITION, BITCOIN_DEFINITION_LINKS)), BITCOIN_DEFINITION);
    assert.equal(plainText(linkPhrases(BITCOIN_SITE_ANSWER, BITCOIN_SITE_LINKS)), BITCOIN_SITE_ANSWER);
    for (const item of BITCOIN_WHERE_ITEMS) {
      assert.equal(plainText(linkPhrases(item.text, item.links)), item.text);
    }

    const page = buildBitcoinCollectionJsonLd() as {
      '@type': string;
      name: string;
      about: { name?: string; '@id'?: string }[];
    };
    assert.equal(page['@type'], 'CollectionPage');
    assert.equal(page.name, BITCOIN_JSONLD_NAME);
    assert.equal(
      (page as { description?: string }).description,
      BITCOIN_JSONLD_DESCRIPTION,
    );
    assert.equal(page.about[0].name, 'Bitcoin');
    assert.equal(page.about[1]['@id'], 'https://www.stirilecrypto.ro/#organization');

    const list = buildBitcoinItemListJsonLd() as {
      itemListElement: { url: string }[];
    };
    assert.deepEqual(
      list.itemListElement.map((item) => item.url),
      [
        'https://www.stirilecrypto.ro/hub/bitcoin',
        'https://www.stirilecrypto.ro/market-pulse',
        'https://www.stirilecrypto.ro/taxe',
        'https://www.stirilecrypto.ro/hub/stiri-crypto-romania',
      ],
    );
    assert.equal(JSON.parse(JSON.stringify(page)).name, BITCOIN_JSONLD_NAME);
  });
});
