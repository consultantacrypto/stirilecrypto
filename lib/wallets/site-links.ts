import { buildWalletOutboundUrl, type WalletProduct } from './quickexit-catalog.sync';

/**
 * QuickExit stamps its own analytics tag when the partner URL has no utm_source.
 * Știrile Crypto keeps every other character and swaps only that tag.
 * A partner-supplied utm_source, such as Refersion's `refersion` on Keystone, stays.
 */
const QUICKEXIT_SITE_UTM = 'quickexit';
export const STIRILECRYPTO_SITE_UTM = 'stirilecrypto';

type OutboundProduct = Pick<WalletProduct, 'affiliateUrl' | 'officialUrl' | 'brandSlug' | 'slug'>;

export function stirilecryptoWalletUrl(product: OutboundProduct): string {
  const quickexitUrl = buildWalletOutboundUrl(product);
  const url = new URL(quickexitUrl);
  if (url.searchParams.get('utm_source') === QUICKEXIT_SITE_UTM) {
    url.searchParams.set('utm_source', STIRILECRYPTO_SITE_UTM);
  }
  return url.toString();
}
