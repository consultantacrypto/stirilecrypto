import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  STIRI_ALTS_DESCRIPTION,
  STIRI_ALTS_H1,
  STIRI_ALTS_TITLE,
  STIRI_BLOCKCHAIN_DESCRIPTION,
  STIRI_BLOCKCHAIN_H1,
  STIRI_BLOCKCHAIN_TITLE,
  stiriListingSeo,
} from './stiri-listing-seo';

const BLOCKCHAIN_PHRASE = /știri blockchain/i;

describe('stiri listing seo', () => {
  it('points only the unfiltered first page at știri blockchain', () => {
    const index = stiriListingSeo(1, null);
    assert.equal(index.title, STIRI_BLOCKCHAIN_TITLE);
    assert.equal(index.h1, STIRI_BLOCKCHAIN_H1);
    assert.equal(index.description, STIRI_BLOCKCHAIN_DESCRIPTION);
    assert.match(index.title, BLOCKCHAIN_PHRASE);
    assert.match(index.h1, BLOCKCHAIN_PHRASE);
    assert.match(index.description, BLOCKCHAIN_PHRASE);

    const pageTwo = stiriListingSeo(2, null);
    assert.equal(pageTwo.title, 'Știri crypto explicate — pagina 2');
    assert.equal(pageTwo.h1, STIRI_BLOCKCHAIN_H1);
    assert.doesNotMatch(pageTwo.title, BLOCKCHAIN_PHRASE);
    assert.doesNotMatch(pageTwo.description, BLOCKCHAIN_PHRASE);
  });

  it('gives altcoins their own title, H1, and meta', () => {
    const alts = stiriListingSeo(1, 'alts');
    assert.equal(alts.title, STIRI_ALTS_TITLE);
    assert.equal(alts.h1, STIRI_ALTS_H1);
    assert.equal(alts.description, STIRI_ALTS_DESCRIPTION);
    assert.doesNotMatch(`${alts.title} ${alts.h1} ${alts.description}`, BLOCKCHAIN_PHRASE);
    assert.equal(stiriListingSeo(2, 'alts').title, `${STIRI_ALTS_TITLE} — pagina 2`);
  });

  it('keeps other category filters off the blockchain phrase', () => {
    for (const category of ['eth', 'generale', 'reglementari', 'btc', 'macro', 'edu']) {
      const seo = stiriListingSeo(1, category);
      assert.equal(seo.title, 'Știri crypto și criptomonede');
      assert.equal(seo.h1, 'Știri crypto și criptomonede');
      assert.doesNotMatch(`${seo.title} ${seo.h1} ${seo.description}`, BLOCKCHAIN_PHRASE);
      assert.equal(stiriListingSeo(3, category).title, 'Știri crypto explicate — pagina 3');
    }
  });
});
