import { detectArticleContentFormat } from '@/lib/article-content';

const CONCLUSION_MARKDOWN = /^#{1,3}\s*(Concluzie|Sfat\s+practic)\b/im;
const CONCLUSION_HTML =
  /<h[23][^>]*>[^<]*(?:Concluzie|Sfat\s+practic)[^<]*<\/h[23]>/i;

export interface SplitArticleContent {
  main: string;
  conclusion: string | null;
}

/** Splits body from optional Concluzie / Sfat practic section */
export function splitArticleContent(content: string): SplitArticleContent {
  const trimmed = content.trim();
  if (!trimmed) return { main: '', conclusion: null };

  const format = detectArticleContentFormat(trimmed);

  if (format === 'markdown') {
    const match = CONCLUSION_MARKDOWN.exec(trimmed);
    if (match?.index !== undefined && match.index >= 0) {
      return {
        main: trimmed.slice(0, match.index).trim(),
        conclusion: trimmed.slice(match.index).trim(),
      };
    }
  } else {
    const match = CONCLUSION_HTML.exec(trimmed);
    if (match?.index !== undefined && match.index >= 0) {
      return {
        main: trimmed.slice(0, match.index).trim(),
        conclusion: trimmed.slice(match.index).trim(),
      };
    }
  }

  return { main: trimmed, conclusion: null };
}
