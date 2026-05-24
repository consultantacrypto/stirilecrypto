import InterviewCard from '@/components/InterviewCard';
import type { InterviewCardItem } from '@/lib/interviews';

interface InterviewGridProps {
  interviews: readonly InterviewCardItem[];
  className?: string;
}

export default function InterviewGrid({
  interviews,
  className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
}: InterviewGridProps) {
  return (
    <ul className={`${className} list-none p-0 m-0`}>
      {interviews.map((item) => (
        <li key={item.slug} className="min-w-0">
          <InterviewCard item={item} />
        </li>
      ))}
    </ul>
  );
}
