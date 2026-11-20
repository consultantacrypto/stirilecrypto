import Link from 'next/link';
import { MAJOR_PRICE_RON } from '@/lib/products/tiers';

const cardClass = 'flex h-full flex-col gap-4 rounded-3xl border border-white/5 bg-[#1c1c1e] p-5 sm:p-6';
const buttonClass =
  'mt-auto inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-black hover:bg-slate-100';

export default function HomeServiceStrip() {
  return (
    <section aria-label="Serviciile noastre" className="py-10">
      <h2 className="font-[var(--font-space)] text-xl font-bold tracking-tight text-white md:text-2xl">
        Serviciile noastre
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
        <article className={cardClass}>
          <h3 className="font-[var(--font-space)] text-xl font-bold tracking-tight text-white">
            Analiză tehnică pe tokenul tău
          </h3>
          <p className="text-sm leading-relaxed text-slate-300">
            7 timeframe-uri + risc token, de la {MAJOR_PRICE_RON} lei, livrare în 24h.
          </p>
          <Link href="/analiza-tehnica?src=home" className={buttonClass}>
            Comandă analiza
          </Link>
        </article>

        <article className={cardClass}>
          <h3 className="font-[var(--font-space)] text-xl font-bold tracking-tight text-white">
            Verificare portofel crypto
          </h3>
          <p className="text-sm leading-relaxed text-slate-300">
            Află înainte să trimiți bani dacă o adresă e legată de țepe, hack-uri sau fonduri furate.
          </p>
          <Link href="/verificare-portofel?src=home" className={buttonClass}>
            Verifică o adresă
          </Link>
        </article>
      </div>
    </section>
  );
}
