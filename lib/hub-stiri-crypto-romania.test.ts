import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { linkPhrases, plainText } from './inline-links';
import {
  HUB_BITCOIN,
  HUB_BITCOIN_LINKS,
  HUB_ENTITY,
  HUB_ENTITY_LINKS,
  HUB_FIND,
  HUB_FIND_LINKS,
  HUB_SOURCES,
  HUB_SOURCES_LINKS,
  HUB_USEFUL,
  HUB_USEFUL_LINKS,
  HUB_WHO,
  HUB_WHO_LINKS,
  buildHubCollectionJsonLd,
  hubCopyBlob,
} from './hub-stiri-crypto-romania';

describe('crypto Romania hub copy', () => {
  it('keeps the entity definition and locked cadence without competitor names', () => {
    assert.match(HUB_ENTITY, /^Știrile Crypto \(stirilecrypto\.ro\) este o publicație online din România/);
    assert.match(HUB_FIND, /în mod obișnuit 2–3 știri pe zi/);
    assert.match(HUB_FIND, /7 zile din 7/);
    assert.match(HUB_WHO, /Eduard Mihai — hack-uri/);
    assert.match(HUB_WHO, /Consultanța 1-la-1 este separată de publicație, pe mihaidaniel\.ro\./);

    const blob = hubCopyBlob();
    for (const forbidden of ['stirea-zilei', 'zilnic', '#1', 'lider', 'Cryptology', 'bitcoinromania', 'Mediafax', 'financer', 'ora 19']) {
      assert.equal(blob.toLowerCase().includes(forbidden.toLowerCase()), false, forbidden);
    }

    for (const [text, links] of [
      [HUB_ENTITY, HUB_ENTITY_LINKS],
      [HUB_FIND, HUB_FIND_LINKS],
      [HUB_SOURCES, HUB_SOURCES_LINKS],
      [HUB_USEFUL, HUB_USEFUL_LINKS],
      [HUB_BITCOIN, HUB_BITCOIN_LINKS],
      [HUB_WHO, HUB_WHO_LINKS],
    ] as const) {
      assert.equal(plainText(linkPhrases(text, links)), text);
    }

    const jsonLd = buildHubCollectionJsonLd() as { '@type': string; '@id': string; dateModified: string };
    assert.equal(jsonLd['@type'], 'CollectionPage');
    assert.equal(jsonLd['@id'], 'https://www.stirilecrypto.ro/hub/stiri-crypto-romania#webpage');
    assert.match(jsonLd.dateModified, /^\d{4}-\d{2}-\d{2}$/);
  });
});
