export const DEFAULT_BYBIT_AFFILIATE_URL = 'https://partner.bybit.eu/b/STIRICRYPTO';
export const DEFAULT_BINANCE_AFFILIATE_URL = 'https://www.binance.com/join?ref=35329648';

/** Marks which placement sent the click. The partner code in the path stays intact. */
export function withAffiliateTags(url: string, placement: string): string {
  try {
    const parsed = new URL(url);
    const slot = placement.trim().slice(0, 40) || 'site';
    parsed.searchParams.set('utm_source', 'stirilecrypto');
    parsed.searchParams.set('utm_medium', 'affiliate');
    parsed.searchParams.set('utm_campaign', slot);
    parsed.searchParams.set('src', slot);
    return parsed.toString();
  } catch {
    return url;
  }
}
