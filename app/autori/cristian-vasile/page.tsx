import type { Metadata } from 'next';
import AuthorProfile from '@/components/author/AuthorProfile';
import { CRISTIAN_VASILE } from '@/lib/authors';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const TITLE = 'Cristian Vasile';
const DESCRIPTION = 'Cristian Vasile scrie pentru Știrile Crypto.';

export const revalidate = 60;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${CRISTIAN_VASILE.path}` },
  ...buildWebsiteShareMetadata({
    title: TITLE,
    description: DESCRIPTION,
    canonical: `${SITE_URL}${CRISTIAN_VASILE.path}`,
  }),
};

export default function CristianVasilePage() {
  return <AuthorProfile authorKey="cristian-vasile" />;
}
