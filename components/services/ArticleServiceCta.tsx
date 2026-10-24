import Link from 'next/link';
import { addressCheckUrl, walletCheckIsLive, withSource } from '@/lib/products/placement';
import { ALTCOIN_PRICE_RON, MAJOR_PRICE_RON } from '@/lib/products/tiers';

const pillClass =
  'inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-black hover:bg-slate-100';

export default function ArticleServiceCta({ asset }: { asset: string | null }) {
  const analysisHref = asset
    ? withSource(`/analiza-tehnica?asset=${encodeURIComponent(asset)}`, 'article')
    : withSource('/analiza-tehnica', 'article');
  const live = walletCheckIsLive();
  const external = addressCheckUrl();
  const walletHref = external ? withSource(external, 'articol') : '/verificare-portofel?src=articol';

  return (
    <div className="my-10 flex flex-col gap-4">
      <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <h2 className="text-xl font-bold leading-snug text-white font-[var(--font-space)]">
          Vrei aceeași analiză pe tokenul tău?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Șapte grafice și secțiunea de risc. {MAJOR_PRICE_RON} lei pentru o monedă mare, {ALTCOIN_PRICE_RON} lei
          pentru un altcoin. Livrare în 24 de ore.
        </p>
        <Link href={analysisHref} className={`mt-4 ${pillClass}`}>
          {asset ? `Comandă analiza pentru ${asset}` : 'Comandă analiza'}
        </Link>
      </aside>

      <aside className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#1c1c1e] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold leading-relaxed text-white">
              Ai de trimis sau ai primit crypto de la cineva? Verifică portofelul înainte.
            </p>
            {live ? null : (
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-[10px] font-semibold text-blue-400">
                Disponibil în curând
              </span>
            )}
          </div>
        </div>
        <Link href={walletHref} className={pillClass}>
          {live ? 'Verifică o adresă' : 'Înscrie-te pe lista de așteptare'}
        </Link>
      </aside>
    </div>
  );
}
