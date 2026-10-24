import type { Metadata } from 'next';
import OrderForm from '@/components/products/OrderForm';
import ProductFrame from '@/components/products/ProductFrame';
import TaSample from '@/components/products/TaSample';
import { ANALYSIS_DELIVERY_FROM, productCatalog } from '@/lib/products/config';
import { sanitizeAssetParam, sanitizeSource } from '@/lib/products/placement';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const TITLE = 'Analiză tehnică multi-timeframe';
const DESCRIPTION =
  'Analiză tehnică educațională pentru un activ crypto, pe 1h, 4h, 12h, 1D, 3D, 1W și 1M, plus secțiunea Risc token. De la 79 RON pentru o monedă din top 30, 139 RON pentru un altcoin. Fără apeluri de cumpărare sau de vânzare.';

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

const RISK_POINTS = [
  'Lichiditate: volum, adâncimea ordinelor și lichiditatea de pe DEX, acolo unde există.',
  'Listări pe burse majore, sau absența lor.',
  'Distribuția deținătorilor, din Arkham și din date on-chain publice.',
  'Deblocări de tokenuri și calendarul lor.',
  'Risc de dump și semnale de pump-and-dump.',
];

export default async function AnalizaTehnicaPage({
  searchParams,
}: {
  searchParams: Promise<{ asset?: string; src?: string }>;
}) {
  const query = await searchParams;
  const catalog = productCatalog();
  const initialAsset = sanitizeAssetParam(query.asset);
  const source = sanitizeSource(query.src);

  return (
    <ProductFrame
      kicker="La comandă"
      title={TITLE}
      lede="O analiză pentru un singur activ ales de tine: șapte grafice și o secțiune Risc token. Este material educațional, nu o recomandare personalizată și nu îți spune să cumperi sau să vinzi."
      fromRon={catalog.ta.majorPriceRon}
      altcoinRon={catalog.ta.altcoinPriceRon}
      priceConfirmed={catalog.ta.priceConfirmed}
      deliveryLabel={catalog.ta.deliveryLabel}
      aside={
        <>
          <h2 className="font-[var(--font-space)] text-lg font-bold">Comandă</h2>
          <p className="mt-2 mb-5 text-sm leading-relaxed text-slate-400">
            Simbolul este obligatoriu. Câmpurile de risc sunt opționale și ajută la redactare.
          </p>
          <OrderForm
            deliveryLabel={catalog.ta.deliveryLabel}
            initialAsset={initialAsset}
            source={source}
          />
        </>
      }
      below={<TaSample />}
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
      <h2 className="mt-8 font-[var(--font-space)] text-lg font-bold text-white">Risc token</h2>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
        {RISK_POINTS.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <p className="mt-6 text-sm leading-relaxed text-slate-300">
        Un coleg pregătește materialul, Daniel Mihai îl revizuiește, apoi pleacă pe email de la{' '}
        {ANALYSIS_DELIVERY_FROM}, de regulă în {catalog.ta.deliveryLabel.toLowerCase()}.
      </p>
      <p className="mt-6 text-sm leading-relaxed text-slate-500">
        Analiză tehnică generală și o citire de risc, ambele în scop educațional. Nu este o
        recomandare de investiții personalizată, nu ține loc de consultanță financiară autorizată și
        nu conține apeluri de cumpărare sau de vânzare.
      </p>
    </ProductFrame>
  );
}
