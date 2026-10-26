import Link from 'next/link';
import MorningNewsletter from '@/components/MorningNewsletter';
import { DANIEL_MIHAI } from '@/lib/authors';
import { MAJOR_PRICE_RON } from '@/lib/products/tiers';

const cardClass = 'flex h-full flex-col gap-4 rounded-3xl border border-white/5 bg-[#1c1c1e] p-5 sm:p-6';
const buttonClass =
  'mt-auto inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-black hover:bg-slate-100';

export default function TaxServicePromos({
  id = 'newsletter-taxe',
  location = 'taxe',
}: {
  id?: string;
  location?: string;
}) {
  const consultancyUrl = DANIEL_MIHAI.consultancyUrl?.trim() ?? '';

  return (
    <section aria-label="Mai departe" className="mt-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <article className={cardClass}>
          <h2 className="font-[var(--font-space)] text-xl font-bold tracking-tight text-white">
            Vrei să știi ce faci mai departe cu crypto?
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            Comandă analiza tehnică, de la {MAJOR_PRICE_RON} lei.
          </p>
          <Link href="/analiza-tehnica?src=taxe" className={buttonClass}>
            Comandă analiza
          </Link>
        </article>

        <article className={cardClass}>
          <h2 className="font-[var(--font-space)] text-xl font-bold tracking-tight text-white">
            Înainte să muți crypto, verifică portofelul
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            Află înainte să trimiți bani dacă o adresă e legată de țepe, hack-uri sau fonduri furate.
          </p>
          <Link href="/verificare-portofel?src=taxe" className={buttonClass}>
            Verifică o adresă
          </Link>
        </article>
      </div>

      <MorningNewsletter id={id} location={location} variant="band" />

      {consultancyUrl ? (
        <p className="text-sm leading-relaxed text-slate-400">
          Pentru o discuție 1:1 cu Dani, consultanța este pe{' '}
          <a
            href={consultancyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-200 underline decoration-white/20 underline-offset-2"
          >
            mihaidaniel.ro
          </a>
          .
        </p>
      ) : null}
    </section>
  );
}
