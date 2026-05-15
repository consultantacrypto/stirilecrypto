import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google"; 
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";
// ✅ IMPORT Componenta Structurată
import StructuredData from "@/components/StructuredData";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space',
  display: 'swap', 
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap', 
});

// ✅ METADATA OPTIMIZATĂ (Tier 1 SEO)
export const metadata: Metadata = {
  metadataBase: new URL('https://www.mihaidaniel.ro'),
  title: {
    default: "Mihai Daniel | Web3 Investor & Crypto Mentor",
    template: "%s | Mihai Daniel"
  },
  description: "Învață trading și investiții crypto de la Mihai Daniel. Cursuri premium, consultanță 1-la-1 și analiză de piață cu AI. 280K+ followers pe social media.",
  keywords: [
    "crypto romania", 
    "trading crypto", 
    "curs bitcoin", 
    "mihai daniel crypto",
    "investitii blockchain",
    "consultanta crypto",
    "analiza tehnica",
    "educatie financiara"
  ],
  
  authors: [{ name: "Mihai Daniel", url: "https://www.mihaidaniel.ro" }],
  creator: "Mihai Daniel",
  publisher: "Mihai Daniel",
  
  verification: {
    google: 'vHIFda0TK5EKXwxKHpAN_eJr2vG6fbPR6uIGvFOZn6o',
  },

  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },

  // ✅ OPEN GRAPH (Facebook/LinkedIn)
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: 'https://www.mihaidaniel.ro',
    siteName: 'Mihai Daniel - Crypto Expert',
    title: 'Mihai Daniel | Web3 Investor & Crypto Mentor',
    description: 'Scapă de mentalitatea de parior. Învață trading instituțional și strategii crypto validate.',
    images: [
      {
        url: '/mihai-daniel-consultanta.jpg', // Folosim imaginea existentă
        width: 1200,
        height: 630,
        alt: 'Mihai Daniel - Crypto Expert',
      },
    ],
  },

  // ✅ TWITTER CARD (Critic pentru share-uri pe X)
  twitter: {
    card: 'summary_large_image',
    site: '@MIhaiDanielWeb3',
    creator: '@MIhaiDanielWeb3',
    title: 'Mihai Daniel | Web3 Investor & Crypto Mentor',
    description: 'Învață trading și investiții crypto. 280K+ followers pe social media.',
    images: ['/mihai-daniel-consultanta.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased`}>
        
        {/* ✅ Date Structurate pentru Google */}
        <StructuredData />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZYYJ251HYH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZYYJ251HYH');
          `}
        </Script>

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}