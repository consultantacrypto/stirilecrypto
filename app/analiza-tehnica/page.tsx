import type { Metadata } from 'next';
import OrderForm from '@/components/products/OrderForm';
import ProductFrame, { ProductCrosslink } from '@/components/products/ProductFrame';
import TaSample from '@/components/products/TaSample';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';
import { productCatalog } from '@/lib/products/config';

const TITLE = 'Analiză tehnică multi-timeframe';
const DESCRIPTION =
  'Analiză tehnică educațională pentru un singur activ crypto, pe 1h, 4h, 12h, 1D, 3D, 1W și 1M. Fără apeluri de cumpărare sau de vânzare.';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/analiza-tehnica` },
  ...buildWebsiteShareMetadata({
    title: TITLE,
    description: DESCRIPTION,
    canonical: `${SITE_URL}/analiza-tehnica`,
  }),
};

const FRAMES = ['1h', '4h', '12h', '1D', '3D', '1W', '1M'];

export default function AnalizaTehnicaPage() {
  const catalog = productCatalog();

  return (
    <ProductFrame
      kicker="La comandă"
      title={TITLE}
      lede="O analiză tehnică pentru un singur activ ales de tine. Descrie contextul pe șapte grafice. Este material educațional, nu o recomandare personalizată și nu îți spune să cumperi sau să vinzi."
      priceRon={catalog.ta.priceRon}
      priceConfirmed={catalog.ta.priceConfirmed}
      deliveryLabel={catalog.ta.deliveryLabel}
      aside={
        <>
          <h2 className="font-[var(--font-space)] text-lg font-bold">Comandă</h2>
          <p className="mt-2 mb-5 text-sm leading-relaxed text-slate-400">
            Alegi simbolul și, dacă vrei, o întrebare. Poți adăuga și raportul de risc pentru aceeași monedă.
          </p>
          <OrderForm
            product="ta_mtf"
            chargeTa={catalog.chargeTa}
            chargeRisk={catalog.chargeRisk}
            taPriceRon={catalog.ta.priceRon}
            riskPriceRon={catalog.risk.priceRon}
            riskPriceConfirmed={catalog.risk.priceConfirmed}
            bundlePriceRon={catalog.bundlePriceRon}
            bundlePriceConfirmed={catalog.bundlePriceConfirmed}
            deliveryLabel={catalog.ta.deliveryLabel}
          />
        </>
      }
      below={
        <>
          <TaSample />
          <ProductCrosslink
            href="/raport-risc"
            title="Raport de risc pentru o monedă"
            text="Lichiditate, deținători, deblocări și semnale de securitate, tot ca material educațional."
          />
        </>
      }
    >
      <ul className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {FRAMES.map((frame) => (
          <li
            key={frame}
            className="rounded-lg border border-white/10 px-3 py-2 text-center text-sm font-semibold text-slate-200"
          >
            {frame}
          </li>
        ))}
      </ul>
      <ul className="mt-6 space-y-2 text-sm leading-relaxed text-slate-300">
        <li>Trendul și zonele observate pe fiecare timeframe, în același document.</li>
        <li>Răspuns la întrebarea ta, dacă ai lăsat una, tot fără apel de tranzacționare.</li>
        <li>Livrare pe email, în intervalul afișat. Intervalul este un reper configurabil, nu un termen contractual ferm.</li>
      </ul>
      <p className="mt-6 text-sm leading-relaxed text-slate-500">
        Analiză tehnică generală, în scop educațional. Nu este o recomandare de investiții personalizată,
        nu ține loc de consultanță financiară autorizată și nu conține apeluri de cumpărare sau de vânzare.
      </p>
    </ProductFrame>
  );
}
