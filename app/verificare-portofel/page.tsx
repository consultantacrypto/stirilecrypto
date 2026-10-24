import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AddressNotifyForm from '@/components/products/AddressNotifyForm';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';
import { addressCheckUrl, sanitizeSource, withSource } from '@/lib/products/placement';

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

const STEPS = [
  {
    n: '1',
    title: 'Cineva îți cere să trimiți crypto',
    body: 'Poate fi un deal, o mașină sau un „job”. Îți dă o adresă și îți spune să trimiți USDT, BTC sau altceva.',
  },
  {
    n: '2',
    title: 'Verifici adresa înainte să trimiți',
    body: 'Copiezi adresa portofelului (un șir care începe de obicei cu 0x, T sau bc1). Nu trimiți banii încă.',
  },
  {
    n: '3',
    title: 'Primești un raport',
    body: 'Afli dacă adresa e legată de țepe, hackuri sau fonduri furate. Abia apoi decizi dacă trimiți.',
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
  const externalHref = external ? withSource(external, source ?? 'page') : null;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Anti-țeapă · QuickExit LLC
        </p>
        <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="font-[var(--font-space)] text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              {TITLE}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">{DESCRIPTION}</p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
              Adresa crypto nu este o adresă poștală. Este portofelul în care ajung banii: un cod public,
              nu strada și numărul. Raportul nu îți mută banii și nu îți cere cheia sau cele 12 cuvinte.
              Citește doar istoricul public al adresei.
            </p>

            <h2 className="mt-10 font-[var(--font-space)] text-xl font-bold">Cum funcționează</h2>
            <ol className="mt-4 space-y-3">
              {STEPS.map((step) => (
                <li key={step.n} className="flex gap-4 rounded-2xl border border-white/10 px-4 py-4">
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

            <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 px-4 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-200/80">Exemplu</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                Pe Telegram, cineva îți scrie: „Trimite 2.000 USDT și îți dau mașina” — sau jobul, sau
                deal-ul OTC. Adresa pe care ți-o dă poate fi a unei țepe. Verifici portofelul înainte să
                trimiți.
              </p>
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {PACKS.map((pack) => (
                <li key={pack.detail} className="rounded-2xl border border-white/10 px-4 py-4">
                  <p className="font-[var(--font-space)] text-2xl font-black">{pack.price}</p>
                  <p className="mt-1 text-sm text-slate-400">{pack.detail}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-slate-500">
              Serviciul este operat de QuickExit LLC. Un raport nu garantează că un transfer este sigur
              și nu este consultanță financiară. Plata nu se face pe Știrile Crypto.
            </p>
          </div>
          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
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
                    Deschide verificarea
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="font-[var(--font-space)] text-lg font-bold">Anunță-mă</h2>
                  <p className="mt-2 mb-5 text-sm leading-relaxed text-slate-400">
                    Verificarea de portofel nu este deschisă încă pe site. Lasă emailul și te anunțăm când
                    poți comanda un raport.
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
