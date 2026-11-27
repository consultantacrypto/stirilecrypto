import Image from 'next/image';
import {
  buildWalletOutboundUrl,
  hasRealCheckoutCode,
  walletBrandShelves,
  walletModelName,
  walletPriceView,
  type WalletBrandProfile,
  type WalletProduct,
} from '@/lib/wallets/quickexit-catalog.sync';

const AFFILIATE_REL = 'sponsored nofollow noopener';

function priceLines(product: WalletProduct): { primary: string; extra: string | null; checked: string } | null {
  const price = walletPriceView(product, 'ro');
  if (price.status === 'hidden') return null;
  const primary = `${price.priceIsFrom ? 'de la ' : ''}${price.primary}`;
  let extra: string | null = null;
  if (price.secondary) {
    extra =
      price.secondaryKind === 'geo_storefront'
        ? `Vitrina România: ${price.secondary}`
        : `${price.secondary} pe aceeași pagină`;
  }
  return { primary, extra, checked: `verificat la ${price.checkedOn}` };
}

function BrandCard({ brand, models }: { brand: WalletBrandProfile; models: WalletProduct[] }) {
  const summary = brand.shortDescription?.ro ?? null;
  const code =
    models.find((model) => model.checkoutCodeRequired && hasRealCheckoutCode(model))?.affiliateCode ?? null;

  return (
    <article id={`brand-${brand.slug}`} className="flex h-full scroll-mt-24 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#1c1c1e]">
      <div className="relative aspect-[5/4] bg-[#12141a]">
        <Image
          src={brand.image.src}
          alt={brand.image.altRo}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-contain p-4"
          unoptimized
        />
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
        <h2 className="font-[var(--font-space)] text-2xl font-bold tracking-tight text-white">{brand.name}</h2>
        {summary ? <p className="mt-2 text-sm leading-relaxed text-slate-300">{summary}</p> : null}
        <ul className="mt-4 border-t border-white/10">
          {models.map((model) => {
            const name = walletModelName(model, 'ro');
            const price = priceLines(model);
            return (
              <li key={model.slug} className="border-b border-white/10">
                <a
                  href={buildWalletOutboundUrl(model)}
                  target="_blank"
                  rel={AFFILIATE_REL}
                  className="flex min-h-11 flex-col gap-1 py-3 text-left hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:flex-row sm:items-start sm:justify-between sm:gap-3"
                >
                  <span className="min-w-0">
                    <span className="block text-sm leading-snug text-slate-100">{name}</span>
                    {model.highlight === 'popular' ? (
                      <span className="mt-1 inline-flex rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        Cel mai ales
                      </span>
                    ) : null}
                  </span>
                  {price ? (
                    <span className="shrink-0 sm:text-right">
                      <span className="block text-sm font-semibold text-white">{price.primary}</span>
                      {price.extra ? (
                        <span className="mt-0.5 block text-[11px] leading-snug text-slate-400">{price.extra}</span>
                      ) : null}
                      <span className="mt-0.5 block text-[11px] text-slate-500">{price.checked}</span>
                    </span>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
        {code ? (
          <p className="mt-4 text-sm text-slate-200">
            Cod de reducere: <span className="font-semibold text-white">{code}</span>
          </p>
        ) : null}
      </div>
    </article>
  );
}

export default function WalletCatalog() {
  const shelves = walletBrandShelves({ tier: 'all', deviceType: 'all' });

  return (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {shelves.map(({ brand, models }) => (
        <BrandCard key={brand.slug} brand={brand} models={models} />
      ))}
    </div>
  );
}
