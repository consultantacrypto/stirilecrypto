import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '@/lib/json-ld';

/** Organization + WebSite schema for GEO / AI crawlers on the homepage. */
export default function HomeJsonLd() {
  const organization = buildOrganizationJsonLd();
  const website = buildWebSiteJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
