import Link from 'next/link';
import { Eye, TrendingUp } from 'lucide-react';
import { getTrendingArticles } from '@/lib/articles-db';

function formatViews(count: number): string {
  return new Intl.NumberFormat('ro-RO').format(count);
}

const rankStyles = [
  'text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.6)]',
  'text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]',
  'text-slate-300 shadow-[0_0_8px_rgba(148,163,184,0.4)]',
  'text-slate-500',
];

export default async function TrendingArticles() {
  const trending = await getTrendingArticles(4);

  if (trending.length === 0) return null;

  return (
    <aside
      className="bg-[#0a0f1e]/90 border border-white/10 rounded-2xl p-5 md:p-6 backdrop-blur-md"
      aria-label="Cele mai citite"
    >
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp size={18} className="text-blue-400" />
        <h2 className="text-lg font-bold text-white font-[var(--font-space)] tracking-tight">
          Cele mai citite
        </h2>
      </div>

      <ol className="space-y-4">
        {trending.map((item, index) => (
          <li key={item.slug}>
            <Link
              href={`/stiri/${item.slug}`}
              className="group flex gap-4 items-start rounded-xl p-2 -mx-2 hover:bg-white/5 transition-colors"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-sm font-black font-[var(--font-space)] ${rankStyles[index] ?? rankStyles[3]}`}
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors font-[var(--font-space)]">
                  {item.title}
                </p>
                <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-500 font-[var(--font-inter)]">
                  <Eye size={12} className="text-gray-500" />
                  <span className="text-gray-400 font-semibold">
                    {formatViews(item.views)} vizualizări
                  </span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>

      <Link
        href="/stiri"
        className="mt-5 block text-center text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors font-[var(--font-space)]"
      >
        Vezi toate știrile →
      </Link>
    </aside>
  );
}
