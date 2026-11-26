import { stripBrandSuffix } from '@/lib/seo-title';

export type ArticleSeoOverride = {
  /** Document title, including the „| Știrile Crypto” suffix. */
  title: string;
  h1: string;
  description: string;
};

/**
 * On-page title, H1, and meta for five articles. The stored headline stays in
 * the database and in JSON-LD. These values only replace the HTML title, the
 * visible H1, the meta description, and the Open Graph / Twitter fields derived
 * from those.
 */
export const ARTICLE_SEO_OVERRIDES: Record<string, ArticleSeoOverride> = {
  'carduri-crypto-raportare-anaf-taxe-mica-dac8': {
    title: 'Carduri crypto și raportarea ANAF (DAC8) | Știrile Crypto',
    h1: 'Ce carduri crypto sunt raportate la ANAF, după MiCA și DAC8',
    description:
      'Ce înseamnă MiCA și DAC8 pentru cardurile crypto în România: ce se raportează la ANAF, ce rămâne în afara UE și ce verifici înainte să folosești un card.',
  },
  'romania-in-operatiunea-globala-care-a-gasit-39-de-miliarde-de-dolari-in-bani-si-crypto-din-tepe':
    {
      title: 'Țepe crypto de 39 mld $, inclusiv România | Știrile Crypto',
      h1: 'România, în operațiunea globală care a găsit 39 de miliarde de dolari din țepe cu crypto',
      description:
        'Operațiunea Confrontation Ghost, cu România printre 30 de țări, a găsit 39 mld $ din fraude cu bani și crypto. Ce spune CZ despre țepele făcute cu AI.',
    },
  'fara-kyc-nu-inseamna-anonim-card-crypto-portofel-ip-plati-romania': {
    title: 'Card crypto fără KYC: nu înseamnă anonim | Știrile Crypto',
    h1: '„Fără KYC” la un card crypto nu înseamnă anonim',
    description:
      'Un card crypto fără KYC îți poate loga portofelul, IP-ul și plățile. Ce spune legea UE despre prepaid și ce declari la ANAF, în România, din 2026.',
  },
  'pi-network-paypal-pay-with-crypto-integrare-oficiala': {
    title: 'Pi Network în PayPal Pay with Crypto | Știrile Crypto',
    h1: 'PayPal confirmă Pi Network în funcția Pay with Crypto',
    description:
      'Documentația pentru dezvoltatori a PayPal include Pi Network (PI) la Pay with Crypto. Cum funcționează integrarea și ce înseamnă pentru utilizatori.',
  },
  'trezor-confirma-3-safe-5-implant-cryptobilis-taie-80-la-suta-revanzatori': {
    title: 'Trezor confirmă 3 Safe 5 cu implant | Știrile Crypto',
    h1: 'Trezor confirmă implanturi pe 3 Safe 5 și reduce 80% din revânzători',
    description:
      'Trezor a confirmat implanturi în 3 Safe 5 de la CryptoBilis, a lansat firmware 2.13.1 și a redus revânzătorii. Ce verifici la un portofel fizic.',
  },
};

export function articleSeoOverride(slug: string): ArticleSeoOverride | null {
  return ARTICLE_SEO_OVERRIDES[slug] ?? null;
}

/** Title passed to the root template, which appends „| Știrile Crypto”. */
export function articleSeoTitle(override: ArticleSeoOverride): string {
  return stripBrandSuffix(override.title);
}
