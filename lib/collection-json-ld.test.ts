import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildArticleItemListJsonLd, buildCollectionPageJsonLd } from './collection-json-ld';

describe('collection JSON-LD', () => {
  it('builds a CollectionPage and the first 20 list items', () => {
    const page = buildCollectionPageJsonLd({
      url: 'https://www.stirilecrypto.ro/hub/bitcoin',
      name: 'Știri Bitcoin în română, pentru cititorii din România',
      description: 'Hub Bitcoin',
      aboutName: 'Bitcoin',
    });
    assert.equal(page['@type'], 'CollectionPage');
    assert.equal(page['@id'], 'https://www.stirilecrypto.ro/hub/bitcoin');
    assert.equal(page.inLanguage, 'ro-RO');
    assert.deepEqual(page.isPartOf, { '@id': 'https://www.stirilecrypto.ro/#website' });

    const items = Array.from({ length: 25 }, (_, index) => ({
      name: `Articol ${index + 1}`,
      url: `https://www.stirilecrypto.ro/stiri/articol-${index + 1}`,
    }));
    const list = buildArticleItemListJsonLd(items);
    assert.equal(list.itemListElement.length, 20);
    assert.equal(list.itemListElement[0].position, 1);
    assert.equal(list.itemListElement[19].name, 'Articol 20');
  });
});
