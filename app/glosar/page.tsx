import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { GLOSSARY } from '@/lib/glosar';
import { FISCAL_GUIDE_PATH } from '@/lib/fiscal-2026';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const TITLE = 'Glosar crypto';
const DESCRIPTION = 'Termeni crypto explicați pe scurt, în română, pentru cine deschide site-ul prima dată.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/glosar` },
  ...buildWebsiteShareMetadata({ title: TITLE, description: DESCRIPTION, canonical: `${SITE_URL}/glosar` }),
};

export default function GlosarPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-[var(--font-space)] text-4xl font-black tracking-tight md:text-5xl">Glosar crypto</h1>
        <p className="mt-4 text-lg text-slate-300">
          {GLOSSARY.length} cuvinte pe care le vei întâlni în știri. Pentru taxe, mergi la{' '}
          <Link href={FISCAL_GUIDE_PATH} className="text-blue-300 underline underline-offset-4">
            ghidul fiscal
          </Link>{' '}
          și la{' '}
          <Link href="/academie" className="text-blue-300 underline underline-offset-4">
            Academie
          </Link>
          .
        </p>
        <dl className="mt-10 space-y-8">
          {GLOSSARY.map((entry) => (
            <div key={entry.slug} id={entry.slug}>
              <dt className="font-[var(--font-space)] text-xl font-bold text-white">{entry.term}</dt>
              <dd className="mt-2 leading-relaxed text-slate-300">{entry.definition}</dd>
            </div>
          ))}
        </dl>
      </div>
      <Footer />
    </main>
  );
}
