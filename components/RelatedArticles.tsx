import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getMergedRelatedArticles } from '@/lib/articles-db';

export default async function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  const related = await getMergedRelatedArticles(currentSlug, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-white/10">
      <h2 className="text-2xl font-bold font-[var(--font-space)] text-white mb-6">
        Știri Recomandate
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((item) => (
          <Link
            key={item.slug}
            href={`/stiri/${item.slug}`}
            className="group flex flex-col bg-[#0a0f1e] border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all hover:shadow-[0_0_24px_rgba(59,130,246,0.12)] h-full"
          >
            <div className="relative w-full aspect-video shrink-0 overflow-hidden bg-slate-900">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-5 flex flex-col flex-1">
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2 font-[var(--font-space)]">
                {item.category}
              </span>
              <h3 className="text-white font-bold leading-snug mb-3 line-clamp-3 group-hover:text-blue-400 transition-colors font-[var(--font-space)] flex-1">
                {item.title}
              </h3>
              <span className="text-xs text-gray-500 flex items-center gap-1 font-semibold font-[var(--font-inter)] group-hover:gap-2 transition-all mt-auto">
                Citește articolul <ArrowRight size={12} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
