import Link from 'next/link';
import { Mic2 } from 'lucide-react';
import InterviewGrid from '@/components/InterviewGrid';
import { getPublishedInterviews } from '@/lib/interviews-db';

const HOME_PREVIEW_LIMIT = 3;

export default async function InterviewsSection() {
  const interviews = await getPublishedInterviews(HOME_PREVIEW_LIMIT);

  if (interviews.length === 0) {
    return null;
  }

  return (
    <section aria-label="Interviuri și analize premium">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Mic2 size={20} className="text-violet-400 shrink-0" aria-hidden />
          <h2 className="text-xl md:text-2xl font-bold text-white font-[var(--font-space)] tracking-tight">
            Interviuri &amp; Analize Premium
          </h2>
        </div>
        <Link
          href="/interviuri"
          className="text-xs font-bold uppercase tracking-widest text-violet-400 hover:text-violet-300 transition-colors font-[var(--font-space)]"
        >
          Vezi toate →
        </Link>
      </div>

      <InterviewGrid interviews={interviews} />
    </section>
  );
}
