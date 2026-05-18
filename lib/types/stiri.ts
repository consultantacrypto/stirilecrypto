export type ArticleStatus = 'draft' | 'published';

export interface Stire {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: ArticleStatus;
  image_url: string | null;
  published_at: string | null;
  created_at?: string | null;
  views?: number | null;
}

export interface StireInsert {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: ArticleStatus;
  image_url: string | null;
  published_at: string | null;
}
