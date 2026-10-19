export type ArticleStatus = 'draft' | 'published';

export type ArticleContentType = 'news' | 'market_pulse';

export interface Stire {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  content_type: ArticleContentType;
  status: ArticleStatus;
  image_url: string | null;
  published_at: string | null;
  created_at?: string | null;
  views?: number | null;
  meta_title?: string | null;
  meta_description?: string | null;
  x_content?: string | null;
  /** NULL for rows written from /admin. `editor_api` for POST /api/editor/articles. */
  source?: string | null;
  tags?: string[] | null;
  source_urls?: string[] | null;
}

export interface StireInsert {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  content_type: ArticleContentType;
  status: ArticleStatus;
  image_url: string | null;
  published_at: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  x_content?: string | null;
}
