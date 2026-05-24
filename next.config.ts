import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['rss-parser'],
  // @ts-ignore - Ignorăm eroarea de tip, proprietatea e validă pentru Next.js 16+
  turbopack: {},



  // 1. Optimizare Pachete (Tree-Shaking)
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // 2. Optimizare Imagini — AVIF/WebP on-the-fly, cache optimized derivatives
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
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
    ];
  },
};

export default nextConfig;