const HTML_CONTENT_PATTERN =
  /<\s*(p|h[1-6]|div|ul|ol|li|br|strong|em|a|blockquote|span|table|img)\b/i;

const MARKDOWN_LINK_PATTERN = /\[[^\]]+\]\([^)]+\)/;
const MARKDOWN_HEADING_PATTERN = /^#{1,6}\s/m;

export type ArticleContentFormat = 'html' | 'markdown';

export function isHtmlArticleContent(content: string): boolean {
  return HTML_CONTENT_PATTERN.test(content.trim());
}

/** Admin saves HTML and/or Markdown — detect which renderer to use */
export function detectArticleContentFormat(content: string): ArticleContentFormat {
  const trimmed = content.trim();
  if (!trimmed) return 'markdown';

  // Markdown links/headings take priority (e.g. affiliate [text](url) in a textarea)
  if (MARKDOWN_LINK_PATTERN.test(trimmed) || MARKDOWN_HEADING_PATTERN.test(trimmed)) {
    return 'markdown';
  }

  if (isHtmlArticleContent(trimmed)) {
    return 'html';
  }

  return 'markdown';
}

export const ARTICLE_PROSE_CLASSES = [
  'prose prose-invert prose-lg max-w-none',
  'text-gray-300 font-[var(--font-inter)] leading-relaxed',
  'prose-headings:font-[var(--font-space)] prose-headings:text-white',
  'prose-p:text-gray-300 prose-li:text-gray-300',
  'prose-a:text-blue-500 prose-a:underline prose-a:font-bold hover:prose-a:text-blue-400',
  'prose-strong:text-white',
  '[&_a]:text-blue-500 [&_a]:underline [&_a]:font-bold hover:[&_a]:text-blue-400',
  '[&_a]:transition-colors',
].join(' ');
