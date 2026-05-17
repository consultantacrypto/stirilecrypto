import { BadgeCheck, ExternalLink } from 'lucide-react';

const BYBIT_URL = 'https://partner.bybit.eu/b/mihaispecial';
const REDOTPAY_URL = 'https://url.hk/i/en/kqz74';

export default function AffiliatePartnerBox() {
  return (
    <aside
      className="bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-blue-500/20 rounded-2xl p-6 my-10 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 backdrop-blur-md"
      aria-label="Parteneri verificați"
    >
      <div className="flex-1 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400 font-[var(--font-space)]">
          <BadgeCheck size={14} className="text-blue-400" />
          Parteneri verificați
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white font-[var(--font-space)] leading-tight">
          Recomandarea Ambasadorului: Tranzacționează Inteligent
        </h3>
        <p className="text-sm md:text-base text-gray-300 leading-relaxed font-[var(--font-inter)] max-w-xl">
          Linkurile noastre oficiale Bybit și RedotPay îți oferă cashback, comisioane
          reduse la schimb, promoții active și infrastructură testată de redacție — fără
          surprize la retrageri.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
        <a
          href={BYBIT_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-900/30 font-[var(--font-inter)]"
        >
          Deschide Bybit
          <ExternalLink size={14} />
        </a>
        <a
          href={REDOTPAY_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 hover:border-blue-400/50 bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all font-[var(--font-inter)]"
        >
          RedotPay
          <ExternalLink size={14} />
        </a>
      </div>
    </aside>
  );
}
