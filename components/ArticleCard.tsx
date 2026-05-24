import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ArticleCoverImage from '@/components/ArticleCoverImage';
export type ArticleCardProps = {
  slug: string;
  title: string;
  image: string;
  category?: string;
  summary?: string;
  date?: string;
  priority?: boolean;
  href?: string;
  className?: string;
  aspectRatio?: 'video' | '16/10' | '4/3';
};

export default function ArticleCard({
  slug,
  title,
  image,
  category,
  summary,
  date,
  priority = false,
  href,
  className = '',
  aspectRatio = 'video',
}: ArticleCardProps) {
  const articleHref = href ?? `/stiri/${slug}`;

  return (
    <Link
      href={articleHref}
      className={`group flex flex-col bg-[#0a0f1e] border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all hover:shadow-[0_0_24px_rgba(59,130,246,0.12)] h-full ${className}`}
    >
      <ArticleCoverImage
        src={image}
        alt={title}
        priority={priority}
        aspectRatio={aspectRatio}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        imageClassName="transition-transform duration-500 group-hover:scale-105"
      />

      <div className="p-5 flex flex-col flex-1">
        {category ? (
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2 font-[var(--font-space)]">
            {category}
          </span>
        ) : null}
        {date ? (
          <span className="text-[11px] font-medium text-slate-500 mb-2">{date}</span>
        ) : null}
        <h3 className="text-white font-bold leading-snug mb-3 line-clamp-3 group-hover:text-blue-400 transition-colors font-[var(--font-space)] flex-1">
          {title}
        </h3>
        {summary ? (
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-3">{summary}</p>
        ) : null}
        <span className="text-xs text-gray-500 flex items-center gap-1 font-semibold font-[var(--font-inter)] group-hover:gap-2 transition-all mt-auto">
          Citește articolul <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}
