import { MetadataRoute } from 'next';
import { articles } from '@/lib/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.mihaidaniel.ro';

  // 1. Pagini statice
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/stiri`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  // 2. Pagini dinamice (Articolele)
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/stiri/${article.slug}`,
    lastModified: new Date(article.date), // Sau data curentă
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...articlePages];
}