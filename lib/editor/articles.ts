import { revalidatePath } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';
import { EDITOR_API_SOURCE, EDITOR_ARTICLE_AUTHOR } from '@/lib/editor/constants';
import { isProvenanceColumn, isUniqueSlugViolation, missingStiriColumn } from '@/lib/editor/db-error';
import type { EditorArticleCreate, EditorArticlePatch, EditorListQuery } from '@/lib/editor/validate';
import { countWords, slugFromTitle, withSlugSuffix } from '@/lib/editor/validate';
import { prepareImageUrlForStorage } from '@/lib/image-url';
import { EDITORIAL_DESK_NAME, SITE_URL } from '@/lib/json-ld';
import { createServiceClient } from '@/lib/supabase/service';
import type { ArticleStatus } from '@/lib/types/stiri';

if (EDITOR_ARTICLE_AUTHOR !== EDITORIAL_DESK_NAME) {
  throw new Error('EDITOR_ARTICLE_AUTHOR must match EDITORIAL_DESK_NAME');
}

const TABLE = 'stiri';
const RETURN_COLUMNS =
  'id, slug, title, excerpt, content, category, status, image_url, published_at, created_at';
const LIST_COLUMNS =
  'id, slug, title, excerpt, category, status, image_url, published_at, created_at, source, tags, source_urls';
const DETAIL_COLUMNS = `${LIST_COLUMNS}, content, meta_title, meta_description, content_type`;

const MIGRATION_HINT =
  'Run supabase/editor-api-schema.sql in the Supabase SQL Editor.';

export class EditorApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'EditorApiError';
    this.status = status;
  }
}

export type EditorArticleJson = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: ArticleStatus;
  content_type: 'news';
  image_url: string | null;
  published_at: string | null;
  created_at: string | null;
  source: string | null;
  tags: string[];
  source_urls: string[];
  author: string;
  path: string;
  url: string;
  content?: string;
  word_count?: number;
  meta_title?: string | null;
  meta_description?: string | null;
  provenance_stored?: boolean;
  revalidated?: boolean;
  warning?: string;
};

type StiriRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string | null;
  category: string;
  status: ArticleStatus;
  image_url: string | null;
  published_at: string | null;
  created_at: string | null;
  content_type?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  source?: string | null;
  tags?: string[] | null;
  source_urls?: string[] | null;
};

type DbError = { message?: string; code?: string; details?: string; hint?: string };

function client(): SupabaseClient {
  try {
    return createServiceClient();
  } catch (error) {
    console.error('[editor] supabase client', error);
    throw new EditorApiError('Editor API storage is not configured.', 503);
  }
}

export async function createEditorArticle(input: EditorArticleCreate): Promise<EditorArticleJson> {
  const supabase = client();
  const slug = input.slug
    ? await allocateSlug(supabase, input.slug, { strict: true })
    : await allocateSlug(supabase, slugFromTitle(input.title));
  const imageUrl = normalizeCover(input.imageUrl);
  const publishedAt = input.status === 'published' ? new Date().toISOString() : null;

  const row = {
    title: input.title,
    slug,
    excerpt: input.excerpt,
    content: input.content,
    category: input.category,
    content_type: 'news' as const,
    status: input.status,
    image_url: imageUrl,
    published_at: publishedAt,
    meta_title: input.metaTitle,
    meta_description: input.metaDescription,
    source: EDITOR_API_SOURCE,
    tags: input.tags,
    source_urls: input.sourceUrls,
  };

  const written = await writeRow(supabase, 'insert', null, row, { retrySlug: !input.slug });
  const revalidated =
    input.status === 'published' ? revalidateNewsSurfaces(written.row.slug) : false;

  return toJson(written.row, {
    source: written.dropped.includes('source') ? null : EDITOR_API_SOURCE,
    tags: written.dropped.includes('tags') ? [] : input.tags,
    sourceUrls: written.dropped.includes('source_urls') ? [] : input.sourceUrls,
    dropped: written.dropped,
    revalidated,
    includeContent: true,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
  });
}

