import type { Metadata } from 'next';
import Link from 'next/link';
import EditorialDocument from '@/components/editorial/EditorialDocument';
import { EDITORIAL_POLICY_PATH, SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const TITLE = 'Politică editorială';
const DESCRIPTION =
  'Cum verifică Știrile Crypto faptele, ce surse folosește și cum separă știrea de analiză și de conținutul comercial.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${EDITORIAL_POLICY_PATH}` },
  ...buildWebsiteShareMetadata({
    title: TITLE,
    description: DESCRIPTION,
    canonical: `${SITE_URL}${EDITORIAL_POLICY_PATH}`,
  }),
};

export default function PoliticaEditorialaPage() {
  return (
    <EditorialDocument
      kicker="Redacție"
      title="Politică editorială"
      lede="Știrile Crypto explică ce s-a întâmplat în piața crypto și de ce contează. Această pagină spune cum alegem și verificăm un material înainte să-l publicăm."
    >
      <h2>Cine scrie</h2>
      <p>
        Redactorul publicației este{' '}
        <Link href="/autori/daniel-mihai">Daniel Mihai</Link>. Știrile și analizele de
        piață sunt semnate de el, de <Link href="/autori/cristian-vasile">Cristian Vasile</Link> sau
        de <Link href="/autori/emilian-constantin">Emilian Constantin</Link>. Publicația este
        Știrile Crypto. Consultanța de pe mihaidaniel.ro nu este parte din această redacție.
      </p>

      <h2>Ce publicăm</h2>
      <ul>
        <li>
          <strong className="text-white">Știri</strong>: fapte despre piață, companii,
          reglementare sau securitate, cu sursa care susține afirmația.
        </li>
        <li>
          <strong className="text-white">Analize</strong>, inclusiv Market Pulse: lectură
          a datelor și a contextului. Sunt marcate ca analiză, nu ca fapt împlinit.
        </li>
        <li>
          <strong className="text-white">Educație</strong>: ghiduri din Academie și
          glosar. Explică mecanisme. Nu sunt recomandări de cumpărare sau de vânzare.
        </li>
      </ul>

      <h2>Cum verificăm</h2>
      <ul>
        <li>
          Pornim de la surse publice: anunțuri ale companiilor sau ale autorităților,
          documente de reglementare, date on-chain și relatări ale publicațiilor care
          citează documentul original.
        </li>
        <li>
          O cifră (preț, procent, sumă, dată) se publică împreună cu sursa ei. Dacă
          sursa nu poate fi găsită, cifra nu intră în text ca fapt.
        </li>
        <li>
          O declarație a cuiva este atribuită acelei persoane („X a spus”), nu
          rescrisă ca fapt al redacției.
        </li>
        <li>
          Nu publicăm zvonuri de pe rețele sociale ca știre confirmată. Dacă le
          menționăm, spunem că sunt neconfirmate.
        </li>
      </ul>

      <h2>Ce nu publicăm ca știre</h2>
      <ul>
        <li>Promovare plătită prezentată ca reportaj neutru.</li>
        <li>Proiecte împinse doar pentru că plătesc un comision sau un articol.</li>
        <li>Apeluri de a cumpăra sau a vinde un activ.</li>
        <li>Consultanță financiară personalizată. Nu suntem consultanți autorizați.</li>
      </ul>

      <h2>Corecturi și bani</h2>
      <p>
        Greșelile de fapt se corectază după regulile din pagina{' '}
        <Link href="/corecturi">Corecturi</Link>. Linkurile plătite și de afiliere sunt
        descrise în pagina <Link href="/publicitate">Publicitate și afiliere</Link>.
        Cine publică site-ul este în pagina <Link href="/despre">Despre</Link>.
      </p>
      <p>
        Sesizări editoriale:{' '}
        <a href="mailto:contact@stirilecrypto.ro">contact@stirilecrypto.ro</a>.
      </p>
    </EditorialDocument>
  );
}
