import Link from 'next/link';
import { Eye, TrendingUp } from 'lucide-react';
import { getTrendingArticles } from '@/lib/articles-db';

function formatViews(count: number): string {
  return new Intl.NumberFormat('ro-RO').format(count);
}

const rankStyles = [
  'text-blue-400 shadow-[0_0_14px_rgba(59,130,246,0.55)] border-blue-500/30',
  'text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.45)] border-cyan-500/25',
  'text-slate-200 shadow-[0_0_10px_rgba(148,163,184,0.35)] border-white/15',
  'text-slate-500 border-white/10',
];

export default async function TrendingArticles() {
  const trending = await getTrendingArticles(3);

  if (trending.length === 0) return null;

  return (
    <section aria-label="Cele mai citite">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-400" />
          <h2 className="text-xl md:text-2xl font-bold text-white font-[var(--font-space)] tracking-tight">
            Cele mai citite
          </h2>
        </div>
        <Link
          href="/stiri"
          className="text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors font-[var(--font-space)]"
        >
          Vezi toate știrile →
        </Link>
      </div>

      <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none p-0 m-0">
        {trending.map((item, index) => (
          <li key={item.slug} className="min-w-0">
            <Link
              href={`/stiri/${item.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-[#0a0f1e]/90 p-5 md:p-6 backdrop-blur-md hover:bg-white/5 hover:border-blue-500/30 transition-all duration-300"
            >
              <span
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border text-lg font-black font-[var(--font-space)] ${rankStyles[index] ?? rankStyles[3]}`}
              >
                {index + 1}
              </span>

              <h3 className="flex-1 text-base md:text-lg font-bold text-white leading-snug line-clamp-3 group-hover:text-blue-400 transition-colors font-[var(--font-space)]">
                {item.title}
              </h3>

              <p className="mt-4 flex items-center gap-1.5 text-xs text-gray-500 font-[var(--font-inter)]">
                <Eye size={12} className="text-gray-500 shrink-0" />
                <span className="text-gray-400 font-semibold">
                  {formatViews(item.views)} vizualizări
                </span>
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
