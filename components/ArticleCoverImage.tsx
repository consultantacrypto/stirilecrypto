import type { ReactNode } from 'react';
import Image from 'next/image';

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
  aspectRatio = 'video',
  className = '',
  imageClassName = '',
  overlay,
}: ArticleCoverImageProps) {
  return (
    <div
      className={`relative w-full shrink-0 overflow-hidden bg-gray-900 ${ASPECT_CLASS[aspectRatio]} ${className}`}
    >
      <div className="absolute inset-0 z-0 animate-pulse bg-gray-900" aria-hidden />
      {overlay}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        fetchPriority={priority ? 'high' : 'low'}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        sizes={sizes}
        className={`relative z-[1] object-cover ${imageClassName}`}
      />
    </div>
  );
}
