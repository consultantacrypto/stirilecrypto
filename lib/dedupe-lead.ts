const HTML_ENTITY_MAP: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => {
      const code = Number.parseInt(hex, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : '';
    })
    .replace(/&#(\d+);/g, (_, dec: string) => {
      const code = Number.parseInt(dec, 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : '';
    })
    .replace(/&([a-z]+);/gi, (match, name: string) => {
      return HTML_ENTITY_MAP[name.toLowerCase()] ?? match;
    });
}

/** Collapse tags, entities, whitespace and line breaks for exact comparison. */
export function normalizeComparableText(value: string): string {
  const withoutTags = value.replace(/<[^>]+>/g, ' ');
  const decoded = decodeHtmlEntities(withoutTags);
  return decoded.replace(/\s+/g, ' ').trim();
}

function findFirstParagraph(html: string): { start: number; end: number; inner: string } | null {
  const match = /<p\b[^>]*>([\s\S]*?)<\/p>/i.exec(html);
  if (!match || match.index === undefined) return null;
  return {
    start: match.index,
    end: match.index + match[0].length,
    inner: match[1] ?? '',
  };
}

export type DedupeLeadResult = {
  content: string;
  removed: boolean;
};

/**
 * Drops the first HTML <p> from `content` only when its normalized text is
 * identical to the normalized excerpt. No fuzzy matching.
 */
export function removeDuplicateLeadParagraph(
  excerpt: string | null | undefined,
  content: string | null | undefined,
): DedupeLeadResult {
  const body = content ?? '';
  const lead = excerpt ?? '';

  if (!lead.trim() || !body.trim()) {
    return { content: body, removed: false };
  }

  const first = findFirstParagraph(body);
  if (!first) {
    return { content: body, removed: false };
  }

  const excerptNorm = normalizeComparableText(lead);
  const paragraphNorm = normalizeComparableText(first.inner);

  if (!excerptNorm || !paragraphNorm) {
    return { content: body, removed: false };
  }

  if (excerptNorm !== paragraphNorm) {
    return { content: body, removed: false };
  }

  const stripped = `${body.slice(0, first.start)}${body.slice(first.end)}`.trim();
  return { content: stripped, removed: true };
}
