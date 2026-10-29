/** Pathname match for nav pills. Query strings are ignored. */

export function pathOf(href: string): string {
  return href.split('?')[0];
}

/**
 * Active on the exact path and its children (`/market` and `/market/peak-signals`).
 * A sibling such as `/market-pulse` does not match `/market`.
 * Piața azi is only `/market`. Harta pieței (`/lichidari`) and Tablou (`/dashboard`)
 * stay their own items.
 */
export function isPathActive(pathname: string, href: string): boolean {
  const path = pathOf(href);
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
}
