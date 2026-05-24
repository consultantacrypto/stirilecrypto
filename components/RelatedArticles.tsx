import ArticleCard from '@/components/ArticleCard';
import { getMergedRelatedArticles } from '@/lib/articles-db';

export default async function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  const related = await getMergedRelatedArticles(currentSlug, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-white/10">
      <h2 className="text-2xl font-bold font-[var(--font-space)] text-white mb-6">
        Știri Recomandate
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((item) => (
          <ArticleCard
            key={item.slug}
            slug={item.slug}
            title={item.title}
            image={item.image}
            category={item.category}
          />
        ))}
      </div>
    </section>
  );
}
