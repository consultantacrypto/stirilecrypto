import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const TITLE = 'Media kit';
const DESCRIPTION =
  'Media kit 2026 pentru Știrile Crypto și Daniel Mihai, în română și în engleză. Contact: contact@stirilecrypto.ro.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/media-kit`,
  },
  ...buildWebsiteShareMetadata({
    title: TITLE,
    description: DESCRIPTION,
    canonical: `${SITE_URL}/media-kit`,
  }),
};

const KITS = [
  {
    href: '/media-kit/StirileCrypto-Media-Kit-2026-RO.pdf',
    file: 'StirileCrypto-Media-Kit-2026-RO.pdf',
    languageRo: 'Română',
    languageEn: 'Romanian',
    title: 'Știrile Crypto — Media Kit 2026',
    bodyRo: 'Pachete de sponsorizare pentru publicație, în limba română.',
    bodyEn: 'Sponsorship packages for the publication, in Romanian.',
  },
  {
    href: '/media-kit/StirileCrypto-Media-Kit-2026-EN.pdf',
    file: 'StirileCrypto-Media-Kit-2026-EN.pdf',
    languageRo: 'Engleză',
    languageEn: 'English',
    title: 'Știrile Crypto — Media Kit 2026',
    bodyRo: 'Pachete de sponsorizare pentru publicație, în limba engleză.',
    bodyEn: 'Sponsorship packages for the publication, in English.',
  },
  {
    href: '/media-kit/Daniel-Mihai-Media-Kit-2026.pdf',
    file: 'Daniel-Mihai-Media-Kit-2026.pdf',
    languageRo: 'Engleză',
    languageEn: 'English',
    title: 'Daniel Mihai — Media Kit 2026',
    bodyRo: 'Media kit și rate card pentru Daniel Mihai, în limba engleză.',
    bodyEn: 'Media kit and rate card for Daniel Mihai, in English.',
  },
] as const;

export default function MediaKitPage() {
  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-32 md:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-blue-400">Media kit</p>
        <h1 className="mb-6 text-4xl font-black leading-tight md:text-5xl">Media kit 2026</h1>
        <p className="mb-3 text-lg leading-relaxed text-gray-400">
          Descarcă kiturile de presă. Prețurile și pachetele sunt cele din PDF.
        </p>
        <p className="mb-10 text-lg leading-relaxed text-gray-500">
          Download the press kits. Prices and packages are the ones printed in each PDF.
        </p>

        <ul className="space-y-4">
          {KITS.map((kit) => (
            <li key={kit.href} className="rounded-2xl border border-white/5 bg-[#0b1221] p-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-400">
                {kit.languageRo}
                <span className="text-gray-500"> · {kit.languageEn}</span>
              </p>
              <h2 className="mb-2 text-xl font-bold text-white">{kit.title}</h2>
              <p className="text-gray-300">{kit.bodyRo}</p>
              <p className="mt-1 text-gray-500">{kit.bodyEn}</p>
              <a
                href={kit.href}
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                Descarcă PDF
                <span className="font-medium text-blue-100"> · Download PDF</span>
              </a>
              <p className="mt-3 break-all font-[var(--font-inter)] text-xs text-gray-500">{kit.file}</p>
            </li>
          ))}
        </ul>

        <section className="mt-10 rounded-2xl border border-white/5 bg-[#0b1221] p-6">
          <h2 className="mb-3 text-xl font-bold text-white">Contact</h2>
          <p className="text-gray-300">
            Propunerile de publicitate se trimit la{' '}
            <a href="mailto:contact@stirilecrypto.ro" className="text-blue-400 underline hover:text-blue-300">
              contact@stirilecrypto.ro
            </a>
            .
          </p>
          <p className="mt-2 text-gray-500">
            Send advertising briefs to{' '}
            <a href="mailto:contact@stirilecrypto.ro" className="text-blue-400 underline hover:text-blue-300">
              contact@stirilecrypto.ro
            </a>
            .
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
