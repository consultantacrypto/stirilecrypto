import { EDITORIAL_DESK_NAME, SITE_NAME, SITE_URL } from '@/lib/json-ld';

export type PersonAuthorKey = 'daniel-mihai' | 'cristian-vasile' | 'emilian-constantin';
export type AuthorKey = PersonAuthorKey | 'desk';

type PersonAuthor = {
  key: PersonAuthorKey;
  name: string;
  /** Shown on the author page. Not a credential. */
  role: string;
  path: string;
  shortBio: string;
  bio: string;
  photo?: string;
  photoAlt?: string;
  consultancyUrl?: string;
  /** Only profiles already published elsewhere on the site. */
  sameAs?: readonly string[];
};

export const DANIEL_MIHAI: PersonAuthor = {
  key: 'daniel-mihai',
  name: 'Daniel Mihai',
  role: 'Redactor și analist',
  path: '/autori/daniel-mihai',
  photo: '/mihai-daniel-consultanta.jpg',
  photoAlt: 'Daniel Mihai, redactor la Știrile Crypto',
  consultancyUrl: 'https://www.mihaidaniel.ro/',
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

/** No photo, bio, or social profiles are published for Cristian in this repo. */
export const CRISTIAN_VASILE: PersonAuthor = {
  key: 'cristian-vasile',
  name: 'Cristian Vasile',
  role: 'Autor',
  path: '/autori/cristian-vasile',
  shortBio: 'Scrie pentru Știrile Crypto.',
  bio: 'Cristian Vasile scrie pentru Știrile Crypto.',
};

/** No photo, bio, or social profiles are published for Emilian in this repo. */
export const EMILIAN_CONSTANTIN: PersonAuthor = {
  key: 'emilian-constantin',
  name: 'Emilian Constantin',
  role: 'Autor',
  path: '/autori/emilian-constantin',
  shortBio: 'Scrie pentru Știrile Crypto.',
  bio: 'Emilian Constantin scrie pentru Știrile Crypto.',
};

export const PERSON_AUTHORS = [DANIEL_MIHAI, CRISTIAN_VASILE, EMILIAN_CONSTANTIN] as const;

const AUTHORS: Record<PersonAuthorKey, PersonAuthor> = {
  'daniel-mihai': DANIEL_MIHAI,
  'cristian-vasile': CRISTIAN_VASILE,
  'emilian-constantin': EMILIAN_CONSTANTIN,
};

/**
 * Unsigned news and Market Pulse rotate across these three people.
 * Rule: FNV-1a 32-bit of the article slug, then modulo 3.
 * 0 → Daniel Mihai, 1 → Cristian Vasile, 2 → Emilian Constantin.
 * The same slug always keeps the same author. A stored byline wins over this.
 */
export const UNSIGNED_AUTHOR_ROTATION = [
  'daniel-mihai',
  'cristian-vasile',
  'emilian-constantin',
] as const satisfies readonly PersonAuthorKey[];

export function authorByKey(key: PersonAuthorKey): PersonAuthor {
  return AUTHORS[key];
}

export function isPersonAuthorKey(key: AuthorKey): key is PersonAuthorKey {
  return key !== 'desk';
}

function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
}

function hasTokens(normalized: string, first: string, second: string): boolean {
  return normalized.includes(first) && normalized.includes(second);
}

export function authorKeyFromName(name: string | null | undefined): AuthorKey {
  if (!name?.trim()) return 'desk';
  const normalized = normalizeName(name);
  if (hasTokens(normalized, 'daniel', 'mihai')) return 'daniel-mihai';
  if (hasTokens(normalized, 'cristian', 'vasile')) return 'cristian-vasile';
  if (hasTokens(normalized, 'emilian', 'constantin')) return 'emilian-constantin';
  return 'desk';
}

export function unsignedAuthorKey(slug: string): PersonAuthorKey {
  let hash = 0x811c9dc5;
  for (let i = 0; i < slug.length; i += 1) {
    hash ^= slug.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const index = (hash >>> 0) % UNSIGNED_AUTHOR_ROTATION.length;
  return UNSIGNED_AUTHOR_ROTATION[index];
}

/**
 * Stored names that match Daniel, Cristian, or Emilian use that person.
 * Any other stored byline stays with the newsroom.
 * A missing byline rotates with `unsignedAuthorKey`.
 */
export function authorKeyForArticle(input: {
  authorName?: string | null;
  slug: string;
}): AuthorKey {
  const named = authorKeyFromName(input.authorName);
  if (named !== 'desk') return named;
  if (input.authorName?.trim()) return 'desk';
  return unsignedAuthorKey(input.slug);
}

export function authorDisplayName(key: AuthorKey): string {
  return key === 'desk' ? EDITORIAL_DESK_NAME : AUTHORS[key].name;
}

export function personAuthorJsonLd(key: PersonAuthorKey) {
  const author = AUTHORS[key];
  const url = `${SITE_URL}${author.path}`;
  return {
    '@type': 'Person' as const,
    '@id': `${url}#person`,
    name: author.name,
    url,
    jobTitle: author.role,
    ...(author.photo ? { image: `${SITE_URL}${author.photo}` } : {}),
    ...(author.sameAs ? { sameAs: [...author.sameAs] } : {}),
    worksFor: {
      '@type': 'NewsMediaOrganization' as const,
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function danielAuthorJsonLd() {
  return personAuthorJsonLd('daniel-mihai');
}
