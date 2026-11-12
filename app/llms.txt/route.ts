import { getAllPublishedArticles } from '@/lib/articles-db';
import { buildLlmsTxt, type LlmsArticle } from '@/lib/llms-txt';

export const dynamic = 'force-dynamic';

export async function GET() {
  let articles: LlmsArticle[] = [];
  try {
    const published = await getAllPublishedArticles();
    articles = published.slice(0, 20).map((article) => ({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      publishedAt: article.published_at ?? article.created_at ?? null,
    }));
  } catch (error) {
    console.error('[llms.txt]', error);
  }

  return new Response(buildLlmsTxt(articles), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
