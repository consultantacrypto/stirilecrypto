import { withRssAlternate } from '@/lib/rss-alternate';
import type { Metadata } from 'next';
import AuthorProfile from '@/components/author/AuthorProfile';
import { DANIEL_MIHAI, DANIEL_MIHAI_PAGE_DESCRIPTION, DANIEL_MIHAI_PAGE_TITLE } from '@/lib/authors';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const TITLE = DANIEL_MIHAI_PAGE_TITLE;
const DESCRIPTION = DANIEL_MIHAI_PAGE_DESCRIPTION;

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: withRssAlternate({ canonical: `${SITE_URL}${DANIEL_MIHAI.path}` }),
  ...buildWebsiteShareMetadata({
    title: TITLE,
    description: DESCRIPTION,
    canonical: `${SITE_URL}${DANIEL_MIHAI.path}`,
  }),
};

export default function DanielMihaiPage() {
  return <AuthorProfile authorKey="daniel-mihai" />;
}