export async function updateEditorArticle(
  id: string,
  patch: EditorArticlePatch,
): Promise<EditorArticleJson> {
  const supabase = client();
  const existing = await loadOwnedArticle(supabase, id);

  const nextStatus = patch.status ?? existing.status;
  const nextTitle = patch.title ?? existing.title;
  const nextSlug = patch.slug
    ? await allocateSlug(supabase, patch.slug, { strict: true, exceptId: id })
    : existing.slug;
  const nextContent = patch.content ?? existing.content ?? '';
  const nextExcerpt = patch.excerpt ?? existing.excerpt;
  const imageUrl =
    patch.imageUrl !== undefined ? normalizeCover(patch.imageUrl) : existing.image_url;

  let publishedAt = existing.published_at;
  if (nextStatus === 'draft') {
    publishedAt = null;
  } else if (!publishedAt) {
    publishedAt = new Date().toISOString();
  }

  const tags = patch.tags ?? existing.tags ?? [];
  const sourceUrls = patch.sourceUrls ?? existing.source_urls ?? [];

  const row = {
    title: nextTitle,
    slug: nextSlug,
    excerpt: nextExcerpt,
    content: nextContent,
    category: patch.category ?? existing.category,
    content_type: 'news' as const,
    status: nextStatus,
    image_url: imageUrl,
    published_at: publishedAt,
    meta_title: patch.metaTitle !== undefined ? patch.metaTitle : (existing.meta_title ?? null),
    meta_description:
      patch.metaDescription !== undefined ? patch.metaDescription : (existing.meta_description ?? null),
    source: EDITOR_API_SOURCE,
    tags,
    source_urls: sourceUrls,
  };

  const written = await writeRow(supabase, 'update', id, row, { retrySlug: false });
  const touchesPublic = nextStatus === 'published' || existing.status === 'published';
  const revalidated = touchesPublic ? revalidateNewsSurfaces(written.row.slug) : false;
  if (touchesPublic && existing.slug !== written.row.slug) {
    revalidateNewsSurfaces(existing.slug);
  }

  return toJson(written.row, {
    source: written.dropped.includes('source') ? null : EDITOR_API_SOURCE,
    tags: written.dropped.includes('tags') ? [] : tags,
    sourceUrls: written.dropped.includes('source_urls') ? [] : sourceUrls,
    dropped: written.dropped,
    revalidated,
    includeContent: true,
    metaTitle: typeof row.meta_title === 'string' ? row.meta_title : null,
    metaDescription: typeof row.meta_description === 'string' ? row.meta_description : null,
  });
}

export async function getEditorArticle(id: string): Promise<EditorArticleJson> {
  const supabase = client();
  const row = await loadOwnedArticle(supabase, id);
  return toJson(row, {
    source: row.source ?? null,
    tags: row.tags ?? [],
    sourceUrls: row.source_urls ?? [],
    dropped: [],
    includeContent: true,
  });
}

export async function listEditorArticles(
  query: EditorListQuery,
): Promise<{ items: EditorArticleJson[]; warning?: string }> {
  const supabase = client();
  const first = await runList(supabase, query, LIST_COLUMNS);
  if (!first.error) {
    return { items: (first.data ?? []).map((row) => summarize(row)) };
  }

  const missing = missingStiriColumn(first.error);
  if (missing && isProvenanceColumn(missing)) {
    const warning = `${MIGRATION_HINT} Column "${missing}" is missing, so editor rows cannot be distinguished yet.`;
    if (query.source === EDITOR_API_SOURCE || query.status === 'draft') {
      return { items: [], warning };
    }

    const bare = LIST_COLUMNS.replace(', source, tags, source_urls', '');
    const second = await runList(
      supabase,
      { limit: query.limit, status: 'published', source: 'all' },
      bare,
    );
    if (second.error) {
      console.error('[editor] list', second.error);
      throw new EditorApiError('Failed to list articles.', 500);
    }
    return {
      items: (second.data ?? []).map((row) => summarize(row)),
      warning,
    };
  }

  console.error('[editor] list', first.error);
  throw new EditorApiError('Failed to list articles.', 500);
}

