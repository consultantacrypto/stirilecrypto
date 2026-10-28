import type { Metadata } from 'next';
import AuthorProfile from '@/components/author/AuthorProfile';
import { EMILIAN_CONSTANTIN } from '@/lib/authors';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const TITLE = 'Emilian Constantin';
const DESCRIPTION = 'Emilian Constantin scrie pentru Știrile Crypto.';

export const revalidate = 60;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${EMILIAN_CONSTANTIN.path}` },
  ...buildWebsiteShareMetadata({
    title: TITLE,
    description: DESCRIPTION,
    canonical: `${SITE_URL}${EMILIAN_CONSTANTIN.path}`,
  }),
};

export default function EmilianConstantinPage() {
  return <AuthorProfile authorKey="emilian-constantin" />;
}
