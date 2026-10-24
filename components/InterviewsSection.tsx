import InterviewGrid from '@/components/InterviewGrid';
import SectionHeader from '@/components/SectionHeader';
import { getPublishedInterviews } from '@/lib/interviews-db';

const HOME_PREVIEW_LIMIT = 3;

export default async function InterviewsSection() {
  const interviews = await getPublishedInterviews(HOME_PREVIEW_LIMIT);

  if (interviews.length === 0) {
    return null;
  }

  return (
    <section aria-label="Față în față cu Dani">
      <SectionHeader eyebrow="Conversații" title="Față în față cu Dani" href="/interviuri" linkLabel="Vezi tot →" />

      <InterviewGrid interviews={interviews} />
    </section>
  );
}
