/** Pathname match for nav pills. Query strings are ignored. */

export type SiteNavItem = { href: string; label: string };

/** Visible header pills. Portofele crypto sits where Airdrop Alert used to. */
export const HEADER_LINKS: SiteNavItem[] = [
  { href: '/portofele', label: 'Portofele crypto' },
  { href: '/market', label: 'Piața azi' },
  { href: '/market-pulse', label: 'Pulsul Bitcoin' },
  { href: '/taxe', label: 'Taxe crypto 2026' },
];

/** Desktop „Mai mult” and the same entries in the mobile menu. */
export const MORE_NAV_LINKS: SiteNavItem[] = [
  { href: '/stiri', label: 'Știri' },
  { href: '/hub/bitcoin', label: 'Știri Bitcoin' },
  { href: '/raport-strategic', label: 'Ce cumpără balenele' },
  { href: '/incepe-aici', label: 'Începe aici' },
  { href: '/interviuri', label: 'Interviuri' },
  { href: '/lichidari', label: 'Harta pieței' },
  { href: '/glosar', label: 'Glosar' },
  { href: '/academie', label: 'Educație' },
  { href: '/airdrop-alert', label: 'Airdrop Alert' },
  { href: '/verificare-portofel?src=nav', label: 'Verificare portofel' },
];

export function pathOf(href: string): string {
  return href.split('?')[0];
}

/**
 * Active on the exact path and its children (`/market` and `/market/peak-signals`).
 * A sibling such as `/market-pulse` does not match `/market`.
 * Piața azi is only `/market`. Harta pieței (`/lichidari`) and Tablou (`/dashboard`)
 * stay their own items.
 */
/** Menu label for /hub/bitcoin. The news index uses the longer anchor. */
export function bitcoinNavLabel(pathname: string): string {
  return pathname === '/stiri' ? 'Știri Bitcoin azi' : 'Știri Bitcoin';
}

export function isPathActive(pathname: string, href: string): boolean {
  const path = pathOf(href);
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
}
