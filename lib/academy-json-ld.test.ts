import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  academyPageTitle,
  buildAcademyArticleJsonLd,
  buildAcademyBreadcrumbJsonLd,
} from './academy-json-ld';
import type { AcademyItem } from './dictionary';

const term = {
  slug: 'legislatie-fiscalitate-crypto-romania-2026-raport-complet',
  term: 'Taxe crypto 2026: cât plătești și cum faci D212',
  image: '/cryptoromanialege.jpg',
  category: 'ANALIZĂ FUNDAMENTALĂ',
  definition: 'Raport fiscal.',
  analogy: 'Harta.',
  mihaiTake: 'Citește secțiunea 4.',
  fullContent: '<h3>1. Introducere</h3><p>Fără secțiune de întrebări.</p>',
} as AcademyItem;

describe('academy JSON-LD', () => {
  it('drops the extra title suffix and publishes Article plus breadcrumbs', () => {
    assert.equal(academyPageTitle(term), term.term);
    assert.equal(academyPageTitle(undefined), 'Termen necunoscut');
    assert.equal(
      academyPageTitle({ ...term, seoTitle: 'Titlu SEO' }),
      'Titlu SEO',
    );

    const article = buildAcademyArticleJsonLd(term, term.slug);
    assert.equal(article['@type'], 'Article');
    assert.equal(
      article['@id'],
      'https://www.stirilecrypto.ro/academie/legislatie-fiscalitate-crypto-romania-2026-raport-complet#article',
    );
    assert.equal(article.headline, term.term);
    assert.equal(article.inLanguage, 'ro-RO');
    assert.deepEqual(article.author, {
      '@id': 'https://www.stirilecrypto.ro/autori/daniel-mihai#person',
    });
    assert.deepEqual(article.image, ['https://www.stirilecrypto.ro/cryptoromanialege.jpg']);
    assert.equal(article.dateModified, '2026-11-01');
    assert.equal(JSON.stringify(article).includes('FAQPage'), false);

    const breadcrumb = buildAcademyBreadcrumbJsonLd(term, term.slug) as {
      itemListElement: { name: string }[];
    };
    assert.deepEqual(
      breadcrumb.itemListElement.map((item) => item.name),
      ['Acasă', 'Academie', term.term],
    );
  });
});
