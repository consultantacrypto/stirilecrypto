import type { MetadataRoute } from 'next';
import { getAllPublishedArticles, getAllPublishedMarketPulseArticles } from '@/lib/articles-db';
import { getPublishedInterviews } from '@/lib/interviews-db';
import { dictionary } from '@/lib/dictionary';
import { PERSON_AUTHORS } from '@/lib/authors';
import {
  ADVERTISING_POLICY_PATH,
  CORRECTIONS_POLICY_PATH,
  EDITORIAL_POLICY_PATH,
  SITE_URL,
} from '@/lib/json-ld';
import { articlePublicationIso } from '@/lib/published-time';
import {
  SITEMAP_LASTMOD,
  authorPageLastModified,
  contentLastModified,
  latestContentDate,
  sitemapDate,
} from '@/lib/sitemap-lastmod';

/** Runtime generation — avoids blocking build when Supabase is unavailable */
export const dynamic = 'force-dynamic';

function articleLastModified(article: {
  published_at: string | null;
  created_at?: string | null;
}): Date | undefined {
  return contentLastModified(articlePublicationIso(article.published_at, article.created_at));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let published: Awaited<ReturnType<typeof getAllPublishedArticles>> = [];
  try {
    published = await getAllPublishedArticles();
  } catch (err) {
    console.error('[sitemap] Failed to fetch published articles:', err);
  }

  let pulses: Awaited<ReturnType<typeof getAllPublishedMarketPulseArticles>> = [];
  try {
    pulses = await getAllPublishedMarketPulseArticles();
  } catch (err) {
    console.error('[sitemap] Failed to fetch market pulse articles:', err);
  }

  let interviews: Awaited<ReturnType<typeof getPublishedInterviews>> = [];
  try {
    interviews = await getPublishedInterviews();
  } catch (err) {
    console.error('[sitemap] Failed to fetch published interviews:', err);
  }

  const newsStamp = latestContentDate(
    SITEMAP_LASTMOD.stiri,
    published.map((article) => articlePublicationIso(article.published_at, article.created_at)),
  );
  const pulseStamp = latestContentDate(
    SITEMAP_LASTMOD.marketPulse,
    pulses.map((pulse) => articlePublicationIso(pulse.published_at, pulse.created_at)),
  );
  const interviewStamp = latestContentDate(
    SITEMAP_LASTMOD.interviuri,
    interviews.map((interview) => interview.created_at),
  );
  const homeStamp = latestContentDate(SITEMAP_LASTMOD.home, [
    ...published.map((article) => articlePublicationIso(article.published_at, article.created_at)),
    ...pulses.map((pulse) => articlePublicationIso(pulse.published_at, pulse.created_at)),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: homeStamp, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/stiri`, lastModified: newsStamp, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/interviuri`, lastModified: interviewStamp, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE_URL}/market-pulse`, lastModified: pulseStamp, changeFrequency: 'daily', priority: 0.88 },
    { url: `${SITE_URL}/market`, lastModified: sitemapDate(SITEMAP_LASTMOD.market), changeFrequency: 'hourly', priority: 0.85 },
    { url: `${SITE_URL}/airdrop-alert`, lastModified: sitemapDate(SITEMAP_LASTMOD.airdropAlert), changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/academie`, lastModified: sitemapDate(SITEMAP_LASTMOD.dictionary), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/lichidari`, lastModified: sitemapDate(SITEMAP_LASTMOD.lichidari), changeFrequency: 'hourly', priority: 0.75 },
    { url: `${SITE_URL}/redactie`, lastModified: sitemapDate(SITEMAP_LASTMOD.redactie), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}${EDITORIAL_POLICY_PATH}`, lastModified: sitemapDate(SITEMAP_LASTMOD.editorialPolicy), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}${CORRECTIONS_POLICY_PATH}`, lastModified: sitemapDate(SITEMAP_LASTMOD.corrections), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}${ADVERTISING_POLICY_PATH}`, lastModified: sitemapDate(SITEMAP_LASTMOD.advertising), changeFrequency: 'monthly', priority: 0.4 },
    ...PERSON_AUTHORS.map((author) => ({
      url: `${SITE_URL}${author.path}`,
      lastModified: authorPageLastModified(author.path),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    { url: `${SITE_URL}/analiza-tehnica`, lastModified: sitemapDate(SITEMAP_LASTMOD.analizaTehnica), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/verificare-portofel`, lastModified: sitemapDate(SITEMAP_LASTMOD.verificarePortofel), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/despre`, lastModified: sitemapDate(SITEMAP_LASTMOD.despre), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/intrebari-frecvente`, lastModified: sitemapDate(SITEMAP_LASTMOD.intrebari), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: sitemapDate(SITEMAP_LASTMOD.contact), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/raport-strategic`, lastModified: sitemapDate(SITEMAP_LASTMOD.raportStrategic), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/termeni`, lastModified: sitemapDate(SITEMAP_LASTMOD.termeni), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/confidentialitate`, lastModified: sitemapDate(SITEMAP_LASTMOD.confidentialitate), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/cookies`, lastModified: sitemapDate(SITEMAP_LASTMOD.cookies), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/taxe`, lastModified: sitemapDate(SITEMAP_LASTMOD.taxe), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/cauta`, lastModified: sitemapDate(SITEMAP_LASTMOD.cauta), changeFrequency: 'weekly', priority: 0.4 },
    { url: `${SITE_URL}/glosar`, lastModified: sitemapDate(SITEMAP_LASTMOD.glosar), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/incepe-aici`, lastModified: sitemapDate(SITEMAP_LASTMOD.incepeAici), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/hub/mica`, lastModified: sitemapDate(SITEMAP_LASTMOD.hubTopic), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${SITE_URL}/hub/bitcoin`, lastModified: sitemapDate(SITEMAP_LASTMOD.hubTopic), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${SITE_URL}/hub/securitate`, lastModified: sitemapDate(SITEMAP_LASTMOD.hubTopic), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/hub/stiri-crypto-romania`, lastModified: sitemapDate(SITEMAP_LASTMOD.hubStiriRomania), changeFrequency: 'weekly', priority: 0.8 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = published.flatMap((article) => {
    const lastModified = articleLastModified(article);
    if (!lastModified) return [];
    return [
      {
        url: `${SITE_URL}/stiri/${article.slug}`,
        lastModified,
        changeFrequency: 'daily' as const,
        priority: 0.8,
      },
    ];
  });

  const marketPulseRoutes: MetadataRoute.Sitemap = pulses.flatMap((pulse) => {
    const lastModified = articleLastModified(pulse);
    if (!lastModified) return [];
    return [
      {
        url: `${SITE_URL}/market-pulse/${pulse.slug}`,
        lastModified,
        changeFrequency: 'daily' as const,
        priority: 0.82,
      },
    ];
  });

  const interviewRoutes: MetadataRoute.Sitemap = interviews.flatMap((interview) => {
    const lastModified =
      contentLastModified(interview.created_at) ?? sitemapDate(SITEMAP_LASTMOD.interviuri);
    return [
      {
        url: `${SITE_URL}/interviuri/${interview.slug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      },
    ];
  });

  const academyRoutes: MetadataRoute.Sitemap = dictionary.map((guide) => ({
    url: `${SITE_URL}/academie/${guide.slug}`,
    lastModified: sitemapDate(SITEMAP_LASTMOD.dictionary),
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }));

  return [...staticRoutes, ...academyRoutes, ...articleRoutes, ...marketPulseRoutes, ...interviewRoutes];
}
