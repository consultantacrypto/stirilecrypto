export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "Știrile Crypto",
    "url": "https://www.stirilecrypto.ro",
    "logo": "https://www.stirilecrypto.ro/icon.svg",
    "description": "Portal media dedicat știrilor crypto, analizei on-chain și piețelor financiare digitale",
    "sameAs": [
      "https://www.youtube.com/@DanielMihaiCrypto",
      "https://x.com/MIhaiDanielWeb3"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "consultantacrypto.ro@gmail.com",
      "contactType": "Editorial",
      "areaServed": "RO",
      "availableLanguage": ["Romanian", "English"]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Știrile Crypto",
    "url": "https://www.stirilecrypto.ro",
    "description": "Știri crypto, analize de piață și date live pentru investitori",
    "publisher": {
      "@type": "Organization",
      "name": "Știrile Crypto"
    }
  };

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
