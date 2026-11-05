/**
 * Sitemap lastmod values taken from `git log -1 --format=%cI` of the source
 * file, or from a content revision constant. Never the request clock.
 *
 * Operator pages were revised on 5 Nov 2026 (QuickExit identity).
 */
export const OPERATOR_COPY_LASTMOD = '2026-11-05T08:45:00.000Z';

export const SITEMAP_LASTMOD = {
  home: '2026-10-24T19:23:34+03:00',
  stiri: '2026-11-01T12:33:43+02:00',
  interviuri: '2026-10-24T19:23:34+03:00',
  marketPulse: '2026-11-01T12:33:43+02:00',
  market: '2026-10-24T19:23:34+03:00',
  airdropAlert: '2026-10-29T14:18:18+02:00',
  academie: '2026-08-14T20:15:33+03:00',
  dictionary: '2026-10-24T19:23:34+03:00',
  lichidari: '2026-10-24T19:23:34+03:00',
  redactie: '2026-11-01T12:33:43+02:00',
  editorialPolicy: '2026-11-01T12:33:43+02:00',
  corrections: '2026-10-28T18:16:39+02:00',
  advertising: OPERATOR_COPY_LASTMOD,
  analizaTehnica: '2026-10-24T19:23:34+03:00',
  verificarePortofel: '2026-10-26T13:40:36+02:00',
  despre: OPERATOR_COPY_LASTMOD,
  intrebari: '2026-11-01T12:33:43+02:00',
  contact: '2026-10-24T15:30:40+03:00',
  raportStrategic: '2026-10-24T19:23:34+03:00',
  termeni: '2026-08-10T17:04:20+03:00',
  confidentialitate: '2026-08-10T17:04:20+03:00',
  cookies: '2026-08-10T17:04:20+03:00',
  taxe: '2026-10-24T19:40:55+03:00',
  cauta: '2026-10-24T19:23:34+03:00',
  glosar: '2026-10-24T19:23:34+03:00',
  incepeAici: '2026-11-01T12:33:43+02:00',
  hubTopic: '2026-11-01T12:33:43+02:00',
  hubStiriRomania: '2026-11-01T12:33:43+02:00',
  authorDaniel: '2026-10-28T18:16:39+02:00',
  authorCristian: '2026-10-28T18:16:39+02:00',
  authorEduard: '2026-11-01T12:33:43+02:00',
  authorEmilian: '2026-10-28T18:16:39+02:00',
} as const;

const AUTHOR_LASTMOD_BY_PATH: Record<string, string> = {
  '/autori/daniel-mihai': SITEMAP_LASTMOD.authorDaniel,
  '/autori/cristian-vasile': SITEMAP_LASTMOD.authorCristian,
  '/autori/eduard-mihai': SITEMAP_LASTMOD.authorEduard,
  '/autori/emilian-constantin': SITEMAP_LASTMOD.authorEmilian,
};

export function authorPageLastModified(path: string): Date {
  return sitemapDate(AUTHOR_LASTMOD_BY_PATH[path] ?? SITEMAP_LASTMOD.authorDaniel);
}

export function sitemapDate(iso: string): Date {
  return new Date(iso);
}

/** Real content time when one exists. Undefined when the row has no timestamp. */
export function contentLastModified(iso: string | null | undefined): Date | undefined {
  if (!iso?.trim()) return undefined;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** Later of the source-file constant and any real content timestamps. */
export function latestContentDate(
  fallbackIso: string,
  candidates: Array<string | null | undefined>,
): Date {
  let best = sitemapDate(fallbackIso).getTime();
  for (const candidate of candidates) {
    const parsed = contentLastModified(candidate);
    if (parsed && parsed.getTime() > best) best = parsed.getTime();
  }
  return new Date(best);
}
