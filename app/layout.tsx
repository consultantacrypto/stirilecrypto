import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google"; 
import "./globals.css";
import Script from "next/script";
import { DANIEL_MIHAI } from "@/lib/authors";
import { SITE_URL } from "@/lib/json-ld";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { Analytics } from "@vercel/analytics/next";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Canonical is set per-route — do NOT default to homepage here
  title: {
    template: '%s | Știrile Crypto',
    default: 'Știrile Crypto',
  },
  description:
    'Știri crypto, analiză de piață și date on-chain, în limba română.',
  keywords: [
    'stiri crypto romania',
    'bitcoin romania',
    'analiza on-chain',
    'web3 romania',
    'piata crypto',
    'finante digitale',
    'ethereum stiri',
    'educatie financiara crypto',
  ],
  authors: [{ name: DANIEL_MIHAI.name, url: `${SITE_URL}${DANIEL_MIHAI.path}` }],
  creator: DANIEL_MIHAI.name,
  publisher: 'Știrile Crypto',
  verification: {
    google: 'vHIFda0TK5EKXwxKHpAN_eJr2vG6fbPR6uIGvFOZn6o',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Știrile Crypto',
    description:
      'Știri crypto, analiză de piață și date on-chain, în limba română.',
    images: [
      {
        url: '/api/og?title=%C8%98tirile%20Crypto&category=%C8%98tiri',
        width: 1200,
        height: 630,
        alt: 'Știrile Crypto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MIhaiDanielWeb3',
    creator: '@MIhaiDanielWeb3',
    description: 'Știri crypto, analiză de piață și date on-chain, în limba română.',
    images: ['/api/og?title=%C8%98tirile%20Crypto&category=%C8%98tiri'],
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
    <html lang="ro" className="scroll-smooth">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-black text-white`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-94JGNJHNBZ"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            (function () {
              var host = window.location.hostname;
              if (host === 'localhost' || host === '127.0.0.1') return;
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', 'G-94JGNJHNBZ');
            })();
          `}
        </Script>
        <AnalyticsTracker />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
