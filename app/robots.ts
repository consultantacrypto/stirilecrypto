import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // Opțional, dacă ai zone private
    },
    sitemap: 'https://www.stirilecrypto.ro/sitemap.xml',
  }
}