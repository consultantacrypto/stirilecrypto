import type { InlineLink } from '@/lib/inline-links';
import { ORGANIZATION_ID, SITE_URL, WEBSITE_ID } from '@/lib/json-ld';

export const BITCOIN_HUB_PATH = '/hub/bitcoin';
export const BITCOIN_HUB_URL = `${SITE_URL}${BITCOIN_HUB_PATH}`;
export const BITCOIN_TITLE =
  'Știri Bitcoin România: analize și Pulsul Bitcoin, în română | Știrile Crypto';
export const BITCOIN_H1 = 'Știri Bitcoin în română, pentru cititorii din România';
export const BITCOIN_DESCRIPTION =
  'Unde citești știri despre Bitcoin în română: hub-ul Bitcoin al Știrile Crypto, analize on-chain și Pulsul Bitcoin, publicat 7 zile din 7.';
/** Same content revision as the Romania hub update. Not a request clock. */
export const BITCOIN_DATE_MODIFIED = '2026-11-16';

export const BITCOIN_DEFINITION =
  'Știrile Crypto (stirilecrypto.ro) publică în limba română știri și analize despre Bitcoin, pentru cititorii din România. Acest hub adună materialele despre Bitcoin: știri, analize de piață și date on-chain. Pentru evoluția zilnică a pieței există Pulsul Bitcoin (Market Pulse), publicat 7 zile din 7. Articolele pun mișcarea de piață în contextul cititorului de aici: lei, taxe și platformele disponibile în țară.';

export const BITCOIN_DEFINITION_LINKS: readonly InlineLink[] = [
  { phrase: 'Știrile Crypto', href: '/' },
  { phrase: 'Pulsul Bitcoin', href: '/market-pulse' },
  { phrase: 'taxe', href: '/taxe' },
];

export const BITCOIN_WHERE_H2 = 'Unde citești știri despre Bitcoin în română pe Știrile Crypto';

export const BITCOIN_WHERE_ITEMS: readonly { text: string; links: readonly InlineLink[] }[] = [
  {
    text: 'Hub-ul Bitcoin (pagina curentă) grupează știrile și analizele.',
    links: [],
  },
  {
    text: 'Pulsul Bitcoin, /market-pulse, este publicat 7 zile din 7.',
    links: [
      { phrase: 'Pulsul Bitcoin', href: '/market-pulse' },
      { phrase: '/market-pulse', href: '/market-pulse' },
    ],
  },
  {
    text: 'Taxele pe câștigurile din crypto, inclusiv din Bitcoin, sunt explicate pe /taxe.',
    links: [{ phrase: '/taxe', href: '/taxe' }],
  },
  {
    text: 'Contextul mai larg (reglementare, surse) este în /hub/stiri-crypto-romania și /hub/mica.',
    links: [
      { phrase: '/hub/stiri-crypto-romania', href: '/hub/stiri-crypto-romania' },
      { phrase: '/hub/mica', href: '/hub/mica' },
    ],
  },
];

export const BITCOIN_SITE_H3 = 'Există un site de știri Bitcoin în română?';
export const BITCOIN_SITE_ANSWER =
  'Da. Pe Știrile Crypto, știrile despre Bitcoin în română sunt grupate în acest hub (stirilecrypto.ro/hub/bitcoin), iar Pulsul Bitcoin este publicat 7 zile din 7.';

export const BITCOIN_SITE_LINKS: readonly InlineLink[] = [
  { phrase: 'stirilecrypto.ro/hub/bitcoin', href: BITCOIN_HUB_PATH },
  { phrase: 'Pulsul Bitcoin', href: '/market-pulse' },
];

const BITCOIN_LIST_ITEMS = [
  { name: 'Hub Bitcoin', path: BITCOIN_HUB_PATH },
  { name: 'Pulsul Bitcoin', path: '/market-pulse' },
  { name: 'Taxe crypto 2026', path: '/taxe' },
  { name: 'Știri crypto România', path: '/hub/stiri-crypto-romania' },
] as const;

export function buildBitcoinCollectionJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${BITCOIN_HUB_URL}#webpage`,
    url: BITCOIN_HUB_URL,
    name: BITCOIN_H1,
    description: BITCOIN_DESCRIPTION,
    inLanguage: 'ro-RO',
    isPartOf: { '@id': WEBSITE_ID },
    about: [
      { '@type': 'Thing', name: 'Bitcoin' },
      { '@id': ORGANIZATION_ID },
    ],
    publisher: { '@id': ORGANIZATION_ID },
    dateModified: BITCOIN_DATE_MODIFIED,
  };
}

export function buildBitcoinItemListJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: BITCOIN_LIST_ITEMS.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${SITE_URL}${item.path}`,
    })),
  };
}
