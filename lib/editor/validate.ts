import { EDITOR_API_SOURCE } from './constants';
import { canonicalArticleCategory, ARTICLE_CATEGORIES, type ArticleCategory } from '../stiri-categories';
import { slugify } from '../slugify';
import type { ArticleStatus } from '../types/stiri';

/** Same slug rule as the admin article form. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const UNSAFE_MARKUP =
  /<\s*\/?\s*(script|iframe|object|embed|form)\b|javascript\s*:|data\s*:\s*text\/html|on[a-z]+\s*=/i;

const TITLE_MAX = 200;
const EXCERPT_MAX = 500;
const CONTENT_MAX = 60_000;
const SLUG_MAX = 120;
const TAG_MAX = 40;
const TAGS_MAX = 12;
const SOURCE_URLS_MAX = 8;
const URL_MAX = 2000;
const META_TITLE_MAX = 120;
const META_DESCRIPTION_MAX = 320;

export type EditorArticleCreate = {
  title: string;
  content: string;
  category: ArticleCategory;
  excerpt: string;
  tags: string[];
  sourceUrls: string[];
  imageUrl: string | null;
  status: ArticleStatus;
  slug: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
};

export type EditorArticlePatch = {
  title?: string;
  content?: string;
  category?: ArticleCategory;
  excerpt?: string;
  tags?: string[];
  sourceUrls?: string[];
  imageUrl?: string | null;
  status?: ArticleStatus;
  slug?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

export type EditorListQuery = {
  limit: number;
  status: ArticleStatus | null;
  source: typeof EDITOR_API_SOURCE | 'all';
};

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; error: string };

export function plainTextFromArticle(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~`>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function countWords(content: string): number {
  const plain = plainTextFromArticle(content);
  if (!plain) return 0;
  return plain.split(/\s+/).length;
}

export function deriveExcerpt(content: string, max = 240): string {
  const plain = plainTextFromArticle(content);
  if (plain.length <= max) return plain;
  const sliced = plain.slice(0, max);
  const cut = sliced.replace(/\s+\S*$/, '').trim();
  return `${cut || sliced.trim()}…`;
}

export function slugFromTitle(title: string): string {
  const base = slugify(title).slice(0, SLUG_MAX);
  return base || `stire-${Date.now()}`;
}

/** Numeric suffix used when the generated slug is already taken. */
export function withSlugSuffix(base: string, n: number): string {
  const normalized = slugify(base).slice(0, SLUG_MAX) || 'stire';
  if (n <= 1) return normalized;
  const suffix = `-${n}`;
  const stem = normalized.slice(0, SLUG_MAX - suffix.length).replace(/-+$/g, '') || 'stire';
  return `${stem}${suffix}`.slice(0, SLUG_MAX);
}

export function isValidSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= SLUG_MAX && SLUG_PATTERN.test(slug);
}

export function validateCreateBody(body: unknown): ValidationResult<EditorArticleCreate> {
  const raw = asRecord(body);
  if (!raw) return fail('Invalid JSON body.');

  const title = requiredPlainText(raw, 'title', { min: 3, max: TITLE_MAX });
  if ('error' in title) return fail(title.error);

  const content = requiredContent(raw);
  if ('error' in content) return fail(content.error);

  const category = requiredCategory(raw);
  if ('error' in category) return fail(category.error);

  const status = requiredStatus(raw);
  if ('error' in status) return fail(status.error);

  const excerpt = optionalPlainText(raw, 'excerpt', EXCERPT_MAX);
  if ('error' in excerpt) return fail(excerpt.error);

  const tags = readTags(raw);
  if ('error' in tags) return fail(tags.error);

  const sourceUrls = readSourceUrls(raw);
  if ('error' in sourceUrls) return fail(sourceUrls.error);

  const imageUrl = readImageUrl(raw);
  if ('error' in imageUrl) return fail(imageUrl.error);

  const slug = readSlug(raw);
  if ('error' in slug) return fail(slug.error);

  const metaTitle = optionalPlainText(raw, 'meta_title', META_TITLE_MAX);
  if ('error' in metaTitle) return fail(metaTitle.error);

  const metaDescription = optionalPlainText(raw, 'meta_description', META_DESCRIPTION_MAX);
  if ('error' in metaDescription) return fail(metaDescription.error);

  const derivedExcerpt = excerpt.value?.trim() || deriveExcerpt(content.value);
  if (!derivedExcerpt) return fail('Field "excerpt" is required when the body has no readable text.');

  return {
    ok: true,
    value: {
      title: title.value,
      content: content.value,
      category: category.value,
      excerpt: derivedExcerpt.slice(0, EXCERPT_MAX),
      tags: tags.value,
      sourceUrls: sourceUrls.value,
      imageUrl: imageUrl.value,
      status: status.value,
      slug: slug.value,
      metaTitle: metaTitle.value,
      metaDescription: metaDescription.value,
    },
  };
}

