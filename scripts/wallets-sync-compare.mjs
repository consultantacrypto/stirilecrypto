/**
 * Catalog URLs must match QuickExit character for character.
 * The only allowed difference is the utm_source value.
 */

export function urlsMatchExceptUtmSource(left, right) {
  let a;
  let b;
  try {
    a = new URL(left);
    b = new URL(right);
  } catch {
    return false;
  }
  if (a.origin !== b.origin || a.pathname !== b.pathname || a.hash !== b.hash) return false;
  const leftKeys = [...a.searchParams.keys()];
  const rightKeys = [...b.searchParams.keys()];
  if (leftKeys.length !== rightKeys.length) return false;
  for (let index = 0; index < leftKeys.length; index += 1) {
    if (leftKeys[index] !== rightKeys[index]) return false;
    const key = leftKeys[index];
    if (key === 'utm_source') continue;
    if (a.searchParams.getAll(key).join('\0') !== b.searchParams.getAll(key).join('\0')) return false;
  }
  return true;
}

/** The synced source may rename the site tag. Partner refs and every other character stay. */
export function normalizeSiteUtmSource(source) {
  return source
    .replaceAll('utm_source", "quickexit"', 'utm_source", "SITE"')
    .replaceAll("utm_source', 'quickexit'", "utm_source', 'SITE'")
    .replaceAll('utm_source", "stirilecrypto"', 'utm_source", "SITE"')
    .replaceAll("utm_source', 'stirilecrypto'", "utm_source', 'SITE'");
}

export function sourcesMatchExceptSiteUtm(localSource, remoteSource) {
  return normalizeSiteUtmSource(localSource) === normalizeSiteUtmSource(remoteSource);
}

/** Swap the QuickExit site tag only. A partner utm_source such as refersion stays. */
export function applyStirilecryptoUtmSource(quickexitUrl) {
  const url = new URL(quickexitUrl);
  if (url.searchParams.get('utm_source') === 'quickexit') {
    url.searchParams.set('utm_source', 'stirilecrypto');
  }
  return url.toString();
}
