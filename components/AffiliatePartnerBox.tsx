import { ExternalLink } from 'lucide-react';
import { withAffiliateTags } from '@/lib/affiliates';

const BYBIT_URL = withAffiliateTags('https://partner.bybit.eu/b/mihaispecial', 'article-bybit');
const REDOTPAY_URL = withAffiliateTags('https://url.hk/i/en/kqz74', 'article-redotpay');

export default function AffiliatePartnerBox() {
  return (
    <aside
      className="my-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
      aria-label="Link afiliat"
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">Link afiliat</p>
      <h2 className="mt-2 text-xl font-bold text-white font-[var(--font-space)]">Bybit</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
        Dacă deschizi contul prin linkul de mai jos, Bybit ne poate plăti un comision. Este reclamă, nu o
        recomandare și nu spune nimic despre siguranța platformei.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a
          href={BYBIT_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-500"
        >
          Deschide Bybit
          <ExternalLink size={14} aria-hidden />
        </a>
        <a
          href={REDOTPAY_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-bold text-white hover:bg-white/10"
        >
          RedotPay, tot link afiliat
          <ExternalLink size={14} aria-hidden />
        </a>
      </div>
    </aside>
  );
}
