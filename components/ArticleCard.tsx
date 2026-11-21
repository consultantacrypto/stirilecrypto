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
  aspectRatio = '16/10',
}: ArticleCardProps) {
  const articleHref = href ?? `/stiri/${slug}`;

  return (
    <Link
      href={articleHref}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] transition-colors hover:border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${className}`}
    >
      <ArticleCoverImage
        src={image}
        alt={title}
        priority={priority}
        aspectRatio={aspectRatio}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
      />

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {category || date ? (
          <p className="mb-2 flex flex-wrap items-center gap-x-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
            {category ? <span className="text-[var(--signal)]">{category}</span> : null}
            {category && date ? (
              <span className="text-zinc-600" aria-hidden="true">
                ·
              </span>
            ) : null}
            {date ? <span className="font-medium normal-case tracking-normal text-zinc-400">{date}</span> : null}
          </p>
        ) : null}
        <h3 className="mb-2 line-clamp-3 flex-1 font-[var(--font-space)] font-semibold leading-snug tracking-tight text-white transition-colors group-hover:text-zinc-200">
          {title}
        </h3>
        {summary ? (
          <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">{summary}</p>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-zinc-300 transition-all group-hover:gap-2 font-[var(--font-inter)]">
          Citește articolul <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}
