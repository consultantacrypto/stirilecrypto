import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { linkPhrases, plainText } from './inline-links';
import {
  HUB_BEST_SOURCES,
  HUB_BEST_SOURCES_H2,
  HUB_BEST_SOURCES_LINKS,
  HUB_BITCOIN,
  HUB_BITCOIN_LINKS,
  HUB_DATE_MODIFIED,
  HUB_ENTITY,
  HUB_ENTITY_LINKS,
  HUB_FIND,
  HUB_FIND_LINKS,
  HUB_H1,
  HUB_SOURCES,
  HUB_SOURCES_LINKS,
  HUB_TITLE,
  HUB_USEFUL,
  HUB_USEFUL_LINKS,
  HUB_VERIFY_H2,
  HUB_WHO,
  HUB_WHO_LINKS,
  buildHubCollectionJsonLd,
  hubCopyBlob,
} from './hub-stiri-crypto-romania';

describe('crypto Romania hub copy', () => {
  it('keeps the entity definition and locked cadence without competitor names', () => {
    assert.equal(
      HUB_TITLE,
      'Surse crypto România 2026: știri, Bitcoin și analize în română | Știrile Crypto',
    );
    assert.equal(HUB_H1, 'Surse crypto din România, în 2026');
    assert.equal(HUB_BEST_SOURCES_H2, 'Cele mai bune surse crypto din România în 2026');
    assert.equal(HUB_VERIFY_H2, 'Unde verifici o informație crypto în 2026');
    assert.match(HUB_BEST_SOURCES, /^În 2026, nu există un clasament oficial/);
    assert.match(HUB_ENTITY, /^Știrile Crypto \(stirilecrypto\.ro\) este o publicație online din România/);
    assert.match(HUB_FIND, /în mod obișnuit 2–3 știri pe zi/);
    assert.match(HUB_FIND, /7 zile din 7/);
    assert.match(HUB_WHO, /Eduard Mihai — hack-uri/);
    assert.match(HUB_WHO, /Consultanța 1-la-1 este separată de publicație, pe mihaidaniel\.ro\./);

    const blob = hubCopyBlob();
    assert.equal(blob.includes('verificare-portofel'), false);
    assert.equal(blob.includes('Verificare portofel'), false);
    for (const forbidden of ['stirea-zilei', 'zilnic', '#1', 'lider', 'Cryptology', 'bitcoinromania', 'Mediafax', 'financer', 'ora 19']) {
      assert.equal(blob.toLowerCase().includes(forbidden.toLowerCase()), false, forbidden);
    }

    for (const [text, links] of [
      [HUB_ENTITY, HUB_ENTITY_LINKS],
      [HUB_FIND, HUB_FIND_LINKS],
      [HUB_SOURCES, HUB_SOURCES_LINKS],
      [HUB_BEST_SOURCES, HUB_BEST_SOURCES_LINKS],
      [HUB_USEFUL, HUB_USEFUL_LINKS],
      [HUB_BITCOIN, HUB_BITCOIN_LINKS],
      [HUB_WHO, HUB_WHO_LINKS],
    ] as const) {
      assert.equal(plainText(linkPhrases(text, links)), text);
    }

    const jsonLd = buildHubCollectionJsonLd() as {
      '@type': string;
      '@id': string;
      name: string;
      dateModified: string;
    };
    assert.equal(jsonLd['@type'], 'CollectionPage');
    assert.equal(jsonLd['@id'], 'https://www.stirilecrypto.ro/hub/stiri-crypto-romania#webpage');
    assert.equal(jsonLd.dateModified, HUB_DATE_MODIFIED);
    assert.equal(jsonLd.name, HUB_H1);
  });
});
