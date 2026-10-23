import Link from 'next/link';
import { productCatalog } from '@/lib/products/config';

export default function PremiumTaSection() {
  const catalog = productCatalog();

  return (
    <section id="premium-ta" aria-label="Analize la comandă" className="mb-12">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="font-[var(--font-space)] text-xl font-bold text-white">La comandă</h2>
        {catalog.paymentsEnabled ? null : (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Disponibil în curând
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Offer
          href="/analiza-tehnica"
          title={catalog.ta.name}
          price={`${catalog.ta.priceRon} RON`}
          text="Un activ, șapte grafice: 1h, 4h, 12h, 1D, 3D, 1W și 1M. Material educațional, fără apel de tranzacționare."
        />
        <Offer
          href="/raport-risc"
          title={catalog.risk.name}
          price={`${catalog.risk.priceRon} RON${catalog.risk.priceConfirmed ? '' : ' · preț de confirmat'}`}
          text="Scor de risc pentru orice monedă: lichiditate, deținători, deblocări, securitate și context tehnic."
        />
      </div>
    </section>
  );
}

function Offer({
  href,
  title,
  price,
  text,
}: {
  href: string;
  title: string;
  price: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="glass-card block rounded-2xl border border-white/10 p-5 transition-colors hover:border-white/20"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{price}</p>
      <h3 className="mt-2 font-[var(--font-space)] text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
    </Link>
  );
}
