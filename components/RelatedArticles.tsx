import Link from 'next/link';
import Image from 'next/image';
import { articles } from '@/lib/articles';
import { ArrowRight } from 'lucide-react';

export default function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  // Filtrăm să nu arătăm articolul curent și luăm primele 3
  const related = articles
    .filter(a => a.slug !== currentSlug)
    .slice(0, 3);

  return (
    <div className="border-t border-white/10 pt-12 mt-12">
      <h3 className="text-2xl font-bold text-white mb-8 font-[var(--font-space)] flex items-center gap-2">
        <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
        Citește și alte analize
      </h3>

      <div className="grid md:grid-cols-3 gap-6">
        {related.map((article) => (
          <Link key={article.slug} href={`/stiri/${article.slug}`} className="group bg-[#0a0f1e] border border-white/5 hover:border-white/20 rounded-2xl overflow-hidden transition-all hover:-translate-y-1">
            <div className="relative h-40 w-full overflow-hidden">
              <Image 
                src={article.image} 
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized={true} // ✅ FIX-UL MAGIC PENTRU IMAGINI
              />
            </div>
            <div className="p-5">
              <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2">{article.category}</div>
              <h4 className="text-white font-bold leading-tight mb-4 group-hover:text-blue-400 transition-colors line-clamp-2">
                {article.title}
              </h4>
              <div className="text-xs text-gray-500 flex items-center gap-1 font-bold group-hover:gap-2 transition-all">
                Citește <ArrowRight size={12} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}