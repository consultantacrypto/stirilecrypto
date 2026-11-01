export type InlineLink = {
  phrase: string;
  href: string;
};

export type TextSegment = string | { text: string; href: string };

/** Wrap exact phrases in links. The joined visible text stays identical to `text`. */
export function linkPhrases(text: string, links: readonly InlineLink[]): TextSegment[] {
  for (const link of links) {
    if (!text.includes(link.phrase)) {
      throw new Error(`Link phrase not found in text: ${link.phrase}`);
    }
  }

  const marks: { start: number; end: number; href: string }[] = [];
  const ordered = [...links].sort((a, b) => b.phrase.length - a.phrase.length);

  for (const link of ordered) {
    let from = 0;
    while (from < text.length) {
      const start = text.indexOf(link.phrase, from);
      if (start === -1) break;
      const end = start + link.phrase.length;
      const overlaps = marks.some((mark) => start < mark.end && end > mark.start);
      if (!overlaps) marks.push({ start, end, href: link.href });
      from = end;
    }
  }

  marks.sort((a, b) => a.start - b.start);

  const segments: TextSegment[] = [];
  let cursor = 0;
  for (const mark of marks) {
    if (mark.start > cursor) segments.push(text.slice(cursor, mark.start));
    segments.push({ text: text.slice(mark.start, mark.end), href: mark.href });
    cursor = mark.end;
  }
  if (cursor < text.length) segments.push(text.slice(cursor));
  return segments;
}

export function plainText(segments: readonly TextSegment[]): string {
  return segments.map((segment) => (typeof segment === 'string' ? segment : segment.text)).join('');
}
