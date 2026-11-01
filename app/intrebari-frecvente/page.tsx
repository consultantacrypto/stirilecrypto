import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LinkedText from '@/components/LinkedText';
import {
  FAQ_DESCRIPTION,
  FAQ_H1,
  FAQ_INTRO,
  FAQ_ITEMS,
  FAQ_PATH,
  FAQ_TITLE,
  FAQ_URL,
  buildFaqPageJsonLd,
} from '@/lib/faq';
import { buildBreadcrumbJsonLd, buildWebsiteShareMetadata } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: { absolute: FAQ_TITLE },
  description: FAQ_DESCRIPTION,
  alternates: { canonical: FAQ_URL },
  ...buildWebsiteShareMetadata({
    title: FAQ_TITLE,
    description: FAQ_DESCRIPTION,
    canonical: FAQ_URL,
  }),
};

export default function IntrebariFrecventePage() {
  const faqJsonLd = buildFaqPageJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Acasă', path: '/' },
    { name: FAQ_H1, path: FAQ_PATH },
  ]);

  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans selection:bg-blue-500/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-32 md:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-blue-400">Redacție</p>
        <h1 className="mb-6 text-4xl font-black leading-tight md:text-5xl">{FAQ_H1}</h1>
        <p className="mb-10 text-lg leading-relaxed text-gray-400">{FAQ_INTRO}</p>
        <div className="space-y-8 font-[var(--font-inter)] leading-relaxed text-gray-300">
          {FAQ_ITEMS.map((item) => (
            <section key={item.question}>
              <h2 className="text-2xl font-bold text-white">{item.question}</h2>
              <LinkedText text={item.answer} links={item.links} className="mt-3" />
            </section>
          ))}
        </div>
        <p className="mt-12 text-sm text-gray-400">
          <Link href="/hub/stiri-crypto-romania" className="text-blue-400 underline hover:text-blue-300">
            Știri crypto România
          </Link>
          {' · '}
          <Link href="/despre" className="text-blue-400 underline hover:text-blue-300">
            Despre publicație
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
