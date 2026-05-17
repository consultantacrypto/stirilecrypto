import { supabase } from '@/lib/supabase';
import type { Stire } from '@/lib/types/stiri';

export async function getPublishedArticles(limit = 6): Promise<Stire[]> {
  const { data, error } = await supabase
    .from('stiri')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getPublishedArticles]', error.message);
    return [];
  }

  return (data ?? []) as Stire[];
}

export async function getArticleBySlug(slug: string): Promise<Stire | null> {
  const { data, error } = await supabase
    .from('stiri')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    console.error('[getArticleBySlug]', error.message);
    return null;
  }

  return data as Stire | null;
}

export async function getPublishedSlugs(): Promise<{ slug: string }[]> {
  const { data, error } = await supabase
    .from('stiri')
    .select('slug')
    .eq('status', 'published');

  if (error) {
    console.error('[getPublishedSlugs]', error.message);
    return [];
  }

  return (data ?? []) as { slug: string }[];
}

export async function getRelatedArticles(currentSlug: string, limit = 3): Promise<Stire[]> {
  const { data, error } = await supabase
    .from('stiri')
    .select('*')
    .eq('status', 'published')
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getRelatedArticles]', error.message);
    return [];
  }

  return (data ?? []) as Stire[];
}

export function formatArticleDate(iso: string | null): string {
  if (!iso) return 'Recent';
  return new Date(iso).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
