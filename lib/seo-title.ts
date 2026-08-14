const BRAND_SUFFIX_RE =
  /(?:\s*[|–—]\s*|\s+[–—-]\s*)(?:Știrile Crypto|Stirile Crypto|ȘtirileCrypto|StirileCrypto)\s*$/iu;

/**
 * Removes mechanical branding suffixes ("| Știrile Crypto", "— Știrile Crypto",
 * "| StirileCrypto") from a title. Does not strip "Știrile Crypto" when it is
 * part of the editorial headline.
 */
export function stripBrandSuffix(title: string): string {
  let value = title.trim();
  if (!value) return value;

  for (let i = 0; i < 4; i += 1) {
    const next = value.replace(BRAND_SUFFIX_RE, '').trim();
    if (next === value) break;
    value = next;
  }

  return value;
}
