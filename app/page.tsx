import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import PublicationHome from '@/components/home/PublicationHome';
import HomeJsonLd from '@/components/HomeJsonLd';
import EmailCaptureBox from '@/components/EmailCaptureBox';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

export const revalidate = 60;

const HOME_TITLE = 'Știri crypto, piețe și analiză | Știrile Crypto';
const HOME_DESCRIPTION =
  'Publicație crypto în limba română: știrea principală, ultimele noutăți, secțiuni și date de piață.';

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  ...buildWebsiteShareMetadata({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    canonical: SITE_URL,
  }),
};

export default function Home() {
  return (
    <>
      <HomeJsonLd />
      <main className="min-h-screen flex flex-col bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
        <ScrollProgress />
        <Navbar />
        <PublicationHome />

        <div className="container mx-auto px-4 sm:px-6 max-w-6xl w-full my-16">
          <EmailCaptureBox id="newsletter" location="homepage" />
        </div>

        <Footer />
      </main>
    </>
  );
}
