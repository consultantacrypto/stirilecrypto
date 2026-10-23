import StoryThumb from '@/components/StoryThumb';
import { getMergedRelatedArticles } from '@/lib/articles-db';

export default async function RelatedArticles({
  currentSlug,
  category,
}: {
  currentSlug: string;
  category?: string | null;
}) {
  const related = await getMergedRelatedArticles(currentSlug, 3, category);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-white/10">
      <h2 className="text-2xl font-bold font-[var(--font-space)] text-white mb-6">
        Citește și
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {related.map((item) => (
          <StoryThumb
            key={item.slug}
            href={`/stiri/${item.slug}`}
            title={item.title}
            image={item.image}
            meta={item.category}
            layout="card"
          />
        ))}
      </div>
    </section>
  );
}
