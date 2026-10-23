import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['rss-parser'],
  // @ts-ignore - Ignorăm eroarea de tip, proprietatea e validă pentru Next.js 16+
  turbopack: {},



  // 1. Optimizare Pachete (Tree-Shaking)
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // 2. Imagini — unoptimized: true (no /_next/image proxy; avoids Vercel Image Optimization 402)
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ndnlhmzrflmtqchdrlbh.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // 3. FIX CAPITAL PENTRU EROAREA METAMASK
  webpack: (config: any) => {
    config.externals.push(
      "pino-pretty",
      "lokijs",
      "encoding",
      "tap",
      "desm",
      "fastbench",
      "why-is-node-running"
    );

    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };

    return config;
  },

  // ✅ 4. FIX NOU: Redirect-uri pentru a salva traficul vechi (Erorile 404)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'stirilecrypto.ro' }],
        destination: 'https://www.stirilecrypto.ro/:path*',
        permanent: true, // 308 permanent (SEO-equivalent to 301)
      },
      {
        source: '/stiri/sezonul-celor-20-investitori-titani',
        destination: '/stiri/nu-asteptati-altcoin-season-vine-sezonul-celor-20',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/admin/login',
        permanent: true,
      },
      {
        source: '/en',
        destination: '/',
        permanent: true,
      },
      {
        source: '/pages/cursuri',
        destination: '/academie',
        permanent: true,
      },
      {
        source: '/curs',
        destination: '/academie',
        permanent: true,
      },
      {
        source: '/blogs/crypto-news',
        destination: '/stiri',
        permanent: true,
      },
      {
        source: '/products/consultanta-crypto',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/products/consultanta',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/cookie',
        destination: '/cookies',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;