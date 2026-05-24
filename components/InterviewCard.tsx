import Image from 'next/image';
import { Play } from 'lucide-react';
import {
  BADGE_STYLES,
  type MockInterview,
  youtubeThumbnail,
} from '@/lib/interviews';

interface InterviewCardProps {
  item: MockInterview;
}

export default function InterviewCard({ item }: InterviewCardProps) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col rounded-2xl border border-white/10 bg-[#0a0f1e]/90 overflow-hidden backdrop-blur-md hover:border-white/30 transition-colors duration-300"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-black/40">
        <Image
          src={youtubeThumbnail(item.youtubeId)}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 pointer-events-none"
          aria-hidden
        />
        <span
          className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest font-[var(--font-space)] ${BADGE_STYLES[item.badge]}`}
        >
          {item.badge}
        </span>
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600/90 shadow-[0_0_24px_rgba(220,38,38,0.45)] transition-transform duration-300 group-hover:scale-110">
            <Play size={26} className="text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-base md:text-lg font-bold text-white leading-snug line-clamp-2 font-[var(--font-space)] group-hover:text-violet-300 transition-colors duration-300">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-gray-400 leading-relaxed line-clamp-2 font-[var(--font-inter)]">
          {item.description}
        </p>
      </div>
    </a>
  );
}
