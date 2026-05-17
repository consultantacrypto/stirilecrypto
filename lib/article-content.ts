import { enhanceContent } from '@/lib/dictionary';

const HTML_CONTENT_PATTERN =
  /<\s*(p|h[1-6]|div|ul|ol|li|br|strong|em|a|blockquote|span|table|img)\b/i;

export function isHtmlArticleContent(content: string): boolean {
  return HTML_CONTENT_PATTERN.test(content.trim());
}

export function prepareArticleContent(content: string): {
  html: string;
  usePreWrap: boolean;
} {
  const trimmed = content.trim();
  if (!trimmed) {
    return { html: '', usePreWrap: false };
  }

  const usePreWrap = !isHtmlArticleContent(trimmed);
  return {
    html: enhanceContent(trimmed),
    usePreWrap,
  };
}