export function validatePatchBody(body: unknown): ValidationResult<EditorArticlePatch> {
  const raw = asRecord(body);
  if (!raw) return fail('Invalid JSON body.');

  const patch: EditorArticlePatch = {};

  if ('title' in raw) {
    const title = requiredPlainText(raw, 'title', { min: 3, max: TITLE_MAX });
    if ('error' in title) return fail(title.error);
    patch.title = title.value;
  }

  if ('content' in raw || 'body' in raw) {
    const content = requiredContent(raw);
    if ('error' in content) return fail(content.error);
    patch.content = content.value;
  }

  if ('category' in raw) {
    const category = requiredCategory(raw);
    if ('error' in category) return fail(category.error);
    patch.category = category.value;
  }

  if ('status' in raw) {
    const status = requiredStatus(raw);
    if ('error' in status) return fail(status.error);
    patch.status = status.value;
  }

  if ('excerpt' in raw) {
    const excerpt = optionalPlainText(raw, 'excerpt', EXCERPT_MAX);
    if ('error' in excerpt) return fail(excerpt.error);
    if (!excerpt.value) return fail('Field "excerpt" cannot be empty.');
    patch.excerpt = excerpt.value;
  }

  if ('tags' in raw) {
    const tags = readTags(raw);
    if ('error' in tags) return fail(tags.error);
    patch.tags = tags.value;
  }

  if ('source_urls' in raw) {
    const sourceUrls = readSourceUrls(raw);
    if ('error' in sourceUrls) return fail(sourceUrls.error);
    patch.sourceUrls = sourceUrls.value;
  }

  if ('image_url' in raw || 'cover_image_url' in raw) {
    const imageUrl = readImageUrl(raw);
    if ('error' in imageUrl) return fail(imageUrl.error);
    patch.imageUrl = imageUrl.value;
  }

  if ('slug' in raw) {
    const slug = readSlug(raw);
    if ('error' in slug) return fail(slug.error);
    if (!slug.value) return fail('Field "slug" cannot be empty.');
    patch.slug = slug.value;
  }

  if ('meta_title' in raw) {
    const metaTitle = optionalPlainText(raw, 'meta_title', META_TITLE_MAX);
    if ('error' in metaTitle) return fail(metaTitle.error);
    patch.metaTitle = metaTitle.value;
  }

  if ('meta_description' in raw) {
    const metaDescription = optionalPlainText(raw, 'meta_description', META_DESCRIPTION_MAX);
    if ('error' in metaDescription) return fail(metaDescription.error);
    patch.metaDescription = metaDescription.value;
  }

  if (Object.keys(patch).length === 0) {
    return fail('Provide at least one field to update.');
  }

  return { ok: true, value: patch };
}

