import type { ArticlePageData } from '@/lib/articles-db';

export const SITE_URL = 'https://www.stirilecrypto.ro';
export const SITE_NAME = 'Știrile Crypto';
export const PUBLISHER_LOGO_URL = `${SITE_URL}/icon.svg`;
export const SITE_SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
export const SITE_FEED_URL = `${SITE_URL}/feed.xml`;

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
  options?: { path?: string; articleSection?: string },
) {
  const pageUrl = `${SITE_URL}${options?.path ?? `/stiri/${slug}`}`;
  const imageUrl = toAbsoluteUrl(article.image_url);
  const datePublished =
    toIsoDateTime(article.published_at) ?? toIsoDateTime(article.dateLabel);
  const dateModified =
    toIsoDateTime(article.updated_at) ?? datePublished;

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    headline: article.title,
    description: article.excerpt,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished,
    dateModified,
    author: [
      {
        '@type': 'Person',
        name: 'Stirile Crypto',
        url: SITE_URL,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: PUBLISHER_LOGO_URL,
      },
    },
    articleSection: options?.articleSection ?? article.category,
    inLanguage: 'ro-RO',
    isAccessibleForFree: true,
  };
}

/** Market Pulse daily technical analysis — Article schema tuned for financial editorial. */
export function buildFinancialArticleJsonLd(
  article: ArticlePageData,
  slug: string,
  options?: { path?: string },
) {
  const pageUrl = `${SITE_URL}${options?.path ?? `/market-pulse/${slug}`}`;
  const imageUrl = toAbsoluteUrl(article.image_url);
  const datePublished =
    toIsoDateTime(article.published_at) ?? toIsoDateTime(article.dateLabel);
  const dateModified =
    toIsoDateTime(article.updated_at) ?? datePublished;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': pageUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    headline: article.title,
    name: article.title,
    description: article.excerpt,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished,
    dateModified,
    author: [
      {
        '@type': 'Person',
        name: 'Stirile Crypto',
        url: SITE_URL,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: PUBLISHER_LOGO_URL,
      },
    },
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
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: 'Stirile Crypto',
    url: SITE_URL,
    logo: PUBLISHER_LOGO_URL,
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
      'https://www.youtube.com/@DanielMihaiCrypto',
      'https://x.com/MIhaiDanielWeb3',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial',
      email: 'consultantacrypto.ro@gmail.com',
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

export function buildInterviewArticleJsonLd(interview: InterviewJsonLdInput) {
  const pageUrl = `${SITE_URL}/interviuri/${interview.slug}`;
  const imageUrl = toAbsoluteUrl(interview.cover_image);
  const datePublished = toIsoDateTime(interview.created_at);

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    headline: interview.title,
    description: interview.excerpt,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished,
    dateModified: datePublished,
    author: [
      {
        '@type': 'Person',
        name: interview.guest_name,
      },
      {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: PUBLISHER_LOGO_URL,
      },
    },
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
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: PUBLISHER_LOGO_URL,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/stiri?category={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
