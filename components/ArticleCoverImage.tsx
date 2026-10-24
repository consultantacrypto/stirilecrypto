import type { ReactNode } from 'react';
import Image from 'next/image';
import { displayCoverUrl } from '@/lib/image-url';

export type ArticleCoverAspect = 'video' | '16/10' | '4/3';

const ASPECT_CLASS: Record<ArticleCoverAspect, string> = {
  video: 'aspect-video',
  '16/10': 'aspect-[16/10]',
  '4/3': 'aspect-[4/3]',
};

export type ArticleCoverImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Load immediately when the card is already in view, such as a freshly appended row. */
  eager?: boolean;
  /** Pixel width requested from the storage render endpoint. */
  coverWidth?: number;
  aspectRatio?: ArticleCoverAspect;
  className?: string;
  imageClassName?: string;
  overlay?: ReactNode;
};

/**
 * Reserved aspect-ratio box + pulse placeholder for CLS-safe unoptimized images.
 */
export default function ArticleCoverImage({
  src,
  alt,
  sizes,
  priority = false,
  eager = false,
  coverWidth = 960,
  aspectRatio = 'video',
  className = '',
  imageClassName = '',
  overlay,
}: ArticleCoverImageProps) {
  const fast = priority || eager;
  return (
    <div
      className={`relative w-full shrink-0 overflow-hidden bg-[#1c1c1e] ${ASPECT_CLASS[aspectRatio]} ${className}`}
    >
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="cover-shimmer absolute inset-y-0 w-1/2" />
      </div>
      {overlay}
      <Image
        src={displayCoverUrl(src, coverWidth)}
        alt={alt}
        fill
        priority={priority}
        fetchPriority={priority ? 'high' : fast ? 'auto' : 'low'}
        loading={fast ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        sizes={sizes}
        className={`relative z-[1] object-cover ${imageClassName}`}
      />
    </div>
  );
}
