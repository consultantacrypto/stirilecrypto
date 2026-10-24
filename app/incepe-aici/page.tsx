import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AffiliatePartnerBox from '@/components/AffiliatePartnerBox';
import { FISCAL_GUIDE_PATH } from '@/lib/fiscal-2026';
import { MAJOR_PRICE_RON } from '@/lib/products/tiers';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const TITLE = 'Începe aici';
const DESCRIPTION =
  'Șapte pași pentru cine pornește de la zero: ce e Bitcoin, cum cumperi, unde ții monedele, țepe, taxe și piață.';

const linkClass =
  'mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-black hover:bg-slate-100';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/incepe-aici` },
  ...buildWebsiteShareMetadata({ title: TITLE, description: DESCRIPTION, canonical: `${SITE_URL}/incepe-aici` }),
};

export default function IncepeAiciPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-400">Ghid de început</p>
        <h1 className="mt-3 font-[var(--font-space)] text-4xl font-bold tracking-tight md:text-5xl">Începe aici</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
          Șapte pași, pe rând. Poți să te oprești după oricare. Glosarul stă separat, la final.
        </p>

        <ol className="mt-10 space-y-6">
          <li className="rounded-3xl border border-white/5 bg-[#1c1c1e] p-5 sm:p-6">
            <StepHead n="1" title="Ce e Bitcoin și crypto, în 2 minute" />
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Bitcoin este o rețea publică în care oamenii își trimit bani fără o bancă la mijloc. Crypto este
              numele larg pentru monedele de pe astfel de rețele. Nu trebuie să înțelegi codul ca să urmărești
              știrile.
            </p>
            <Link href="/academie/ce-este-bitcoin-ghid-complet" className={linkClass}>
              Citește ghidul despre Bitcoin
            </Link>
          </li>

          <li className="rounded-3xl border border-white/5 bg-[#1c1c1e] p-5 sm:p-6">
            <StepHead n="2" title="Cum cumperi în siguranță" />
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Cumperi de pe o platformă de schimb care cere verificarea identității și îți lasă pornită
              autentificarea în doi pași. Cât timp monedele stau acolo, platforma ține cheile. Pagina aceasta
              nu alege platforma în locul tău.
            </p>
            <AffiliatePartnerBox />
          </li>

          <li className="rounded-3xl border border-white/5 bg-[#1c1c1e] p-5 sm:p-6">
            <StepHead n="3" title="Unde ții monedele" />
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Pe platformă e comod, dar retragerea poate fi oprită de platformă. Într-un portofel propriu,
              cheile sunt la tine, împreună cu fraza de 12 sau 24 de cuvinte. Cine are fraza, are și monedele.
              Nu o trimite nimănui.
            </p>
            <Link href="/academie/portofele-crypto-hot-vs-cold-ghid" className={linkClass}>
              Portofel pe platformă sau portofel propriu
            </Link>
          </li>

          <li className="rounded-3xl border border-white/5 bg-[#1c1c1e] p-5 sm:p-6">
            <StepHead n="4" title="Cum eviți țepele" />
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Înainte să trimiți crypto, verifici dacă adresa apare lângă țepe, hack-uri sau fonduri furate.
              Același lucru dacă tocmai ai primit o adresă pe care nu o cunoști. Verificarea citește istoricul
              public și nu îți cere fraza secretă.
            </p>
            <Link href="/verificare-portofel?src=incepe-aici" className={linkClass}>
              Verificare portofel
            </Link>
          </li>

          <li className="rounded-3xl border border-white/5 bg-[#1c1c1e] p-5 sm:p-6">
            <StepHead n="5" title="Taxe" />
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Câștigul din crypto se declară. Impozitul pe venit și contribuția de sănătate nu se calculează
              la fel. Estimarea de pe site nu înlocuiește contabilul.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/taxe" className={`${linkClass} mt-0`}>
                Calculatorul de taxe
              </Link>
              <Link
                href={FISCAL_GUIDE_PATH}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-bold text-white hover:bg-white/10"
              >
                Ghidul fiscal
              </Link>
            </div>
          </li>

          <li className="rounded-3xl border border-white/5 bg-[#1c1c1e] p-5 sm:p-6">
            <StepHead n="6" title="Cum urmărești piața" />
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Piața azi arată prețurile în dolari. Pulsul Bitcoin se publică luni și joi, la ora 19. Dimineața
              poți primi un email cu ce contează în piață, de pe prima pagină.
            </p>
            <Link href="/market" className={linkClass}>
              Deschide Piața azi
            </Link>
          </li>

          <li className="rounded-3xl border border-white/5 bg-[#1c1c1e] p-5 sm:p-6">
            <StepHead n="7" title="Vrei o părere pe un token?" />
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Comanzi o analiză pe șapte intervale de timp și o secțiune de risc pentru tokenul tău. Pornește
              de la {MAJOR_PRICE_RON} lei. Este material educațional, nu un apel să cumperi sau să vinzi.
            </p>
            <Link href="/analiza-tehnica?src=incepe-aici" className={linkClass}>
              Comandă analiza
            </Link>
          </li>
        </ol>

        <p className="mt-10 text-sm text-slate-400">
          Nu știi un termen?{' '}
          <Link href="/glosar" className="font-semibold text-white underline underline-offset-4 hover:text-blue-300">
            Vezi Glosarul
          </Link>
          .
        </p>
      </div>
      <Footer />
    </main>
  );
}

function StepHead({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
        {n}
      </span>
      <h2 className="font-[var(--font-space)] text-xl font-bold tracking-tight text-white">{title}</h2>
    </div>
  );
}
