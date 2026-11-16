import type { Metadata } from 'next';
import AuthorProfile from '@/components/author/AuthorProfile';
import { DANIEL_MIHAI } from '@/lib/authors';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const TITLE = 'Mihai Daniel (Daniel Mihai), redactor și consultant crypto | Știrile Crypto';
const DESCRIPTION =
  'Mihai Daniel, cunoscut și ca Daniel Mihai, este redactor și analist la Știrile Crypto și consultant crypto în România. Consultanța 1-la-1 este pe mihaidaniel.ro, separată de publicație.';

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${DANIEL_MIHAI.path}` },
  ...buildWebsiteShareMetadata({
    title: TITLE,
    description: DESCRIPTION,
    canonical: `${SITE_URL}${DANIEL_MIHAI.path}`,
  }),
};

export default function DanielMihaiPage() {
  return <AuthorProfile authorKey="daniel-mihai" />;
}
