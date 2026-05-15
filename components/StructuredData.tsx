export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mihai Daniel",
    "url": "https://www.mihaidaniel.ro",
    "logo": "https://www.mihaidaniel.ro/icon.svg",
    "description": "Expert crypto, investor Web3 și mentor pentru trading și investiții blockchain",
    "sameAs": [
      "https://www.youtube.com/@DanielMihaiCrypto",
      "https://x.com/MIhaiDanielWeb3",
      "https://www.tiktok.com/@mihaidanielmarius",
      "https://www.linkedin.com/in/mihaidanielmarius/"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "consultantacrypto.ro@gmail.com",
      "contactType": "Customer Service",
      "areaServed": "RO",
      "availableLanguage": ["Romanian", "English"]
    }
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mihai Daniel",
    "alternateName": "Mihai Daniel Marius",
    "url": "https://www.mihaidaniel.ro",
    "image": "https://www.mihaidaniel.ro/mihai-daniel-consultanta.jpg",
    "jobTitle": "Web3 Investor & Crypto Mentor",
    "worksFor": {
      "@type": "Organization",
      "name": "Mihai Daniel"
    },
    "sameAs": [
      "https://www.youtube.com/@DanielMihaiCrypto",
      "https://x.com/MIhaiDanielWeb3"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  );
}