export type OutboundKind = 'consultancy' | 'affiliate';

const GA_PARAM_MAX = 100;

export function gaParam(value: string): string {
  const trimmed = value.trim();
  return trimmed.length <= GA_PARAM_MAX ? trimmed : trimmed.slice(0, GA_PARAM_MAX);
}

function hostname(url: URL): string {
  return url.hostname.toLowerCase().replace(/\.$/, '');
}

function isConsultancyHost(host: string): boolean {
  return host === 'mihaidaniel.ro' || host.endsWith('.mihaidaniel.ro');
}

function isAffiliateUrl(url: URL, rel: string | null | undefined): boolean {
  const tokens = (rel ?? '').split(/\s+/).filter(Boolean);
  if (tokens.includes('sponsored')) return true;
  if (url.searchParams.get('utm_medium') === 'affiliate') return true;
  const host = hostname(url).replace(/^www\./, '');
  if (host === 'partner.bybit.eu' || host === 'partner.bybit.com') return true;
  if ((host === 'binance.com' || host === 'okx.com') && url.pathname.includes('/join')) return true;
  if (host === 'url.hk') return true;
  return false;
}

export function classifyOutbound(href: string, rel?: string | null): OutboundKind | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  if (isConsultancyHost(hostname(url))) return 'consultancy';
  if (isAffiliateUrl(url, rel)) return 'affiliate';
  return null;
}

/** Explicit data-placement, then the affiliate campaign, then the page path. */
export function outboundPlacement(
  explicit: string | null | undefined,
  href: string,
  pathname: string,
): string {
  const fromAttribute = explicit?.trim();
  if (fromAttribute) return gaParam(fromAttribute);
  try {
    const url = new URL(href);
    const campaign = url.searchParams.get('utm_campaign') || url.searchParams.get('src');
    if (campaign?.trim()) return gaParam(campaign);
  } catch {
    // Placement still falls back to the page path.
  }
  return gaParam(pathname || '/');
}
