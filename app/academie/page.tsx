import type { Metadata } from 'next';
import AcademyPageClient from '@/components/AcademyPageClient';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const ACADEMY_TITLE = 'Academia Crypto';
const ACADEMY_DESCRIPTION =
  'Ghiduri crypto de la zero la expert: Bitcoin, Ethereum, portofele, tokenomics, RSI, cicluri de piață și legislație.';

export const metadata: Metadata = {
  title: ACADEMY_TITLE,
  description: ACADEMY_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/academie`,
  },
  ...buildWebsiteShareMetadata({
    title: ACADEMY_TITLE,
    description: ACADEMY_DESCRIPTION,
    canonical: `${SITE_URL}/academie`,
  }),
};

export default function AcademyPage() {
  return <AcademyPageClient />;
}
