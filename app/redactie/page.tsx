import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const REDACTIE_TITLE = 'Redacția';
const REDACTIE_DESCRIPTION =
  'Cine publică Știrile Crypto: rolul redacției, principii editoriale și date de contact.';

export const metadata: Metadata = {
  title: REDACTIE_TITLE,
  description: REDACTIE_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/redactie`,
  },
  ...buildWebsiteShareMetadata({
    title: REDACTIE_TITLE,
    description: REDACTIE_DESCRIPTION,
    canonical: `${SITE_URL}/redactie`,
  }),
};

export default function RedactiePage() {
  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />

      <main className="pt-32 pb-20 px-4 md:px-8 max-w-3xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4">
          Redacție
        </p>
        <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
          Redacția Știrile Crypto
        </h1>

        <div className="space-y-6 text-gray-300 leading-relaxed font-[var(--font-inter)]">
          <p>
            Articolele fără un autor individual menționat sunt publicate de{' '}
            <strong className="text-white">Redacția Știrile Crypto</strong>.
            Publicația acoperă știri crypto, analize de piață și educație
            financiară în limba română.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">Rolul redacției</h2>
          <p>
            Redacția selectează, verifică și publică materialele de pe{' '}
            <Link href="/" className="text-blue-400 hover:text-blue-300 underline">
              stirilecrypto.ro
            </Link>
            : știri, analize Market Pulse, interviuri și ghiduri din Academie.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">Principii editoriale</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Conținutul este educațional și informativ, nu consultanță financiară
              autorizată.
            </li>
            <li>
              Analizele se bazează pe date publice, context de piață și cadru
              legislativ, nu pe promovare plătită de tip „pump & dump”.
            </li>
            <li>
              Unele linkuri pot fi de afiliere, fără cost suplimentar pentru
              cititor. Detalii în pagina{' '}
              <Link href="/despre" className="text-blue-400 hover:text-blue-300 underline">
                Despre
              </Link>
              .
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-white pt-4">Contact</h2>
          <p>
            Pentru sesizări editoriale, parteneriate sau corecții, folosiți pagina{' '}
            <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">
              Contact
            </Link>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
