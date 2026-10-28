import type { Metadata } from 'next';
import Link from 'next/link';
import EditorialDocument from '@/components/editorial/EditorialDocument';
import { ADVERTISING_POLICY_PATH, SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const TITLE = 'Publicitate și afiliere';
const DESCRIPTION =
  'Cum marchează Știrile Crypto conținutul plătit și linkurile de afiliere, inclusiv recenziile sau mențiunile de produse care pot aduce un comision.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${ADVERTISING_POLICY_PATH}` },
  ...buildWebsiteShareMetadata({
    title: TITLE,
    description: DESCRIPTION,
    canonical: `${SITE_URL}${ADVERTISING_POLICY_PATH}`,
  }),
};

export default function PublicitatePage() {
  return (
    <EditorialDocument
      kicker="Redacție"
      title="Publicitate și afiliere"
      lede="O parte din linkurile de pe site pot aduce un comision. Această pagină spune cum le marcăm și ce nu pot cumpăra."
    >
      <h2>Linkuri de afiliere</h2>
      <p>
        Unele linkuri sunt de afiliere. Dacă deschizi un cont sau cumperi prin ele,
        partenerul poate plăti un comision publicației. Pentru tine nu este un cost
        în plus față de prețul afișat de partener.
      </p>
      <p>
        Casetele din articole care trimit către un partener sunt etichetate „Link
        afiliat” sau „linkuri de afiliere” și folosesc atributul{' '}
        <span className="text-white">sponsored</span>. Textul casetei spune că este
        reclamă, nu o recomandare și nu o garanție că platforma este sigură.
      </p>
      <p>
        Unele ghiduri, mențiuni de produse sau recenzii pot conține și ele linkuri de
        afiliere, chiar dacă restul paginii este educativ. Când un link este de
        afiliere, pagina o spune în apropierea lui.
      </p>

      <h2>Ce nu cumpără un comision</h2>
      <ul>
        <li>Nu vindem un titlu de știre.</li>
        <li>
          Un material plătit sau comandat de un partener, dacă va fi publicat, este
          marcat ca publicitate sau material comercial, separat de știre.
        </li>
        <li>
          Afirmațiile de fapt dintr-un text rămân sub{' '}
          <Link href="/politica-editoriala">politica editorială</Link>, inclusiv când
          în pagină există un link de afiliere.
        </li>
        <li>Nu publicăm promovare plătită de tip „pump” prezentată ca reportaj.</li>
      </ul>

      <h2>Alte surse de bani</h2>
      <p>
        Pe site există și servicii proprii, de exemplu analiza tehnică și verificarea
        de portofel. Sunt pagini de produs, nu știri. Consultanța 1-la-1 este pe
        mihaidaniel.ro și este separată de redacție.
      </p>
      <p>
        Cine editează publicația și datele operatorului sunt pe pagina{' '}
        <Link href="/despre#date-operator">Despre</Link>. CUI-ul nu este publicat încă.
      </p>

      <h2>Parteneriate</h2>
      <p>
        Propunerile de publicitate sau de afiliere se trimit la{' '}
        <a href="mailto:contact@stirilecrypto.ro">contact@stirilecrypto.ro</a>.
      </p>
    </EditorialDocument>
  );
}