export function parseEditorListQuery(params: URLSearchParams): ValidationResult<EditorListQuery> {
  const limitRaw = params.get('limit');
  let limit = 20;
  if (limitRaw !== null && limitRaw.trim() !== '') {
    if (!/^\d+$/.test(limitRaw.trim())) {
      return fail('Query "limit" must be an integer between 1 and 50.');
    }
    limit = Number(limitRaw);
    if (limit < 1 || limit > 50) {
      return fail('Query "limit" must be an integer between 1 and 50.');
    }
  }

  const statusRaw = params.get('status');
  let status: ArticleStatus | null = null;
  if (statusRaw !== null && statusRaw.trim() !== '') {
    if (statusRaw !== 'draft' && statusRaw !== 'published') {
      return fail('Query "status" must be "draft" or "published".');
    }
    status = statusRaw;
  }

  const sourceRaw = params.get('source');
  let source: EditorListQuery['source'] = 'all';
  if (sourceRaw !== null && sourceRaw.trim() !== '' && sourceRaw !== 'all') {
    if (sourceRaw !== EDITOR_API_SOURCE) {
      return fail('Query "source" must be "editor_api" or "all".');
    }
    source = EDITOR_API_SOURCE;
  }

  return { ok: true, value: { limit, status, source } };
}

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

function asRecord(body: unknown): Record<string, unknown> | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  return body as Record<string, unknown>;
}

function requiredPlainText(
  raw: Record<string, unknown>,
  key: string,
  limits: { min: number; max: number },
): { value: string } | { error: string } {
  const read = readOptionalString(raw, key);
  if ('error' in read) return read;
  const value = read.value?.trim() ?? '';
  if (!value) return fail(`Field "${key}" is required.`);
  if (value.length < limits.min) return fail(`Field "${key}" is too short.`);
  if (value.length > limits.max) return fail(`Field "${key}" is too long.`);
  if (/[<>]/.test(value)) return fail(`Field "${key}" must be plain text.`);
  return { value };
}

function optionalPlainText(
  raw: Record<string, unknown>,
  key: string,
  max: number,
): { value: string | null } | { error: string } {
  if (!(key in raw) || raw[key] === undefined || raw[key] === null) {
    return { value: null };
  }
  if (typeof raw[key] !== 'string') return fail(`Field "${key}" must be a string.`);
  const value = raw[key].trim();
  if (!value) return { value: null };
  if (value.length > max) return fail(`Field "${key}" is too long.`);
  if (/[<>]/.test(value)) return fail(`Field "${key}" must be plain text.`);
  return { value };
}

function requiredContent(raw: Record<string, unknown>): { value: string } | { error: string } {
  const fromContent = readOptionalString(raw, 'content');
  if ('error' in fromContent) return fromContent;
  const fromBody = readOptionalString(raw, 'body');
  if ('error' in fromBody) return fromBody;

  if (fromContent.value && fromBody.value && fromContent.value.trim() !== fromBody.value.trim()) {
    return fail('Fields "content" and "body" disagree. Send one of them.');
  }

  const value = (fromContent.value ?? fromBody.value ?? '').trim();
  if (!value) return fail('Field "content" (or "body") is required.');
  if (value.length > CONTENT_MAX) return fail('Field "content" is too long.');
  if (UNSAFE_MARKUP.test(value)) {
    return fail('Field "content" contains markup the site will not store (script, iframe, or inline event handlers).');
  }
  if (!plainTextFromArticle(value)) return fail('Field "content" has no readable text.');
  return { value };
}

function requiredCategory(raw: Record<string, unknown>): { value: ArticleCategory } | { error: string } {
  const read = readOptionalString(raw, 'category');
  if ('error' in read) return read;
  const value = read.value?.trim() ?? '';
  if (!value) return fail('Field "category" is required.');
  const category = canonicalArticleCategory(value);
  if (!category) {
    return fail(`Field "category" must be one of: ${ARTICLE_CATEGORIES.join(', ')}.`);
  }
  return { value: category };
}

function requiredStatus(raw: Record<string, unknown>): { value: ArticleStatus } | { error: string } {
  const read = readOptionalString(raw, 'status');
  if ('error' in read) return read;
  const value = read.value?.trim() ?? '';
  if (value !== 'draft' && value !== 'published') {
    return fail('Field "status" must be "draft" or "published".');
  }
  return { value };
}

