import { EDITORIAL_DESK_NAME, SITE_NAME, SITE_URL } from '@/lib/json-ld';

export type AuthorKey = 'daniel-mihai' | 'desk';

export const DANIEL_MIHAI = {
  key: 'daniel-mihai' as const,
  name: 'Daniel Mihai',
  role: 'Redactor și analist',
  path: '/autori/daniel-mihai',
  photo: '/mihai-daniel-consultanta.jpg',
  photoAlt: 'Daniel Mihai, redactor la Știrile Crypto',
  consultancyUrl: 'https://www.mihaidaniel.ro/',
  /** Profiles already linked from the site. Do not add accounts that are not published. */
  sameAs: [
    'https://x.com/MIhaiDanielWeb3',
    'https://www.youtube.com/@DanielMihaiCrypto',
    'https://www.tiktok.com/@mihaidanielmarius',
    'https://www.linkedin.com/in/mihaidanielmarius/',
    'https://www.mihaidaniel.ro/',
  ],
  shortBio:
    'Redactorul publicației. Semnează știrile și analizele de piață. Materialele sunt educative și nu sunt recomandări personalizate de investiții.',
  bio: 'Daniel Mihai este redactorul publicației Știrile Crypto. Semnează știrile și analizele de piață publicate pe site. Textele explică contextul de piață pornind de la surse publice; nu sunt consultanță financiară autorizată și nu conțin apeluri de cumpărare sau de vânzare.',
};

export function authorKeyFromName(name: string | null | undefined): AuthorKey {
  if (!name) return 'desk';
  const normalized = name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
  if (normalized.includes('daniel') && normalized.includes('mihai')) {
    return 'daniel-mihai';
  }
  return 'desk';
}

export function authorDisplayName(key: AuthorKey): string {
  return key === 'daniel-mihai' ? DANIEL_MIHAI.name : EDITORIAL_DESK_NAME;
}

/**
 * Byline for a published story.
 * A stored name that is not Daniel stays with the newsroom.
 * Missing bylines are Daniel Mihai — the editor — not the newsroom Organization.
 */
export function authorKeyForArticle(input: {
  authorName?: string | null;
}): AuthorKey {
  if (authorKeyFromName(input.authorName) === 'daniel-mihai') return 'daniel-mihai';
  if (input.authorName?.trim()) return 'desk';
  return 'daniel-mihai';
}

export function danielAuthorJsonLd() {
  const url = `${SITE_URL}${DANIEL_MIHAI.path}`;
  return {
    '@type': 'Person',
    '@id': `${url}#person`,
    name: DANIEL_MIHAI.name,
    jobTitle: DANIEL_MIHAI.role,
    url,
    image: `${SITE_URL}${DANIEL_MIHAI.photo}`,
    sameAs: [...DANIEL_MIHAI.sameAs],
    worksFor: {
      '@type': 'NewsMediaOrganization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
