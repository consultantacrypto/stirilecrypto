import type { Metadata } from 'next';
import Link from 'next/link';
import EditorialDocument from '@/components/editorial/EditorialDocument';
import { CORRECTIONS_POLICY_PATH, SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const TITLE = 'Corecturi';
const DESCRIPTION =
  'Cum raportezi o eroare pe Știrile Crypto și cum publicăm corectura când un fapt din articol este greșit.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${CORRECTIONS_POLICY_PATH}` },
  ...buildWebsiteShareMetadata({
    title: TITLE,
    description: DESCRIPTION,
    canonical: `${SITE_URL}${CORRECTIONS_POLICY_PATH}`,
  }),
};

export default function CorecturiPage() {
  return (
    <EditorialDocument
      kicker="Redacție"
      title="Corecturi"
      lede="Dacă un fapt dintr-un articol este greșit, vrem să-l îndreptăm. Această pagină spune cum trimiți sesizarea și ce apare pe site după ce o verificăm."
    >
      <h2>Cum raportezi o eroare</h2>
      <p>
        Scrie la{' '}
        <a href="mailto:contact@stirilecrypto.ro">contact@stirilecrypto.ro</a> sau
        folosește pagina <Link href="/contact">Contact</Link>. Ca să putem verifica,
        include:
      </p>
      <ul>
        <li>linkul articolului;</li>
        <li>pasajul greșit, copiat sau descris;</li>
        <li>varianta corectă;</li>
        <li>sursa care susține corectura (document, pagină oficială, set de date).</li>
      </ul>
      <p>
        Mesajele se citesc în programul publicat pe pagina de contact: luni–vineri,
        09:00–18:00. Nu promitem un termen fix în ore. Le luăm în ordinea în care
        putem verifica sursa.
      </p>

      <h2>Cum publicăm corectura</h2>
      <ul>
        <li>
          Dacă eroarea schimbă un fapt (cifră, nume, dată, ce a spus cineva), corectăm
          textul și adăugăm o notă în articol: ce era greșit, ce am schimbat și data.
        </li>
        <li>
          O greșeală de scriere care nu schimbă înțelesul poate fi îndreptată fără
          notă.
        </li>
        <li>
          Nu ștergem un articol ca să ascundem o greșeală. Dacă un material trebuie
          retras pentru că premisa nu mai stă în picioare, lăsăm o notă care spune
          asta.
        </li>
      </ul>

      <h2>Ce nu este, de la sine, o corectură</h2>
      <p>
        O părere diferită despre o analiză nu înseamnă că faptul din text este greșit.
        Market Pulse și celelalte analize sunt lecturi ale pieței, nu previziuni
        garantate. Dacă însă analiza se sprijină pe o cifră sau pe un citat greșit,
        acela se corectă.
      </p>
      <p>
        Modul în care alegem faptele este în{' '}
        <Link href="/politica-editoriala">politica editorială</Link>.
      </p>
    </EditorialDocument>
  );
}
