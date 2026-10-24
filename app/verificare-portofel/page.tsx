import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AddressNotifyForm from '@/components/products/AddressNotifyForm';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';
import { addressCheckUrl, sanitizeSource, walletCheckIsLive, withSource } from '@/lib/products/placement';

const TITLE = 'Verifică portofelul înainte să trimiți bani';
const DESCRIPTION = 'Afli dacă adresa crypto e legată de țepe, hackuri sau fonduri furate.';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/verificare-portofel` },
  ...buildWebsiteShareMetadata({
    title: TITLE,
    description: DESCRIPTION,
    canonical: `${SITE_URL}/verificare-portofel`,
  }),
};

const CHECKS = [
  'Legătura cu țepe, hack-uri sau sancțiuni',
  'Expunerea la mixere',
  'Istoricul adresei',
];

const STEPS = [
  {
    n: '1',
    title: 'Copiezi adresa',
    body: 'Este codul public al portofelului. De obicei începe cu 0x, T sau bc1. Nu este nevoie de cheie sau de cele 12 cuvinte.',
  },
  {
    n: '2',
    title: 'Se citește istoricul public',
    body: 'Verificarea caută legătura cu țepe, hack-uri sau sancțiuni, expunerea la mixere și istoricul adresei.',
  },
  {
    n: '3',
    title: 'Primești raportul',
    body: 'Raportul descrie ce apare în istoricul public. Tu decizi dacă trimiți.',
  },
];

const PACKS = [
  { price: '10 USD', detail: '1 raport' },
  { price: '40 USD', detail: '5 rapoarte' },
  { price: '140 USD', detail: '20 de rapoarte' },
];

export default async function VerificarePortofelPage({
  searchParams,
}: {
  searchParams: Promise<{ src?: string }>;
}) {
  const query = await searchParams;
  const source = sanitizeSource(query.src);
  const external = addressCheckUrl();
  const live = walletCheckIsLive();
  const externalHref = external ? withSource(external, source ?? 'page') : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-400">Verificare portofel</p>
          {live ? null : (
            <span className="rounded-full bg-blue-500/20 px-3 py-1 text-[10px] font-semibold text-blue-400">
              Disponibil în curând
            </span>
          )}
        </div>
        <h1 className="mt-4 max-w-3xl font-[var(--font-space)] text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          {TITLE}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">{DESCRIPTION}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
          Adresa crypto este codul public al portofelului, nu o adresă poștală. Raportul nu mută banii și nu
          cere cheia sau cele 12 cuvinte.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-[var(--font-space)] text-xl font-bold">Ce verificăm</h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {CHECKS.map((item) => (
                <li key={item} className="rounded-3xl border border-white/5 bg-[#1c1c1e] px-4 py-4 text-sm leading-relaxed text-slate-200">
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-[var(--font-space)] text-xl font-bold">Cum funcționează</h2>
            <ol className="mt-4 space-y-3">
              {STEPS.map((step) => (
                <li key={step.n} className="flex gap-4 rounded-3xl border border-white/5 bg-[#1c1c1e] px-4 py-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
                    {step.n}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{step.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-400">{step.body}</span>
                  </span>
                </li>
              ))}
            </ol>

            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {PACKS.map((pack) => (
                <li key={pack.detail} className="rounded-3xl border border-white/5 bg-[#1c1c1e] px-4 py-4">
                  <p className="font-[var(--font-space)] text-2xl font-bold">{pack.price}</p>
                  <p className="mt-1 text-sm text-slate-400">{pack.detail}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-slate-500">
              Serviciul este operat de QuickExit LLC. Un raport nu garantează că un transfer este sigur și nu
              este consultanță financiară. Plata nu se face pe Știrile Crypto.
            </p>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-3xl border border-white/5 bg-[#1c1c1e] p-5 sm:p-6">
              {externalHref ? (
                <>
                  <h2 className="font-[var(--font-space)] text-lg font-bold">Verificarea este deschisă</h2>
                  <p className="mt-2 mb-5 text-sm leading-relaxed text-slate-400">
                    Continui pe pagina QuickExit LLC. Acolo alegi pachetul și adresa portofelului.
                  </p>
                  <Link
                    href={externalHref}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-black hover:bg-slate-100"
                  >
                    Verifică o adresă
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="font-[var(--font-space)] text-lg font-bold">Lista de așteptare</h2>
                  <p className="mt-2 mb-5 text-sm leading-relaxed text-slate-400">
                    Verificarea de portofel nu este deschisă încă. Lasă emailul și te anunțăm când poți comanda
                    un raport.
                  </p>
                  <AddressNotifyForm source={source} />
                </>
              )}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
