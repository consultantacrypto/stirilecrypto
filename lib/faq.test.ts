import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { FAQ_ITEMS, buildFaqPageJsonLd } from './faq';
import { linkPhrases, plainText } from './inline-links';

const Q5 =
  'Știrile și analizele de pe Știrile Crypto sunt semnate de membrii redacției, fiecare cu o zonă principală de acoperire. Daniel Mihai, redactor și analist, scrie despre Bitcoin, Ethereum, macroeconomie și subiecte generale din piața crypto; Cristian Vasile acoperă hype-ul din piață și reglementările; Eduard Mihai acoperă hack-urile și incidentele de securitate; Emilian Constantin scrie ca generalist. Fiecare articol are autorul afișat și o pagină de autor, iar componența redacției este publicată pe pagina Redacție.';

describe('FAQ page copy', () => {
  it('keeps 12 answers identical to FAQPage JSON-LD, including Eduard Mihai', () => {
    const jsonLd = buildFaqPageJsonLd() as {
      '@type': string;
      '@id': string;
      dateModified: string;
      mainEntity: { name: string; acceptedAnswer: { text: string } }[];
    };

    assert.equal(jsonLd['@type'], 'FAQPage');
    assert.equal(jsonLd['@id'], 'https://www.stirilecrypto.ro/intrebari-frecvente#faq');
    assert.match(jsonLd.dateModified, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(jsonLd.mainEntity.length, 12);
    assert.equal(FAQ_ITEMS.length, 12);

    FAQ_ITEMS.forEach((item, index) => {
      const linked = plainText(linkPhrases(item.answer, item.links));
      assert.equal(linked, item.answer);
      assert.equal(jsonLd.mainEntity[index].name, item.question);
      assert.equal(jsonLd.mainEntity[index].acceptedAnswer.text, item.answer);
    });

    assert.equal(FAQ_ITEMS[4].answer, Q5);
    assert.equal(jsonLd.mainEntity[4].acceptedAnswer.text, Q5);
    assert.equal(JSON.stringify(jsonLd).includes('stirea-zilei'), false);
    assert.equal(JSON.stringify(jsonLd).includes('founder'), false);
  });
});
