import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '@/lib/json-ld';

export default function StructuredData() {
  const organizationSchema = buildOrganizationJsonLd();
  const websiteSchema = buildWebSiteJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
