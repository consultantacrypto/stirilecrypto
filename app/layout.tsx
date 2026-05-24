import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google"; 
import "./globals.css";
import Script from "next/script";

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
  metadataBase: new URL('https://www.stirilecrypto.ro'),
  title: {
    template: '%s | Știrile Crypto',
    default: 'Știrile Crypto | Informație Financiară & Date On-Chain',
  },
  description:
    'Platformă premium de informații crypto, date on-chain instituționale și mentorat privat 1-la-1 pentru investiții inteligente.',
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
  authors: [{ name: 'Știrile Crypto', url: 'https://www.stirilecrypto.ro' }],
  creator: 'Știrile Crypto',
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
    url: 'https://www.stirilecrypto.ro',
    siteName: 'Știrile Crypto',
    title: 'Știrile Crypto | Informație Financiară & Date On-Chain',
    description:
      'Platformă premium de informații crypto, date on-chain instituționale și mentorat privat 1-la-1 pentru investiții inteligente.',
    images: [
      {
        url: '/mihai-daniel-consultanta.jpg',
        width: 1200,
        height: 630,
        alt: 'Știrile Crypto — Informație Financiară & Date On-Chain',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MIhaiDanielWeb3',
    creator: '@MIhaiDanielWeb3',
    title: 'Știrile Crypto | Informație Financiară & Date On-Chain',
    description:
      'Platformă premium de informații crypto, date on-chain instituționale și mentorat privat 1-la-1 pentru investiții inteligente.',
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
    <html lang="ro" className="scroll-smooth">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-black text-white`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-94JGNJHNBZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-94JGNJHNBZ');
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}