async function runList(
  supabase: SupabaseClient,
  query: EditorListQuery,
  columns: string,
): Promise<{ data: StiriRow[] | null; error: DbError | null }> {
  let request = supabase
    .from(TABLE)
    .select(columns)
    .eq('content_type', 'news')
    .order('created_at', { ascending: false, nullsFirst: false })
    .limit(query.limit);

  if (query.source === EDITOR_API_SOURCE || query.status === 'draft') {
    // Admin drafts stay in /admin. This list only adds editor drafts.
    request = request.eq('source', EDITOR_API_SOURCE);
    if (query.status) request = request.eq('status', query.status);
  } else if (query.status === 'published') {
    request = request.eq('status', 'published');
  } else {
    request = request.or('status.eq.published,and(status.eq.draft,source.eq.editor_api)');
  }

  const { data, error } = await request;
  return { data: (data ?? null) as StiriRow[] | null, error };
}

async function loadOwnedArticle(supabase: SupabaseClient, id: string): Promise<StiriRow> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(DETAIL_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    const missing = missingStiriColumn(error);
    if (missing && isProvenanceColumn(missing)) {
      throw new EditorApiError(
        `Editor updates need the provenance columns. ${MIGRATION_HINT}`,
        503,
      );
    }
    console.error('[editor] load', error);
    throw new EditorApiError(schemaHint(error) ?? 'Failed to load article.', 500);
  }

  if (!data) {
    throw new EditorApiError('Article not found.', 404);
  }

  const row = data as StiriRow;
  if (row.content_type === 'market_pulse') {
    throw new EditorApiError('This endpoint only updates standard news articles.', 409);
  }
  if (row.source !== EDITOR_API_SOURCE) {
    throw new EditorApiError('This article was not created by the editor API.', 403);
  }
  return row;
}

async function allocateSlug(
  supabase: SupabaseClient,
  preferred: string,
  options: { strict?: boolean; exceptId?: string } = {},
): Promise<string> {
  const base = preferred || slugFromTitle('stire');
  if (options.strict) {
    if (await slugTaken(supabase, base, options.exceptId)) {
      throw new EditorApiError(`Slug "${base}" is already in use.`, 409);
    }
    return base;
  }

  for (let n = 1; n <= 30; n += 1) {
    const candidate = n === 1 ? base : withSlugSuffix(base, n);
    if (!(await slugTaken(supabase, candidate, options.exceptId))) return candidate;
  }
  throw new EditorApiError('Could not allocate a unique slug.', 409);
}

async function writeRow(
  supabase: SupabaseClient,
  mode: 'insert' | 'update',
  id: string | null,
  row: Record<string, unknown>,
  options: { retrySlug: boolean },
): Promise<{ row: StiriRow; dropped: string[] }> {
  const payload: Record<string, unknown> = { ...row };
  const dropped: string[] = [];

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const builder = supabase.from(TABLE);
    const query =
      mode === 'insert'
        ? builder.insert(payload)
        : builder.update(payload).eq('id', id as string);

    const { data, error } = await query.select(RETURN_COLUMNS).single();
    if (!error && data) {
      return { row: data as StiriRow, dropped };
    }

    const missing = missingStiriColumn(error);
    if (missing && isProvenanceColumn(missing) && missing in payload) {
      delete payload[missing];
      dropped.push(missing);
      continue;
    }

    if (error && isUniqueSlugViolation(error) && options.retrySlug && typeof payload.slug === 'string') {
      payload.slug = withSlugSuffix(payload.slug, attempt + 2);
      continue;
    }

    console.error('[editor] write', error);
    if (error && isUniqueSlugViolation(error)) {
      throw new EditorApiError('Slug is already in use.', 409);
    }
    throw new EditorApiError(schemaHint(error) ?? 'Failed to save article.', 500);
  }

  throw new EditorApiError('Failed to save article.', 500);
}

