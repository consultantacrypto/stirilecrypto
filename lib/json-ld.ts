import type { ArticlePageData } from '@/lib/articles-db';
import { stripBrandSuffix } from '@/lib/seo-title';

export const SITE_URL = 'https://www.stirilecrypto.ro';
export const SITE_NAME = 'Știrile Crypto';
export const EDITORIAL_DESK_NAME = 'Redacția Știrile Crypto';
export const EDITORIAL_DESK_PATH = '/redactie';
export const EDITORIAL_DESK_URL = `${SITE_URL}${EDITORIAL_DESK_PATH}`;
export const EDITORIAL_POLICY_PATH = '/politica-editoriala';
export const CORRECTIONS_POLICY_PATH = '/corecturi';
export const ADVERTISING_POLICY_PATH = '/publicitate';
export const EDITORIAL_POLICY_LINKS = [
  { href: EDITORIAL_POLICY_PATH, label: 'Politică editorială' },
  { href: CORRECTIONS_POLICY_PATH, label: 'Corecturi' },
  { href: ADVERTISING_POLICY_PATH, label: 'Publicitate și afiliere' },
] as const;
/** Raster logo for JSON-LD. 1024×1024, above Google's 112×112 NewsMediaOrganization minimum. Favicon stays `/icon.svg`. */
export const PUBLISHER_LOGO_PATH = '/icon.jpg';
export const PUBLISHER_LOGO_WIDTH = 1024;
export const PUBLISHER_LOGO_HEIGHT = 1024;
export const PUBLISHER_LOGO_URL = `${SITE_URL}${PUBLISHER_LOGO_PATH}`;
export const SITE_SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
export const SITE_NEWS_SITEMAP_URL = `${SITE_URL}/news-sitemap.xml`;
export const SITE_FEED_URL = `${SITE_URL}/feed.xml`;
export const DEFAULT_SHARE_IMAGE = {
  url: `${SITE_URL}/api/og?title=${encodeURIComponent('Știrile Crypto')}&category=${encodeURIComponent('Știri')}`,
  width: 1200,
  height: 630,
  alt: 'Știrile Crypto',
};

export function buildWebsiteShareMetadata(options: {
  title: string;
  description: string;
  canonical: string;
}) {
  return {
    openGraph: {
      title: options.title,
      description: options.description,
      url: options.canonical,
      type: 'website' as const,
      locale: 'ro_RO',
      siteName: SITE_NAME,
      images: [DEFAULT_SHARE_IMAGE],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: options.title,
      description: options.description,
      images: [DEFAULT_SHARE_IMAGE.url],
    },
  };
}

export function publisherLogoJsonLd() {
  return {
    '@type': 'ImageObject' as const,
    url: PUBLISHER_LOGO_URL,
    width: PUBLISHER_LOGO_WIDTH,
    height: PUBLISHER_LOGO_HEIGHT,
  };
}

/** News brand publisher. Policies point at the public editorial pages. */
export function newsPublisherJsonLd() {
  return {
    '@type': 'NewsMediaOrganization' as const,
    name: SITE_NAME,
    url: SITE_URL,
    logo: publisherLogoJsonLd(),
    publishingPrinciples: `${SITE_URL}${EDITORIAL_POLICY_PATH}`,
    correctionsPolicy: `${SITE_URL}${CORRECTIONS_POLICY_PATH}`,
    ethicsPolicy: `${SITE_URL}${EDITORIAL_POLICY_PATH}`,
    actionableFeedbackPolicy: `${SITE_URL}${CORRECTIONS_POLICY_PATH}`,
    ownershipFundingInfo: [`${SITE_URL}/despre`, `${SITE_URL}${ADVERTISING_POLICY_PATH}`],
    masthead: EDITORIAL_DESK_URL,
  };
}

