import type { InlineLink } from '@/lib/inline-links';
import { AEO_DRAFT_DATE_MODIFIED, ORGANIZATION_ID, SITE_URL, WEBSITE_ID } from '@/lib/json-ld';

export const HUB_PATH = '/hub/stiri-crypto-romania';
export const HUB_URL = `${SITE_URL}${HUB_PATH}`;
export const HUB_TITLE =
  'Surse crypto România 2026: știri, Bitcoin și analize în română | Știrile Crypto';
export const HUB_H1 = 'Surse crypto din România, în 2026';
export const HUB_DESCRIPTION =
  'Surse crypto pentru cititorii din România, în 2026: unde citești știri și Bitcoin în română și cum verifici o informație la ANAF, ASF, BNR și ESMA.';
export const HUB_UPDATED_LABEL = '1 noiembrie 2026';

/** First paragraph under the H1. Kept identical on /despre. */
export const HUB_ENTITY =
  'Știrile Crypto (stirilecrypto.ro) este o publicație online din România care publică, în limba română, știri crypto, analize de piață și date on-chain despre Bitcoin, Ethereum, reglementare (MiCA), securitate și taxe. Redactorul publicației este Daniel Mihai (cunoscut și ca Mihai Daniel), care semnează analizele de piață alături de redacție. Publicația are politică editorială și politică de corecturi publice și poate fi contactată la contact@stirilecrypto.ro.';

export const HUB_ENTITY_LINKS: readonly InlineLink[] = [
  { phrase: 'Știrile Crypto', href: '/' },
  { phrase: 'Daniel Mihai', href: '/autori/daniel-mihai' },
  { phrase: 'politică editorială', href: '/politica-editoriala' },
  { phrase: 'corecturi', href: '/corecturi' },
  { phrase: 'contact@stirilecrypto.ro', href: 'mailto:contact@stirilecrypto.ro' },
];

export const HUB_FIND =
  'Hub-ul adună locurile în care Știrile Crypto publică pentru cititorii din România: secțiunea Știri, unde apar în mod obișnuit 2–3 știri pe zi, Pulsul Bitcoin, publicat 7 zile din 7, și ghidurile despre reglementare, securitate și taxe crypto.';

export const HUB_FIND_LINKS: readonly InlineLink[] = [
  { phrase: 'secțiunea Știri', href: '/stiri' },
  { phrase: 'Pulsul Bitcoin', href: '/market-pulse' },
  { phrase: 'reglementare', href: '/hub/mica' },
  { phrase: 'securitate', href: '/hub/securitate' },
  { phrase: 'taxe crypto', href: '/taxe' },
];

export const HUB_WHERE_INTRO =
  'Știrile crypto în română, pe Știrile Crypto, stau în secțiunile de mai jos. Fiecare rând spune ce găsești acolo.';

export type HubEntry = {
  href: string;
  title: string;
  text: string;
};

export const HUB_ENTRIES: readonly HubEntry[] = [
  {
    href: '/stiri',
    title: 'Știri',
    text: 'Secțiunea Știri publică, în mod obișnuit, 2–3 știri pe zi despre Bitcoin, altcoins, burse, reglementare și securitate.',
  },
  {
    href: '/hub/bitcoin',
    title: 'Hub Bitcoin',
    text: 'Hub-ul Bitcoin grupează știrile și analizele despre Bitcoin.',
  },
  {
    href: '/market-pulse',
    title: 'Pulsul Bitcoin',
    text: 'Pulsul Bitcoin (Market Pulse) este publicat 7 zile din 7 și explică evoluția pieței.',
  },
  {
    href: '/hub/mica',
    title: 'Hub MiCA',
    text: 'Hub-ul MiCA grupează articolele despre reglementarea crypto în Uniunea Europeană.',
  },
  {
    href: '/hub/securitate',
    title: 'Hub Securitate',
    text: 'Hub-ul Securitate grupează ghidurile și alertele despre securitatea portofelelor, hack-uri și phishing.',
  },
  {
    href: '/interviuri',
    title: 'Interviuri',
    text: 'Secțiunea Interviuri publică conversațiile redacției.',
  },
  {
    href: '/taxe',
    title: 'Taxe crypto 2026',
    text: 'Pagina Taxe crypto 2026 are calculatorul și ghidul despre impozitarea câștigurilor din crypto în România.',
  },
  {
    href: '/verificare-portofel',
    title: 'Verificare portofel',
    text: 'Pagina Verificare portofel spune dacă o adresă crypto e legată de țepe, hackuri sau fonduri furate.',
  },
  {
    href: '/incepe-aici',
    title: 'Începe aici',
    text: 'Începe aici adună pașii de bază pentru cine citește crypto în română.',
  },
  {
    href: '/glosar',
    title: 'Glosar',
    text: 'Glosarul explică termenii folosiți în știri.',
  },
  {
    href: '/academie',
    title: 'Academia Crypto',
    text: 'Academia Crypto publică ghiduri educaționale. Ghidurile explică mecanisme și nu sunt recomandări de cumpărare sau de vânzare.',
  },
];

export const HUB_SOURCES =
  'Știrile Crypto pornește de la surse publice: comunicate oficiale, date on-chain, documente ale autorităților și documente ale Uniunii Europene pentru MiCA. O cifră se publică împreună cu sursa ei. Știrea este separată de analiză: faptele stau în știre, iar lectura datelor este marcată ca analiză. Greșelile de fapt se corectază public. Conținutul plătit și linkurile de afiliere sunt separate de textul editorial.';

