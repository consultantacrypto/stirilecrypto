import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { HERO_SLOGAN, HERO_SLOGAN_LEAD, HERO_SLOGAN_TAIL } from './hero-slogan';

describe('homepage slogan', () => {
  it('is the confirmed line, assembled from the two swappable sentences', () => {
    assert.equal(HERO_SLOGAN_LEAD, 'Înțelegi piața.');
    assert.equal(HERO_SLOGAN_TAIL, 'Îți protejezi banii.');
    assert.equal(HERO_SLOGAN, 'Înțelegi piața. Îți protejezi banii.');
    assert.equal(`${HERO_SLOGAN_LEAD} ${HERO_SLOGAN_TAIL}`, HERO_SLOGAN);
  });
});
