import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { EDITORIAL_POLICY_LINKS, SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

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
            <strong className="text-white">Știrile Crypto</strong> publică știri
            crypto, analize de piață și educație financiară în limba română.
            Redactorul publicației este{' '}
            <Link href="/autori/daniel-mihai" className="text-blue-400 hover:text-blue-300 underline">
              Daniel Mihai
            </Link>
            . Știrile și analizele de piață îi poartă numele pe pagină și în
            datele structurate.
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
              cititor. Sunt marcate în pagină. Detalii la{' '}
              <Link href="/publicitate" className="text-blue-400 hover:text-blue-300 underline">
                Publicitate și afiliere
              </Link>
              .
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-white pt-4">Documente</h2>
          <ul className="list-disc pl-5 space-y-2">
            {EDITORIAL_POLICY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-blue-400 hover:text-blue-300 underline">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/despre" className="text-blue-400 hover:text-blue-300 underline">
                Despre publicație
              </Link>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-white pt-4">Redactor</h2>
          <p>
            Știrile și analizele Market Pulse sunt semnate de{' '}
            <Link href="/autori/daniel-mihai" className="text-blue-400 hover:text-blue-300 underline">
              Daniel Mihai
            </Link>
            . Dacă un material are o altă semnătură, pagina articolului o arată.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">Contact</h2>
          <p>
            Pentru sesizări editoriale, parteneriate sau corecții, scrieți la{' '}
            <a href="mailto:contact@stirilecrypto.ro" className="text-blue-400 hover:text-blue-300 underline">
              contact@stirilecrypto.ro
            </a>{' '}
            sau folosiți pagina{' '}
            <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">
              Contact
            </Link>
            . Modul de publicare a corecturilor este în pagina{' '}
            <Link href="/corecturi" className="text-blue-400 hover:text-blue-300 underline">
              Corecturi
            </Link>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
