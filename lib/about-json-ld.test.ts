import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildAboutPageJsonLd } from './about-json-ld';

describe('about page schema', () => {
  it('publishes AboutPage and the same Daniel Mihai person id', () => {
    const jsonLd = buildAboutPageJsonLd() as {
      '@graph': Record<string, unknown>[];
    };
    const about = jsonLd['@graph'][0] as { '@type': string; mainEntity: { '@id': string } };
    const person = jsonLd['@graph'][1] as {
      '@type': string;
      '@id': string;
      jobTitle: string;
      alternateName: string[];
      worksFor: { '@id': string };
    };

    assert.equal(about['@type'], 'AboutPage');
    assert.equal(about.mainEntity['@id'], 'https://www.stirilecrypto.ro/#organization');
    assert.equal(person['@type'], 'Person');
    assert.equal(person['@id'], 'https://www.stirilecrypto.ro/autori/daniel-mihai#person');
    assert.equal(person.jobTitle, 'Redactor și analist');
    assert.ok(person.alternateName.includes('Mihai Daniel'));
    assert.deepEqual(person.worksFor, { '@id': 'https://www.stirilecrypto.ro/#organization' });
    assert.equal(JSON.stringify(jsonLd).includes('"founder"'), false);
  });
});