import { personAuthorJsonLd } from '@/lib/authors';
import { ORGANIZATION_ID, SITE_URL, WEBSITE_ID } from '@/lib/json-ld';

const DANIEL_PERSON_ID = `${SITE_URL}/autori/daniel-mihai#person`;

export function buildAboutPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${SITE_URL}/despre#webpage`,
        url: `${SITE_URL}/despre`,
        name: 'Despre Știrile Crypto',
        inLanguage: 'ro-RO',
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: { '@id': ORGANIZATION_ID },
        about: { '@id': ORGANIZATION_ID },
        mentions: [{ '@id': DANIEL_PERSON_ID }],
      },
      personAuthorJsonLd('daniel-mihai'),
    ],
  };
}
