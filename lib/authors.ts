import { EDITORIAL_DESK_NAME, SITE_NAME, SITE_URL } from '@/lib/json-ld';

export type AuthorKey = 'daniel-mihai' | 'desk';

export const DANIEL_MIHAI = {
  key: 'daniel-mihai' as const,
  name: 'Daniel Mihai',
  role: 'Analist',
  path: '/autori/daniel-mihai',
  photo: '/mihai-daniel-consultanta.jpg',
  photoAlt: 'Daniel Mihai, analist la Știrile Crypto',
  consultancyUrl: 'https://www.mihaidaniel.ro/',
  shortBio:
    'Semnează analizele de piață ale publicației. Materialele sunt educative și nu sunt recomandări personalizate de investiții.',
  bio: 'Daniel Mihai este analistul publicației Știrile Crypto. Semnează analizele de piață și contextul tehnic publicat pe site. Textele sale explică structura pieței; nu sunt consultanță financiară autorizată și nu conțin apeluri de cumpărare sau de vânzare.',
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

export function danielAuthorJsonLd() {
  return {
    '@type': 'Person',
    name: DANIEL_MIHAI.name,
    jobTitle: DANIEL_MIHAI.role,
    url: `${SITE_URL}${DANIEL_MIHAI.path}`,
    worksFor: {
      '@type': 'NewsMediaOrganization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