async function slugTaken(
  supabase: SupabaseClient,
  slug: string,
  exceptId?: string,
): Promise<boolean> {
  let request = supabase.from(TABLE).select('id').eq('slug', slug);
  if (exceptId) request = request.neq('id', exceptId);
  const { data, error } = await request.maybeSingle();
  if (error) {
    console.error('[editor] slug', error);
    throw new EditorApiError('Failed to check slug.', 500);
  }
  return Boolean(data);
}

function normalizeCover(imageUrl: string | null): string | null {
  if (!imageUrl) return null;
  const stored = prepareImageUrlForStorage(imageUrl);
  if (!stored) {
    throw new EditorApiError('Field "image_url" could not be stored.', 400);
  }
  return stored;
}

function revalidateNewsSurfaces(slug: string): boolean {
  try {
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/stiri', 'page');
    revalidatePath(`/stiri/${slug}`);
    revalidatePath('/sitemap.xml');
    revalidatePath('/news-sitemap.xml');
    revalidatePath('/feed.xml');
    revalidatePath('/hub/bitcoin');
    revalidatePath('/hub/mica');
    revalidatePath('/hub/securitate');
    return true;
  } catch (error) {
    console.error('[editor] revalidate', error);
    return false;
  }
}

function summarize(row: StiriRow): EditorArticleJson {
  return toJson(row, {
    source: row.source ?? null,
    tags: row.tags ?? [],
    sourceUrls: row.source_urls ?? [],
    dropped: [],
    includeContent: false,
  });
}

function toJson(
  row: StiriRow,
  extras: {
    source: string | null;
    tags: string[];
    sourceUrls: string[];
    dropped: string[];
    revalidated?: boolean;
    includeContent: boolean;
    metaTitle?: string | null;
    metaDescription?: string | null;
  },
): EditorArticleJson {
  const path = `/stiri/${row.slug}`;
  const body: EditorArticleJson = {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    category: row.category,
    status: row.status,
    content_type: 'news',
    image_url: row.image_url,
    published_at: row.published_at,
    created_at: row.created_at,
    source: extras.source,
    tags: extras.tags,
    source_urls: extras.sourceUrls,
    author: EDITORIAL_DESK_NAME,
    path,
    url: `${SITE_URL}${path}`,
  };

  if (extras.includeContent) {
    body.content = row.content ?? '';
    body.word_count = countWords(body.content);
    body.meta_title = extras.metaTitle !== undefined ? extras.metaTitle : (row.meta_title ?? null);
    body.meta_description =
      extras.metaDescription !== undefined ? extras.metaDescription : (row.meta_description ?? null);
    body.provenance_stored = !extras.dropped.includes('source');
    if (extras.revalidated !== undefined) body.revalidated = extras.revalidated;
    const warning = provenanceWarning(extras.dropped);
    if (warning) body.warning = warning;
  }

  return body;
}

function provenanceWarning(dropped: string[]): string | null {
  if (dropped.length === 0) return null;
  const base = `Saved without column(s): ${dropped.join(', ')}. ${MIGRATION_HINT}`;
  if (dropped.includes('source')) {
    return `${base} This row is not marked as an editor article, and the API will not be able to update it until source is set to "${EDITOR_API_SOURCE}".`;
  }
  return base;
}

function schemaHint(error: DbError | null): string | null {
  const message = error?.message ?? '';
  if (/content_type/i.test(message)) {
    return 'Database is missing content_type. Run supabase/market-pulse-schema.sql in the Supabase SQL Editor.';
  }
  if (/meta_title|meta_description/i.test(message)) {
    return 'Database is missing SEO columns. Run supabase/seo-schema.sql in the Supabase SQL Editor.';
  }
  return null;
}
