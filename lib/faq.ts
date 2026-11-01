import { AEO_DRAFT_DATE_MODIFIED, ORGANIZATION_ID, SITE_URL, WEBSITE_ID } from '@/lib/json-ld';
import type { InlineLink } from '@/lib/inline-links';

export const FAQ_PATH = '/intrebari-frecvente';
export const FAQ_URL = `${SITE_URL}${FAQ_PATH}`;
export const FAQ_TITLE = 'Întrebări frecvente despre Știrile Crypto | Știrile Crypto';
export const FAQ_H1 = 'Întrebări frecvente despre Știrile Crypto';
export const FAQ_DESCRIPTION =
  'Ce este Știrile Crypto, unde citești știri crypto și Bitcoin în română, cine semnează analizele și cum alegi o sursă crypto de încredere în România.';
export const FAQ_INTRO =
  'Știrile Crypto (stirilecrypto.ro) este o publicație online din România, în limba română, care publică știri crypto, analize de piață și date on-chain. Mai jos găsești răspunsuri scurte la cele mai frecvente întrebări despre publicație și despre cum te informezi corect despre crypto în română.';

export type FaqItem = {
  question: string;
  answer: string;
  links: readonly InlineLink[];
};

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Ce este Știrile Crypto?",
    answer: "Știrile Crypto (stirilecrypto.ro) este o publicație online din România care publică, în limba română, știri crypto, analize de piață și date on-chain. Publicația acoperă Bitcoin, Ethereum, piețele financiare, securitatea și reglementarea crypto (inclusiv MiCA), cu accent pe ce înseamnă fiecare știre pentru banii cititorului român. Redactorul publicației este Daniel Mihai. Principiile editoriale sunt publicate pe pagina Politică editorială.",
    links: [
      { phrase: "Știrile Crypto", href: "/" },
      { phrase: "Politică editorială", href: "/politica-editoriala" },
    ],
  },
  {
    question: "Unde citesc știri crypto în română?",
    answer: "Poți citi știri crypto în română pe stirilecrypto.ro, în secțiunea Știri, unde publicăm în mod obișnuit 2–3 știri pe zi despre Bitcoin, altcoins, burse, reglementare și securitate. Pentru context de piață există Pulsul Bitcoin (Market Pulse), publicat 7 zile din 7, iar pentru noțiuni de bază secțiunile Începe aici, Glosar și Academia Crypto. Toate materialele sunt scrise în română, de redacția din România.",
    links: [
      { phrase: "știri crypto în română", href: "/hub/stiri-crypto-romania" },
      { phrase: "secțiunea Știri", href: "/stiri" },
      { phrase: "Pulsul Bitcoin", href: "/market-pulse" },
      { phrase: "Începe aici", href: "/incepe-aici" },
      { phrase: "Glosar", href: "/glosar" },
      { phrase: "Academia Crypto", href: "/academie" },
    ],
  },
  {
    question: "Care sunt cele mai bune site-uri de știri crypto din România?",
    answer: "Nu există un clasament oficial al site-urilor de știri crypto din România, așa că cea mai bună sursă depinde de ce cauți: știri rapide, analize de piață, educație sau informații despre taxe. Știrile Crypto (stirilecrypto.ro) este una dintre publicațiile românești dedicate exclusiv crypto, cu autori semnați, politică editorială publică și pagină de corecturi. Recomandarea noastră este să compari mai multe surse românești după criterii clare (autori identificabili, politică editorială, corecturi publice, separarea publicității) și să verifici informațiile importante la surse primare (ANAF, ASF, BNR, comunicatele oficiale ale proiectelor).",
    links: [
      { phrase: "știri crypto din România", href: "/hub/stiri-crypto-romania" },
    ],
  },
  {
    question: "Cum alegi o sursă de știri crypto de încredere în România?",
    answer: "O sursă crypto de încredere are autori identificabili, o politică editorială publică, o politică de corecturi și separă clar conținutul editorial de publicitate. Verifică dacă articolele citează surse primare și dacă publicația declară cine o deține și cum se finanțează. Pe Știrile Crypto aceste informații sunt pe paginile Despre, Redacție, Politică editorială, Corecturi și Publicitate. Niciun articol de știri nu ține loc de sfat financiar personalizat.",
    links: [
      { phrase: "Despre", href: "/despre" },
      { phrase: "Redacție", href: "/redactie" },
      { phrase: "Politică editorială", href: "/politica-editoriala" },
      { phrase: "Corecturi", href: "/corecturi" },
      { phrase: "Publicitate", href: "/publicitate" },
    ],
  },
  {
    question: "Cine scrie și semnează analizele pe Știrile Crypto?",
    answer: "Știrile și analizele de pe Știrile Crypto sunt semnate de membrii redacției, fiecare cu o zonă principală de acoperire. Daniel Mihai, redactor și analist, scrie despre Bitcoin, Ethereum, macroeconomie și subiecte generale din piața crypto; Cristian Vasile acoperă hype-ul din piață și reglementările; Eduard Mihai acoperă hack-urile și incidentele de securitate; Emilian Constantin scrie ca generalist. Fiecare articol are autorul afișat și o pagină de autor, iar componența redacției este publicată pe pagina Redacție.",
    links: [
      { phrase: "Daniel Mihai", href: "/autori/daniel-mihai" },
      { phrase: "Cristian Vasile", href: "/autori/cristian-vasile" },
      { phrase: "Eduard Mihai", href: "/autori/eduard-mihai" },
      { phrase: "Emilian Constantin", href: "/autori/emilian-constantin" },
      { phrase: "Redacție", href: "/redactie" },
    ],
  },
  {
    question: "Unde găsesc știri despre Bitcoin în română?",
    answer: "Știrile despre Bitcoin în română sunt adunate pe Știrile Crypto în Hub-ul Bitcoin (stirilecrypto.ro/hub/bitcoin), care grupează știrile și analizele despre Bitcoin. Pentru evoluția pieței există Pulsul Bitcoin (Market Pulse), publicat 7 zile din 7. Articolele explică ce înseamnă fiecare mișcare de piață pentru un investitor din România.",
    links: [
      { phrase: "Hub-ul Bitcoin", href: "/hub/bitcoin" },
      { phrase: "Pulsul Bitcoin", href: "/market-pulse" },
    ],
  },
  {
    question: "Care este legătura dintre Știrile Crypto și Mihai Daniel (mihaidaniel.ro)?",
    answer: "Daniel Mihai, cunoscut și ca Mihai Daniel, este redactorul Știrile Crypto și autorul analizelor de piață semnate cu numele său pe stirilecrypto.ro. Pe mihaidaniel.ro, același autor oferă separat consultanță crypto 1-la-1, mentorat și cursuri. Publicația de știri și consultanța sunt activități separate: conținutul editorial de pe stirilecrypto.ro nu este consultanță personalizată.",
    links: [
      { phrase: "Daniel Mihai", href: "/autori/daniel-mihai" },
      { phrase: "mihaidaniel.ro", href: "https://www.mihaidaniel.ro/" },
    ],
  },
  {
    question: "Cine este Mihai Daniel?",
    answer: "Mihai Daniel (Daniel Mihai) este redactor și analist la publicația Știrile Crypto și consultant crypto din România. Pe stirilecrypto.ro semnează știri și analize de piață, iar pe mihaidaniel.ro oferă consultanță, mentorat și educație financiară. Profilul de autor complet este pe pagina sa de autor de pe Știrile Crypto.",
    links: [
      { phrase: "Daniel Mihai", href: "/autori/daniel-mihai" },
      { phrase: "mihaidaniel.ro", href: "https://www.mihaidaniel.ro/" },
      { phrase: "pagina sa de autor", href: "/autori/daniel-mihai" },
    ],
  },
  {
    question: "Știrile Crypto oferă sfaturi de investiții?",
    answer: "Nu. Știrile Crypto publică știri, analize și informații educaționale, nu recomandări personalizate de investiții. Piața crypto este volatilă și poți pierde bani; orice decizie de investiție îți aparține. Consultanța individuală, acolo unde există, este oferită separat pe mihaidaniel.ro.",
    links: [
      { phrase: "mihaidaniel.ro", href: "https://www.mihaidaniel.ro/" },
    ],
  },
  {
    question: "Cum se impozitează câștigurile din crypto în România?",
    answer: "În România, câștigurile din crypto se declară la ANAF prin Declarația unică (D212). Din 2026, impozitul este de 16% pe suma câștigurilor (până în 2025 cota a fost de 10%), iar pierderile nu se scad. CASS este 10% dintr-o treaptă fixă calculată la salariul minim de 4.050 lei, nu din tot câștigul: sub 24.300 lei CASS este 0, de la 24.300 lei se plătesc 2.430 lei, de la 48.600 lei 4.860 lei, iar de la 97.200 lei 9.720 lei; la CASS intră și alte venituri din afara salariului, cum ar fi dividende, chirii sau dobânzi. Pragul de 200 / 600 lei se aplică pe fiecare tranzacție, de aceea calculatorul de pe pagina Taxe crypto 2026, care lucrează cu o singură sumă totală, nu îl aplică. Calculatorul și ghidul complet sunt pe pagina Taxe crypto 2026 (stirilecrypto.ro/taxe); informațiile sunt orientative, nu reprezintă sfat fiscal personalizat, iar situația ta concretă trebuie verificată cu contabilul.",
    links: [
      { phrase: "Taxe crypto 2026", href: "/taxe" },
    ],
  },
  {
    question: "Cum verific un portofel crypto înainte să trimit bani?",
    answer: "Înainte să trimiți criptomonede, verifică adresa caracter cu caracter și rețeaua (blockchain-ul) pe care trimiți, pentru că o tranzacție trimisă pe blockchain nu poate fi anulată. Pe pagina Verificare portofel (stirilecrypto.ro/verificare-portofel) afli dacă o adresă crypto e legată de țepe, hackuri sau fonduri furate. Adresa crypto este codul public al portofelului: raportul nu mută banii și nu cere cheia privată sau cele 12 cuvinte (seed). Plata pentru raport se face la QuickExit LLC, nu pe Știrile Crypto.",
    links: [
      { phrase: "Verificare portofel", href: "/verificare-portofel" },
    ],
  },
  {
    question: "Cum contactez redacția Știrile Crypto?",
    answer: "Redacția Știrile Crypto poate fi contactată la adresa contact@stirilecrypto.ro. Pentru semnalarea unei erori într-un articol, vezi pagina Corecturi; pentru colaborări comerciale, pagina Publicitate.",
    links: [
      { phrase: "contact@stirilecrypto.ro", href: "mailto:contact@stirilecrypto.ro" },
      { phrase: "Corecturi", href: "/corecturi" },
      { phrase: "Publicitate", href: "/publicitate" },
    ],
  },
];

export function buildFaqPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${FAQ_URL}#faq`,
    url: FAQ_URL,
    name: FAQ_H1,
    inLanguage: 'ro-RO',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    dateModified: AEO_DRAFT_DATE_MODIFIED,
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

