import { withRssAlternate } from '@/lib/rss-alternate';
import type { Metadata } from 'next';
import AuthorProfile from '@/components/author/AuthorProfile';
import { EDUARD_MIHAI } from '@/lib/authors';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const TITLE = 'Eduard Mihai';
const DESCRIPTION = 'Eduard Mihai acoperă hack-urile și incidentele de securitate pe Știrile Crypto.';

export const revalidate = 60;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: withRssAlternate({ canonical: `${SITE_URL}${EDUARD_MIHAI.path}` }),
  ...buildWebsiteShareMetadata({
    title: TITLE,
    description: DESCRIPTION,
    canonical: `${SITE_URL}${EDUARD_MIHAI.path}`,
  }),
};

export default function EduardMihaiPage() {
  return <AuthorProfile authorKey="eduard-mihai" />;
}
