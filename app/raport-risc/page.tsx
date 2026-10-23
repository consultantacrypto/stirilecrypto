import type { Metadata } from 'next';
import OrderForm from '@/components/products/OrderForm';
import ProductFrame, { ProductCrosslink } from '@/components/products/ProductFrame';
import RiskSample from '@/components/products/RiskSample';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';
import { productCatalog } from '@/lib/products/config';

const TITLE = 'Raport de risc pentru o monedă crypto';
const DESCRIPTION =
  'Scor de risc educațional pentru orice monedă crypto: lichiditate, listări, deținători, tokenomics, dump, securitate și context tehnic. Nu este recomandare de cumpărare sau vânzare.';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/raport-risc` },
  ...buildWebsiteShareMetadata({
    title: TITLE,
    description: DESCRIPTION,
    canonical: `${SITE_URL}/raport-risc`,
  }),
};

const SECTIONS = [
  'Scor general 0–100 și sub-scoruri',
  'Lichiditate: volum, adâncimea cărții de ordine, lichiditate DEX',
  'Calitatea listărilor, inclusiv prezența sau absența de pe burse tier-1',
  'Distribuția deținătorilor: top holders, echipă, VC, trezorerie, portofele de bursă',
  'Tokenomics și calendarul de deblocări',
  'Risc de dump și semnale de tip pump-and-dump',
  'Indicatori de contract și securitate',
  'Transparența echipei și a proiectului',
  'Ce merită urmărit în zilele și săptămânile următoare',
  'Context tehnic multi-timeframe, fără apel de tranzacționare',
];

export default function RaportRiscPage() {
  const catalog = productCatalog();

  return (
    <ProductFrame
      kicker="La comandă"
      title={TITLE}
      lede="Un raport educațional pentru moneda pe care o alegi, nu doar pentru BTC sau ETH. Scorul descrie riscuri observabile. Nu îți spune să cumperi sau să vinzi."
      priceRon={catalog.risk.priceRon}
      priceConfirmed={catalog.risk.priceConfirmed}
      deliveryLabel={catalog.risk.deliveryLabel}
      aside={
        <>
          <h2 className="font-[var(--font-space)] text-lg font-bold">Cerere</h2>
          <p className="mt-2 mb-5 text-sm leading-relaxed text-slate-400">
            Formularul ne spune exact ce vrei verificat. Prețul de {catalog.risk.priceRon} RON este de
            confirmat și nu se încasează cât timp plățile sunt oprite.
          </p>
          <OrderForm
            product="risk_report"
            chargeTa={catalog.chargeTa}
            chargeRisk={catalog.chargeRisk}
            taPriceRon={catalog.ta.priceRon}
            riskPriceRon={catalog.risk.priceRon}
            riskPriceConfirmed={catalog.risk.priceConfirmed}
            bundlePriceRon={catalog.bundlePriceRon}
            bundlePriceConfirmed={catalog.bundlePriceConfirmed}
            deliveryLabel={catalog.risk.deliveryLabel}
          />
        </>
      }
      below={
        <>
          <RiskSample />
          <ProductCrosslink
            href="/analiza-tehnica"
            title="Analiză tehnică multi-timeframe"
            text="Poate fi comandată singură sau bifată împreună cu raportul de risc."
          />
        </>
      }
    >
      <h2 className="mt-10 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Ce intră în raport</h2>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
        {SECTIONS.map((item) => (
          <li key={item} className="border-b border-white/5 pb-2">
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm leading-relaxed text-slate-500">
        Sursele folosite la livrare pot include date publice de la explorere și trackere on-chain (de
        exemplu Arkham, Etherscan, Solscan sau agregatoare de tip Nansen), în funcție de rețea. Raportul
        rămâne o sinteză educațională, nu un audit și nu o recomandare de investiții.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-slate-500">
        Material general, în scop educațional. Nu este o recomandare de investiții personalizată și nu
        conține apeluri de cumpărare sau de vânzare.
      </p>
    </ProductFrame>
  );
}
