import Link from 'next/link';
import ArticleCoverImage from '@/components/ArticleCoverImage';
import { thumbnailImageUrl } from '@/lib/image-url';

type StoryThumbProps = {
  href: string;
  title: string;
  image: string;
  meta?: string;
  index?: number;
  layout?: 'row' | 'card';
};

/**
 * Article list thumbnail. The lead story stays a full cover; these stay small
 * and lazy so a phone does not download a dozen full-size covers.
 */
export default function StoryThumb({
  href,
  title,
  image,
  meta,
  index,
  layout = 'row',
}: StoryThumbProps) {
  const src = thumbnailImageUrl(image, layout === 'card' ? 640 : 240);
  const sizes = layout === 'card' ? '(max-width: 640px) 100vw, 33vw' : '112px';

  if (layout === 'card') {
    return (
      <Link href={href} className="group block h-full">
        <ArticleCoverImage
          src={src}
          alt=""
          sizes={sizes}
          aspectRatio="16/10"
          className="rounded-xl border border-white/10"
        />
        {meta ? (
          <span className="mt-3 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            {meta}
          </span>
        ) : null}
        <span className="mt-1 block text-base font-semibold leading-snug text-white group-hover:text-blue-300">
          {title}
        </span>
      </Link>
    );
  }

  return (
    <Link href={href} className="group flex items-start gap-3 py-3">
      {index != null ? (
        <span className="w-6 shrink-0 pt-1 font-[var(--font-space)] text-sm font-semibold tabular-nums text-slate-600">
          {String(index + 1).padStart(2, '0')}
        </span>
      ) : null}
      <span className="w-[5.5rem] shrink-0 sm:w-28">
        <ArticleCoverImage
          src={src}
          alt=""
          sizes={sizes}
          aspectRatio="4/3"
          className="rounded-md border border-white/10"
        />
      </span>
      <span className="min-w-0 flex-1">
        {meta ? (
          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            {meta}
          </span>
        ) : null}
        <span className="mt-1 block text-[15px] font-semibold leading-snug text-white group-hover:text-blue-300 sm:text-base">
          {title}
        </span>
      </span>
    </Link>
  );
}
