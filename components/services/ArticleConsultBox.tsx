import { ArrowRight } from 'lucide-react';

const CONSULT_URL =
  'https://www.mihaidaniel.ro/consultanta-crypto?utm_source=stirilecrypto&utm_medium=article_box&utm_campaign=consult_box';

export default function ArticleConsultBox() {
  return (
    <aside
      className="my-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
      aria-label="Consultanță crypto 1:1"
    >
      <h2 className="text-xl font-bold leading-snug text-white font-[var(--font-space)]">
        Vrei o discuție 1:1 cu Dani?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400 font-[var(--font-inter)]">
        Consultanță crypto 1:1 cu Mihai Daniel (€200/oră).
      </p>
      <a
        href={CONSULT_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-placement="article"
        className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-black hover:bg-slate-100"
      >
        Programează o discuție
        <ArrowRight size={16} aria-hidden />
      </a>
    </aside>
  );
}