export const HUB_SOURCES_LINKS: readonly InlineLink[] = [
  { phrase: 'surse publice', href: '/politica-editoriala' },
  { phrase: 'Greșelile de fapt se corectază public', href: '/corecturi' },
  { phrase: 'Conținutul plătit și linkurile de afiliere', href: '/publicitate' },
];

export const HUB_USEFUL =
  'Nu există un clasament oficial al surselor crypto din România. O sursă se evaluează după autori identificabili, politică editorială publică, corecturi publice și separarea publicității de textul editorial. Informațiile importante se verifică la surse primare: ANAF pentru obligațiile fiscale, ASF și BNR pentru avertismente și reglementarea națională, ESMA și textul MiCA pentru cadrul Uniunii Europene. Pentru preț și volum se folosesc agregatoare de date de piață. Pentru o tranzacție sau o adresă publică se folosesc exploratoare blockchain.';

export const HUB_USEFUL_LINKS: readonly InlineLink[] = [
  { phrase: 'ANAF', href: 'https://www.anaf.ro/' },
  { phrase: 'ASF', href: 'https://www.asfromania.ro/' },
  { phrase: 'BNR', href: 'https://www.bnr.ro/' },
  { phrase: 'ESMA', href: 'https://www.esma.europa.eu/' },
  { phrase: 'textul MiCA', href: 'https://eur-lex.europa.eu/legal-content/RO/TXT/?uri=CELEX%3A32023R1114' },
  { phrase: 'politică editorială publică', href: '/politica-editoriala' },
  { phrase: 'corecturi publice', href: '/corecturi' },
  { phrase: 'separarea publicității', href: '/publicitate' },
];

export const HUB_BITCOIN =
  'Știrile și analizele despre Bitcoin pentru cititorii din România sunt grupate în Hub-ul Bitcoin. Pulsul Bitcoin (Market Pulse) este publicat 7 zile din 7 și explică evoluția pieței. Analizele folosesc date on-chain. Articolele pun mișcarea de piață în contextul cititorului din România: lei, taxe și platformele disponibile în țară.';

export const HUB_BITCOIN_LINKS: readonly InlineLink[] = [
  { phrase: 'Hub-ul Bitcoin', href: '/hub/bitcoin' },
  { phrase: 'Pulsul Bitcoin', href: '/market-pulse' },
  { phrase: 'taxe', href: '/taxe' },
];

export const HUB_WHO =
  'Daniel Mihai este redactor și analist și scrie despre Bitcoin, Ethereum, macroeconomie și subiecte generale. Cristian Vasile acoperă hype-ul din piață și reglementările. Eduard Mihai — hack-uri. Emilian Constantin scrie ca generalist. Componența redacției este pe pagina Redacție. Consultanța 1-la-1 este separată de publicație, pe mihaidaniel.ro.';

export const HUB_WHO_LINKS: readonly InlineLink[] = [
  { phrase: 'Daniel Mihai', href: '/autori/daniel-mihai' },
  { phrase: 'Cristian Vasile', href: '/autori/cristian-vasile' },
  { phrase: 'Eduard Mihai', href: '/autori/eduard-mihai' },
  { phrase: 'Emilian Constantin', href: '/autori/emilian-constantin' },
  { phrase: 'Redacție', href: '/redactie' },
  { phrase: 'mihaidaniel.ro', href: 'https://www.mihaidaniel.ro/' },
];

export const HUB_FAQ = [
  {
    question: 'Unde citesc știri crypto în română?',
    answer:
      'Poți citi știri crypto în română pe stirilecrypto.ro, în secțiunea Știri, unde publicăm în mod obișnuit 2–3 știri pe zi despre Bitcoin, altcoins, burse, reglementare și securitate.',
  },
  {
    question: 'Care sunt cele mai bune site-uri de știri crypto din România?',
    answer:
      'Nu există un clasament oficial al site-urilor de știri crypto din România, așa că cea mai bună sursă depinde de ce cauți: știri rapide, analize de piață, educație sau informații despre taxe.',
  },
  {
    question: 'Unde găsesc știri despre Bitcoin în română?',
    answer:
      'Știrile despre Bitcoin în română sunt adunate pe Știrile Crypto în Hub-ul Bitcoin (stirilecrypto.ro/hub/bitcoin), care grupează știrile și analizele despre Bitcoin.',
  },
  {
    question: 'Care este legătura dintre Știrile Crypto și Mihai Daniel (mihaidaniel.ro)?',
    answer:
      'Daniel Mihai, cunoscut și ca Mihai Daniel, este redactorul Știrile Crypto și autorul analizelor de piață semnate cu numele său pe stirilecrypto.ro.',
  },
] as const;

export function hubCopyBlob(): string {
  return [
    HUB_ENTITY,
    HUB_FIND,
    HUB_WHERE_INTRO,
    ...HUB_ENTRIES.map((entry) => `${entry.title} ${entry.text}`),
    HUB_SOURCES,
    HUB_USEFUL,
    HUB_BITCOIN,
    HUB_WHO,
    ...HUB_FAQ.map((item) => `${item.question} ${item.answer}`),
  ].join('\n');
}

export function buildHubCollectionJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${HUB_URL}#webpage`,
    url: HUB_URL,
    name: HUB_H1,
    description: HUB_DESCRIPTION,
    inLanguage: 'ro-RO',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    dateModified: AEO_DRAFT_DATE_MODIFIED,
  };
}

export function buildHubItemListJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: HUB_ENTRIES.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.title,
      url: `${SITE_URL}${entry.href}`,
    })),
  };
}
