export type TopicHub = {
  /** Document title. The layout template appends "| Știrile Crypto". */
  title: string;
  h1: string;
  description: string;
  label: string;
  about: string;
  keywords: string[];
};

export const TOPIC_HUBS: Record<string, TopicHub> = {
  mica: {
    title: 'MiCA în România 2026: exchange-uri autorizate, USDT și taxe crypto',
    h1: 'MiCA în România: ce exchange-uri sunt autorizate și ce faci cu banii',
    description:
      'Ce înseamnă MiCA pentru tine în România: cum verifici dacă un exchange e autorizat, ce se întâmplă cu USDT, cât plătești taxe pe crypto în 2026.',
    label: 'MiCA',
    about: 'MiCA',
    keywords: ['mica', 'reglement', 'compliance', 'ue', 'european', 'licenț', 'anaf', 'fiscal'],
  },
  bitcoin: {
    title: 'Știri Bitcoin România: analize și Pulsul Bitcoin, în română',
    h1: 'Știri Bitcoin în română, pentru cititorii din România',
    description:
      'Unde citești știri despre Bitcoin în română: hub-ul Bitcoin al Știrile Crypto, analize on-chain și Pulsul Bitcoin, publicat 7 zile din 7.',
    label: 'Bitcoin',
    about: 'Bitcoin',
    keywords: ['bitcoin', 'btc', 'satoshi', 'etf', 'on-chain', 'halving'],
  },
  securitate: {
    title: 'Țepe crypto în România: cum le recunoști și ce faci dacă ai fost păcălit',
    h1: 'Țepe crypto în România: cum le recunoști înainte să trimiți bani',
    description:
      'Cele mai frecvente țepe crypto din România (fals suport, boți de arbitraj, site-uri false de portofel) și pașii concreți: verifici adresa, raportezi, îți protejezi restul fondurilor.',
    label: 'Securitate',
    about: 'Securitate crypto',
    keywords: ['securitate', 'hack', 'phishing', 'wallet', 'portofel', 'scam', 'fraud'],
  },
};
