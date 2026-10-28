import type { Metadata } from 'next';
import AuthorProfile from '@/components/author/AuthorProfile';
import { DANIEL_MIHAI } from '@/lib/authors';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const TITLE = 'Daniel Mihai, redactor';
const DESCRIPTION =
  'Pagina de autor a lui Daniel Mihai, redactor la Știrile Crypto. Știri și analize de piață educative, fără recomandări de cumpărare sau vânzare.';

export const revalidate = 60;

export const metadata: Metadata = {
  title: TITLE,
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
