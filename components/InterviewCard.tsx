import Image from 'next/image';
import Link from 'next/link';
import { getBadgeStyle, type InterviewCardItem } from '@/lib/interviews';

interface InterviewCardProps {
  item: InterviewCardItem;
}

export default function InterviewCard({ item }: InterviewCardProps) {
  const coverSrc = item.cover_image?.trim() || '/placeholder.jpg';

  return (
    <Link
      href={`/interviuri/${item.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-white/10 bg-[#0a0f1e]/90 overflow-hidden backdrop-blur-md hover:border-white/30 transition-colors duration-300"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
        <Image
          src={coverSrc}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"
          aria-hidden
        />
        <span
          className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest font-[var(--font-space)] ${getBadgeStyle(item.badge)}`}
        >
          {item.badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-base md:text-lg font-bold text-white leading-snug line-clamp-2 font-[var(--font-space)] group-hover:text-violet-300 transition-colors duration-300">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-gray-400 leading-relaxed line-clamp-3 font-[var(--font-inter)]">
          {item.excerpt}
        </p>
      </div>
    </Link>
  );
}