function readTags(raw: Record<string, unknown>): { value: string[] } | { error: string } {
  if (!('tags' in raw) || raw.tags === undefined || raw.tags === null) return { value: [] };
  if (!Array.isArray(raw.tags)) return fail('Field "tags" must be an array of strings.');
  if (raw.tags.length > TAGS_MAX) return fail(`Field "tags" accepts at most ${TAGS_MAX} items.`);

  const tags: string[] = [];
  const seen = new Set<string>();
  for (const item of raw.tags) {
    if (typeof item !== 'string') return fail('Field "tags" must be an array of strings.');
    const tag = item.trim().replace(/\s+/g, ' ');
    if (!tag) continue;
    if (tag.length > TAG_MAX) return fail(`Each tag must be at most ${TAG_MAX} characters.`);
    if (/[<>]/.test(tag)) return fail('Tags must be plain text.');
    const key = tag.toLocaleLowerCase('ro');
    if (seen.has(key)) continue;
    seen.add(key);
    tags.push(tag);
  }
  return { value: tags };
}

function readSourceUrls(raw: Record<string, unknown>): { value: string[] } | { error: string } {
  if (!('source_urls' in raw) || raw.source_urls === undefined || raw.source_urls === null) {
    return { value: [] };
  }
  if (!Array.isArray(raw.source_urls)) return fail('Field "source_urls" must be an array of URLs.');
  if (raw.source_urls.length > SOURCE_URLS_MAX) {
    return fail(`Field "source_urls" accepts at most ${SOURCE_URLS_MAX} URLs.`);
  }

  const urls: string[] = [];
  const seen = new Set<string>();
  for (const item of raw.source_urls) {
    if (typeof item !== 'string') return fail('Field "source_urls" must be an array of URLs.');
    const url = normalizeHttpsUrl(item.trim());
    if (!url) return fail('Each source URL must be an absolute https URL.');
    if (seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
  }
  return { value: urls };
}

function readImageUrl(raw: Record<string, unknown>): { value: string | null } | { error: string } {
  const keys = ['image_url', 'cover_image_url'] as const;
  const present = keys.filter((key) => key in raw && raw[key] !== undefined);
  if (present.length === 0) return { value: null };

  const values = present.map((key) => raw[key]);
  if (values.some((value) => value !== null && typeof value !== 'string')) {
    return fail('Field "image_url" must be an https URL or a root-relative path.');
  }

  const normalized = values.map((value) => (typeof value === 'string' ? value.trim() : ''));
  const unique = new Set(normalized.filter(Boolean));
  if (unique.size > 1) {
    return fail('Fields "image_url" and "cover_image_url" disagree. Send one of them.');
  }

  const value = normalized.find(Boolean) ?? '';
  if (!value) return { value: null };
  if (value.length > URL_MAX) return fail('Field "image_url" is too long.');
  if (!isAcceptableImageUrl(value)) {
    return fail('Field "image_url" must be an https URL or a root-relative path.');
  }
  return { value };
}

function readSlug(raw: Record<string, unknown>): { value: string | null } | { error: string } {
  if (!('slug' in raw) || raw.slug === undefined || raw.slug === null) return { value: null };
  if (typeof raw.slug !== 'string') return fail('Field "slug" must be a string.');
  const slug = raw.slug.trim();
  if (!slug) return { value: null };
  if (!isValidSlug(slug)) {
    return fail('Field "slug" may contain only lowercase letters, digits, and single hyphens (max 120 characters).');
  }
  return { value: slug };
}

function readOptionalString(
  raw: Record<string, unknown>,
  key: string,
): { value: string | null } | { error: string } {
  if (!(key in raw) || raw[key] === undefined || raw[key] === null) return { value: null };
  if (typeof raw[key] !== 'string') return fail(`Field "${key}" must be a string.`);
  return { value: raw[key] };
}

function isAcceptableImageUrl(value: string): boolean {
  if (value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')) return true;
  return normalizeHttpsUrl(value) !== null;
}

function normalizeHttpsUrl(value: string): string | null {
  if (!value || value.length > URL_MAX) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    if (url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}
