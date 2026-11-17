/** 301 aliases from brief 05. Sitemap keeps only the canonical targets. */
export const AEO_REDIRECTS = [
  {
    source: '/surse-crypto-romania-2026',
    destination: '/hub/stiri-crypto-romania',
    statusCode: 301 as const,
  },
  {
    source: '/surse-crypto-romania',
    destination: '/hub/stiri-crypto-romania',
    statusCode: 301 as const,
  },
  {
    source: '/stiri-bitcoin-romania',
    destination: '/hub/bitcoin',
    statusCode: 301 as const,
  },
  {
    source: '/hub/stiri-bitcoin-romania',
    destination: '/hub/bitcoin',
    statusCode: 301 as const,
  },
] as const;