/** Resolve relative paths to absolute URLs for schema.org crawlers. */
export function toAbsoluteUrl(url: string | null | undefined): string | undefined {
  if (!url?.trim()) return undefined;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `${SITE_URL}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
}

/** Parse display dates (ro-RO labels or ISO) into ISO 8601 for JSON-LD. */
export function toIsoDateTime(value: string | null | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

export function buildNewsArticleJsonLd(
  article: ArticlePageData,
  slug: string,
  options?: {
    path?: string;
    articleSection?: string;
    author?: Record<string, unknown>;
  },
) {
  const pageUrl = `${SITE_URL}${options?.path ?? `/stiri/${slug}`}`;
  const imageUrl = toAbsoluteUrl(article.image_url);
  const datePublished =
    toIsoDateTime(article.published_at) ?? toIsoDateTime(article.dateLabel);
  const dateModified = datePublished;

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': pageUrl,
    url: pageUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    headline: stripBrandSuffix(article.title),
    description: article.excerpt,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished,
    dateModified,
    author: options?.author ?? {
      '@type': 'Organization',
      name: EDITORIAL_DESK_NAME,
      url: EDITORIAL_DESK_URL,
    },
    publisher: newsPublisherJsonLd(),
    articleSection: options?.articleSection ?? article.category,
    inLanguage: 'ro-RO',
    isAccessibleForFree: true,
  };
}

/** Market Pulse daily technical analysis — Article schema tuned for financial editorial. */
export function buildFinancialArticleJsonLd(
  article: ArticlePageData,
  slug: string,
  options?: { path?: string; author?: Record<string, unknown> },
) {
  const pageUrl = `${SITE_URL}${options?.path ?? `/market-pulse/${slug}`}`;
  const imageUrl = toAbsoluteUrl(article.image_url);
  const datePublished =
    toIsoDateTime(article.published_at) ?? toIsoDateTime(article.dateLabel);
  const dateModified = datePublished;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': pageUrl,
    url: pageUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    headline: stripBrandSuffix(article.title),
    name: stripBrandSuffix(article.title),
    description: article.excerpt,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished,
    dateModified,
    author: options?.author ?? {
      '@type': 'Organization',
      name: EDITORIAL_DESK_NAME,
      url: EDITORIAL_DESK_URL,
    },
    publisher: newsPublisherJsonLd(),
    articleSection: 'Market Pulse',
    genre: 'Financial Analysis',
    keywords: 'Market Pulse, analiză tehnică, crypto, piețe financiare',
    about: {
      '@type': 'Thing',
      name: 'Cryptocurrency financial markets',
    },
    inLanguage: 'ro-RO',
    isAccessibleForFree: true,
  };
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    ...newsPublisherJsonLd(),
    alternateName: 'Stirile Crypto',
    description:
      'Sursă de încredere pentru știri crypto, analiză on-chain și informații financiare digitale în limba română.',
    foundingLocation: {
      '@type': 'Country',
      name: 'Romania',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Romania',
    },
    knowsAbout: [
      'Cryptocurrency',
      'Bitcoin',
      'Ethereum',
      'On-chain analysis',
      'DeFi',
      'Financial markets',
    ],
    sameAs: [
      'https://x.com/StirilecryptoRo',
      'https://www.youtube.com/@DanielMihaiCrypto',
      'https://x.com/MIhaiDanielWeb3',
      'https://www.tiktok.com/@mihaidanielmarius',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial',
      email: 'contact@stirilecrypto.ro',
      availableLanguage: ['Romanian'],
    },
  };
}

export interface InterviewJsonLdInput {
  title: string;
  excerpt: string;
  guest_name: string;
  cover_image: string | null;
  created_at: string;
  slug: string;
}

export function buildInterviewArticleJsonLd(
  interview: InterviewJsonLdInput,
  options?: { author?: Record<string, unknown> },
) {
  const pageUrl = `${SITE_URL}/interviuri/${interview.slug}`;
  const imageUrl = toAbsoluteUrl(interview.cover_image);
  const datePublished = toIsoDateTime(interview.created_at);

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': pageUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    url: pageUrl,
    headline: stripBrandSuffix(interview.title),
    description: interview.excerpt,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished,
    dateModified: datePublished,
    author: options?.author ?? {
      '@type': 'Organization',
      name: EDITORIAL_DESK_NAME,
      url: EDITORIAL_DESK_URL,
    },
    about: interview.guest_name
      ? {
          '@type': 'Person',
          name: interview.guest_name,
        }
      : undefined,
    publisher: newsPublisherJsonLd(),
    articleSection: 'Interviuri',
    inLanguage: 'ro-RO',
    isAccessibleForFree: true,
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'Stirile Crypto',
    url: SITE_URL,
    description:
      'Platformă media românească de știri crypto, analize de piață și date on-chain pentru investitori informați.',
    inLanguage: 'ro-RO',
    publisher: newsPublisherJsonLd(),
  };
}

export type BreadcrumbItem = {
  name: string;
  path: string;
};

/** BreadcrumbList JSON-LD for article and listing pages. */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path.startsWith('http') ? item.path : `${SITE_URL}${item.path}`,
    })),
  };
}
