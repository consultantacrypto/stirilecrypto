export type InterviewBadge = 'EXCLUSIV' | 'KOL';

export interface MockInterview {
  youtubeId: string;
  title: string;
  description: string;
  badge: InterviewBadge;
  href: string;
}

export const MOCK_INTERVIEWS: readonly MockInterview[] = [
  {
    youtubeId: 'e6fT2y3DkqI',
    title: 'Ben Zhou, fondator Bybit: piața bear s-a încheiat',
    description:
      'Perspective directe de la conducerea unuia dintre cele mai mari exchange-uri din lume.',
    badge: 'EXCLUSIV',
    href: 'https://www.youtube.com/watch?v=e6fT2y3DkqI',
  },
  {
    youtubeId: '59HJsgv8lbI',
    title: 'Rohit Wad, CTO Binance: tehnologie și reglementare',
    description:
      'Analiză despre infrastructura Binance și direcția industriei crypto în 2026.',
    badge: 'KOL',
    href: 'https://www.youtube.com/watch?v=59HJsgv8lbI',
  },
  {
    youtubeId: 'IMNUP11X93w',
    title: 'Kyrylo Khomiakov, Binance CEE: piața din Europa de Est',
    description:
      'Interviu exclusiv despre adopție, reglementare și oportunități pentru investitori.',
    badge: 'EXCLUSIV',
    href: 'https://www.youtube.com/watch?v=IMNUP11X93w',
  },
  {
    youtubeId: 'cQx2EFPN2ZI',
    title: 'Mike Silagadze, CEO Ether.fi: revoluția restaking',
    description:
      'Cum se reconstruiește randamentul on-chain și ce înseamnă pentru utilizatorii DeFi.',
    badge: 'EXCLUSIV',
    href: 'https://www.youtube.com/watch?v=cQx2EFPN2ZI',
  },
  {
    youtubeId: 'BJ-qiaGsIaY',
    title: 'Dmitry Buterin: rădăcinile Ethereum',
    description:
      'Conversație despre viziunea familiei Buterin și evoluția ecosistemului Ethereum.',
    badge: 'KOL',
    href: 'https://www.youtube.com/watch?v=BJ-qiaGsIaY',
  },
  {
    youtubeId: 'CdBYX3NPfbA',
    title: 'MMCrypto: scenariul unui Bitcoin la 5.000.000$',
    description:
      'Teză macro, cicluri de piață și cum își construiește un KOL strategia pe termen lung.',
    badge: 'KOL',
    href: 'https://www.youtube.com/watch?v=CdBYX3NPfbA',
  },
  {
    youtubeId: 'SVcy0DJEuoQ',
    title: 'Pierre Person, CEO Usual: listarea pe Binance',
    description:
      'Din culisele lansării unui proiect DeFi și ce caută exchange-urile tier-1 la listare.',
    badge: 'EXCLUSIV',
    href: 'https://www.youtube.com/watch?v=SVcy0DJEuoQ',
  },
  {
    youtubeId: 'zcZ-SKhJhqM',
    title: 'Davinci Jeremie: lecții de la un Bitcoin OG',
    description:
      'Experiență acumulată peste cicluri multiple și cum filtrezi zgomotul din piață.',
    badge: 'KOL',
    href: 'https://www.youtube.com/watch?v=zcZ-SKhJhqM',
  },
] as const;

/** Homepage teaser — first N interviews */
export const HOME_INTERVIEWS_PREVIEW_COUNT = 3;

export const BADGE_STYLES: Record<InterviewBadge, string> = {
  EXCLUSIV:
    'border-amber-500/40 bg-amber-500/10 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
  KOL: 'border-violet-500/40 bg-violet-500/10 text-violet-200 shadow-[0_0_12px_rgba(139,92,246,0.15)]',
};

export function youtubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}
