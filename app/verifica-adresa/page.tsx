import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AddressNotifyForm from '@/components/products/AddressNotifyForm';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';
import { addressCheckUrl, sanitizeSource, withSource } from '@/lib/products/placement';

const TITLE = 'Verifică adresa crypto înainte să trimiți banii';
const DESCRIPTION =
  'Scor de risc AML, fonduri marcate sau sancționate și legături cu scam-uri, înainte de un transfer. Operat de QuickExit LLC. 10 USD, 40 USD sau 140 USD.';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/verifica-adresa` },
  ...buildWebsiteShareMetadata({
    title: TITLE,
    description: DESCRIPTION,
    canonical: `${SITE_URL}/verifica-adresa`,
  }),
};

const PACKS = [
  { price: '10 USD', detail: '1 raport' },
  { price: '40 USD', detail: '5 rapoarte' },
  { price: '140 USD', detail: '20 de rapoarte' },
];

export default async function VerificaAdresaPage({
  searchParams,
}: {
  searchParams: Promise<{ src?: string }>;
}) {
  const query = await searchParams;
  const source = sanitizeSource(query.src);
  const external = addressCheckUrl();
  const externalHref = external ? withSource(external, source ?? 'page') : null;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">QuickExit LLC</p>
        <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="font-[var(--font-space)] text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              {TITLE}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
              Înainte de un transfer, raportul arată scorul de risc AML, dacă fondurile sunt marcate sau
              sancționate și dacă adresa are legături cu scam-uri. Serviciul este operat de QuickExit LLC.
            </p>
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {PACKS.map((pack) => (
                <li key={pack.detail} className="rounded-2xl border border-white/10 px-4 py-4">
                  <p className="font-[var(--font-space)] text-2xl font-black">{pack.price}</p>
                  <p className="mt-1 text-sm text-slate-400">{pack.detail}</p>
                </li>
              ))}
            </ul>
            <ul className="mt-8 space-y-2 text-sm leading-relaxed text-slate-300">
              <li>Scor de risc AML pentru adresa verificată.</li>
              <li>Fonduri marcate sau aflate pe liste de sancțiuni.</li>
              <li>Legături cunoscute cu scam-uri.</li>
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-slate-500">
              Un raport nu este o garanție că un transfer este sigur și nu este consultanță financiară.
              Plata nu se face pe Știrile Crypto.
            </p>
          </div>
          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              {externalHref ? (
                <>
                  <h2 className="font-[var(--font-space)] text-lg font-bold">Verificarea este deschisă</h2>
                  <p className="mt-2 mb-5 text-sm leading-relaxed text-slate-400">
                    Continui pe pagina QuickExit LLC. Acolo alegi pachetul și adresa.
                  </p>
                  <Link
                    href={externalHref}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-black hover:bg-slate-100"
                  >
                    Deschide verificarea
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="font-[var(--font-space)] text-lg font-bold">Anunță-mă</h2>
                  <p className="mt-2 mb-5 text-sm leading-relaxed text-slate-400">
                    Verificarea nu este deschisă încă pe site. Lasă emailul și te anunțăm când poți comanda
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
