import { ORGANIZATION_ID, WEBSITE_ID } from './json-ld';

export function buildCollectionPageJsonLd(options: {
  url: string;
  name: string;
  description: string;
  aboutName: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': options.url,
    url: options.url,
    name: options.name,
    description: options.description,
    inLanguage: 'ro-RO',
    isPartOf: { '@id': WEBSITE_ID },
    about: [
      { '@type': 'Thing', name: options.aboutName },
      { '@id': ORGANIZATION_ID },
    ],
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export function buildArticleItemListJsonLd(items: readonly { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: Math.min(items.length, 20),
    itemListElement: items.slice(0, 20).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}
