/**
 * Synced copy of the QuickExit hardware-wallet catalog.
 * Do not edit the source sections by hand.
 *
 * sourceRepo: consultantacrypto/quickexit-app
 * sourceCommit: 6834fc23e314fadfe9e42967b41ce45de35a8546
 * sourcePaths:
 *   - lib/walletCatalog.ts
 *   - lib/walletBrands.ts
 *
 * `npm run check:wallets-sync` reads those files from GitHub (raw, main)
 * and fails when this copy differs. quickexit-app is not modified here.
 */

export const QUICKEXIT_WALLETS_SYNC = {
  repo: "consultantacrypto/quickexit-app",
  commit: "6834fc23e314fadfe9e42967b41ce45de35a8546",
  sources: ["lib/walletCatalog.ts", "lib/walletBrands.ts"],
} as const;

// --- BEGIN lib/walletCatalog.ts ---
/**
 * Hardware-wallet recommendation catalog.
 *
 * The page reads this file. It does not query Supabase.
 * `published` stays false until a separate publication GO.
 * Preview still renders every row so the shelf can be reviewed without a database.
 *
 * Official URLs have no affiliate parameters. Partner links live in the affiliate
 * fields below. Tangem has no partner URL; the checkout code is DANIELMIHAI.
 * BitBox, NGRAVE, and Trezor stay on PENDING until a partner link exists.
 * Prices marked unverified are not given a number.
 */

export const TANGEM_PARTNER_LINK_PLACEHOLDER = "TANGEM_PARTNER_LINK";

export const WALLET_PRICE_CHECKED_AT = "2026-11-22" as const;

export const WALLET_OUTBOUND_REL = "sponsored nofollow noopener noreferrer";

export const WALLET_BRAND_SLUGS = [
  "tangem",
  "safepal",
  "coolwallet",
  "foundation",
  "trezor",
  "ledger",
  "bitbox",
  "keystone",
  "onekey",
  "ellipal",
  "ngrave",
  "cypherock",
] as const;

export type WalletBrandSlug = (typeof WALLET_BRAND_SLUGS)[number];
export type WalletDeviceType = "card" | "device" | "airgap";
export type WalletTier = "entry" | "mid" | "premium";
export type WalletCurrency = "EUR" | "USD" | "RON";
export type WalletPriceStatus = "verified" | "unverified";
export type WalletLocale = "ro" | "en";
export type WalletSecondaryKind = "same_page" | "geo_storefront";

export type WalletProduct = {
  id: string;
  slug: string;
  brand: string;
  brandSlug: WalletBrandSlug;
  modelRo: string;
  modelEn: string;
  deviceType: WalletDeviceType;
  tier: WalletTier;
  listPrice: number | null;
  listPriceMax: number | null;
  priceIsFrom: boolean;
  compareAtPrice: number | null;
  currency: WalletCurrency | null;
  secondaryAmount: number | null;
  secondaryCurrency: WalletCurrency | null;
  secondaryKind: WalletSecondaryKind | null;
  priceCheckedAt: typeof WALLET_PRICE_CHECKED_AT;
  priceSourceUrl: string;
  priceStatus: WalletPriceStatus;
  officialUrl: string;
  imageUrl: null;
  imageLicenseNote: string;
  affiliateUrl: string;
  affiliateCode: string | null;
  checkoutCodeRequired: boolean;
  /** Official-site claim only. Null when the brand page does not say it. */
  highlight: "popular" | null;
  highlightSource: string | null;
  sortOrder: number;
  published: false;
};

export type WalletPriceView =
  | { status: "hidden" }
  | {
      status: "verified";
      primary: string;
      priceIsFrom: boolean;
      compareAt: string | null;
      secondary: string | null;
      secondaryKind: WalletSecondaryKind | null;
      checkedOn: string;
    };

const IMAGE_LICENSE_NOTE =
  "Cream silhouette placeholder. Official product photography is not used until the affiliate program approves the media.";

const SLUG_RE = /^[a-z0-9-]{1,80}$/;
const BANNED_OFFICIAL_PARAMS = [
  "ref",
  "via",
  "clickid",
  "irclickid",
  "irgwc",
  "affiliate",
  "aff",
  "coupon",
  "code",
  "discount",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const LOCALE_TAG: Record<WalletLocale, string> = {
  ro: "ro-RO",
  en: "en-GB",
};

const MONTHS_EN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

let nextProductNumber = 0;

function nextId(): string {
  nextProductNumber += 1;
  return `00000000-0000-4000-8000-${nextProductNumber.toString(16).padStart(12, "0")}`;
}

export function isAffiliatePlaceholder(value: string | null | undefined): boolean {
  if (typeof value !== "string") return true;
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (trimmed === TANGEM_PARTNER_LINK_PLACEHOLDER) return true;
  return trimmed.startsWith("PENDING:");
}

export function hasRealCheckoutCode(product: Pick<WalletProduct, "affiliateCode">): boolean {
  return !isAffiliatePlaceholder(product.affiliateCode);
}

const COOLWALLET_PRO_AFFILIATE = "https://www.coolwallet.io/products/coolwallet-pro/?ref=yzm5nda";
const COOLWALLET_GO_AFFILIATE = "https://www.coolwallet.io/products/coolwallet-go/?ref=yzm5nda";
const SAFEPAL_S1_AFFILIATE = "https://www.safepal.com/store/s1?ref=n2rmyza";
const SAFEPAL_X1_AFFILIATE = "https://www.safepal.com/store/x1?ref=n2rmyza";
const SAFEPAL_S1_PRO_AFFILIATE = "https://www.safepal.com/store/s1pro?ref=n2rmyza";
const LEDGER_REF = "9111c54498ec";
const KEYSTONE_AFFILIATE_PARAMS = {
  rfsn: "9430621.40149c9",
  utm_source: "refersion",
  utm_medium: "affiliate",
  utm_campaign: "9430621.40149c9",
} as const;
const ELLIPAL_RFSN = "9430622.0718c6";

const AFFILIATE_URL_BY_SLUG: Record<string, string> = {
  "coolwallet-pro": COOLWALLET_PRO_AFFILIATE,
  "coolwallet-go": COOLWALLET_GO_AFFILIATE,
  "safepal-s1": SAFEPAL_S1_AFFILIATE,
  "safepal-x1": SAFEPAL_X1_AFFILIATE,
  "safepal-s1-pro": SAFEPAL_S1_PRO_AFFILIATE,
};

const VARIANT_HIGHLIGHT: Record<string, { kind: "popular"; source: string }> = {
  "safepal-s1": {
    kind: "popular",
    source:
      "https://www.safepal.com/en/store/s1 — S1 Hardware Wallet: “The most popular combination to safeguard crypto assets for experienced users.”",
  },
};

function withSearchParams(base: string, params: Record<string, string>): string {
  const url = new URL(base);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

function affiliateUrlFor(slug: string, brandSlug: WalletBrandSlug, officialUrl: string): string {
  const explicit = AFFILIATE_URL_BY_SLUG[slug];
  if (explicit) return explicit;
  if (brandSlug === "ledger") {
    const product = new URL(officialUrl);
    return withSearchParams(`https://shop.ledger.com${product.pathname}`, { r: LEDGER_REF });
  }
  if (brandSlug === "keystone") return withSearchParams(officialUrl, KEYSTONE_AFFILIATE_PARAMS);
  if (brandSlug === "ellipal") return withSearchParams(officialUrl, { rfsn: ELLIPAL_RFSN });
  if (brandSlug === "tangem") return TANGEM_PARTNER_LINK_PLACEHOLDER;
  return `PENDING:${brandSlug}`;
}

function assertOfficialUrl(url: string, slug: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`wallet ${slug} official URL is not a URL`);
  }
  if (parsed.protocol !== "https:") {
    throw new Error(`wallet ${slug} official URL must be https`);
  }
  if (parsed.username || parsed.password) {
    throw new Error(`wallet ${slug} official URL has credentials`);
  }
  for (const key of BANNED_OFFICIAL_PARAMS) {
    if (parsed.searchParams.has(key)) {
      throw new Error(`wallet ${slug} official URL includes ${key}`);
    }
  }
}

type WalletProductInput = {
  slug: string;
  brand: string;
  brandSlug: WalletBrandSlug;
  modelRo: string;
  modelEn: string;
  deviceType: WalletDeviceType;
  tier: WalletTier;
  listPrice: number | null;
  listPriceMax?: number | null;
  priceIsFrom?: boolean;
  compareAtPrice?: number | null;
  currency: WalletCurrency | null;
  secondaryAmount?: number | null;
  secondaryCurrency?: WalletCurrency | null;
  secondaryKind?: WalletSecondaryKind | null;
  priceSourceUrl: string;
  priceStatus: WalletPriceStatus;
  officialUrl: string;
  affiliateCode?: string | null;
  checkoutCodeRequired?: boolean;
  sortOrder: number;
};

function product(input: WalletProductInput): WalletProduct {
  if (!SLUG_RE.test(input.slug)) {
    throw new Error(`wallet slug is not a catalog slug: ${input.slug}`);
  }
  assertOfficialUrl(input.officialUrl, input.slug);
  assertOfficialUrl(input.priceSourceUrl, `${input.slug} price source`);
  if (input.priceStatus === "verified") {
    if (input.listPrice == null || input.currency == null) {
      throw new Error(`verified wallet ${input.slug} needs a price and currency`);
    }
  } else if (input.listPrice != null || input.compareAtPrice != null || input.listPriceMax != null) {
    throw new Error(`unverified wallet ${input.slug} must not carry a price`);
  }
  const affiliateCode = input.affiliateCode ?? null;
  if (affiliateCode && !isAffiliatePlaceholder(affiliateCode) && !/^[A-Za-z0-9]{4,40}$/.test(affiliateCode)) {
    throw new Error(`wallet ${input.slug} checkout code is not a plain code`);
  }
  const affiliateUrl = affiliateUrlFor(input.slug, input.brandSlug, input.officialUrl);
  if (!isAffiliatePlaceholder(affiliateUrl)) {
    let affiliate: URL;
    try {
      affiliate = new URL(affiliateUrl);
    } catch {
      throw new Error(`wallet ${input.slug} affiliate URL is not a URL`);
    }
    if (affiliate.protocol !== "https:") {
      throw new Error(`wallet ${input.slug} affiliate URL must be https`);
    }
  }
  if (input.checkoutCodeRequired && !affiliateCode) {
    throw new Error(`wallet ${input.slug} requires a checkout-code placeholder`);
  }
  return {
    id: nextId(),
    slug: input.slug,
    brand: input.brand,
    brandSlug: input.brandSlug,
    modelRo: input.modelRo,
    modelEn: input.modelEn,
    deviceType: input.deviceType,
    tier: input.tier,
    listPrice: input.listPrice,
    listPriceMax: input.listPriceMax ?? null,
    priceIsFrom: input.priceIsFrom ?? false,
    compareAtPrice: input.compareAtPrice ?? null,
    currency: input.currency,
    secondaryAmount: input.secondaryAmount ?? null,
    secondaryCurrency: input.secondaryCurrency ?? null,
    secondaryKind: input.secondaryKind ?? null,
    priceCheckedAt: WALLET_PRICE_CHECKED_AT,
    priceSourceUrl: input.priceSourceUrl,
    priceStatus: input.priceStatus,
    officialUrl: input.officialUrl,
    imageUrl: null,
    imageLicenseNote: IMAGE_LICENSE_NOTE,
    affiliateUrl,
    affiliateCode,
    checkoutCodeRequired: input.checkoutCodeRequired ?? false,
    highlight: VARIANT_HIGHLIGHT[input.slug]?.kind ?? null,
    highlightSource: VARIANT_HIGHLIGHT[input.slug]?.source ?? null,
    sortOrder: input.sortOrder,
    published: false,
  };
}

export const WALLET_PRODUCTS: readonly WalletProduct[] = [
  product({
    slug: "tangem-2-cards",
    brand: "Tangem",
    brandSlug: "tangem",
    modelRo: "Portofel, 2 carduri (Classic Black)",
    modelEn: "2-card wallet (Classic Black)",
    deviceType: "card",
    tier: "entry",
    listPrice: 59.9,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://tangem.com/en/pricing/?cat=2&sku=TG128X2-B",
    officialUrl: "https://tangem.com/en/pricing/?cat=2&sku=TG128X2-B",
    affiliateCode: "DANIELMIHAI",
    checkoutCodeRequired: true,
    sortOrder: 10,
  }),
  product({
    slug: "tangem-3-cards",
    brand: "Tangem",
    brandSlug: "tangem",
    modelRo: "Portofel, 3 carduri (Classic Black și celelalte designuri din listă)",
    modelEn: "3-card wallet (Classic Black and the other listed designs)",
    deviceType: "card",
    tier: "entry",
    listPrice: 69.9,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://tangem.com/en/pricing/?cat=3&sku=TG128X3-B",
    officialUrl: "https://tangem.com/en/pricing/?cat=3&sku=TG128X3-B",
    affiliateCode: "DANIELMIHAI",
    checkoutCodeRequired: true,
    sortOrder: 11,
  }),
  product({
    slug: "tangem-ring",
    brand: "Tangem",
    brandSlug: "tangem",
    modelRo: "Tangem Ring (inel și carduri)",
    modelEn: "Tangem Ring (ring and cards)",
    deviceType: "card",
    tier: "mid",
    listPrice: 140,
    listPriceMax: 160,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://tangem.com/en/pricing/?cat=ring",
    officialUrl: "https://tangem.com/en/pricing/?cat=ring",
    affiliateCode: "DANIELMIHAI",
    checkoutCodeRequired: true,
    sortOrder: 12,
  }),
  product({
    slug: "tangem-pro-kit",
    brand: "Tangem",
    brandSlug: "tangem",
    modelRo: "Tangem Pro Kit",
    modelEn: "Tangem Pro Kit",
    deviceType: "card",
    tier: "mid",
    listPrice: 180,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://tangem.com/en/pricing/?cat=boxes",
    officialUrl: "https://tangem.com/en/pricing/?cat=boxes",
    affiliateCode: "DANIELMIHAI",
    checkoutCodeRequired: true,
    sortOrder: 13,
  }),
  product({
    slug: "safepal-s1",
    brand: "SafePal",
    brandSlug: "safepal",
    modelRo: "SafePal S1",
    modelEn: "SafePal S1",
    deviceType: "device",
    tier: "entry",
    listPrice: 49.99,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://www.safepal.com/en/store/s1",
    officialUrl: "https://www.safepal.com/en/store/s1",
    sortOrder: 100,
  }),
  product({
    slug: "safepal-x1",
    brand: "SafePal",
    brandSlug: "safepal",
    modelRo: "SafePal X1",
    modelEn: "SafePal X1",
    deviceType: "device",
    tier: "entry",
    listPrice: 69.99,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://www.safepal.com/en/store/x1",
    officialUrl: "https://www.safepal.com/en/store/x1",
    sortOrder: 101,
  }),
  product({
    slug: "safepal-s1-pro",
    brand: "SafePal",
    brandSlug: "safepal",
    modelRo: "SafePal S1 Pro",
    modelEn: "SafePal S1 Pro",
    deviceType: "device",
    tier: "entry",
    listPrice: 89.99,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://www.safepal.com/en/store/s1pro",
    officialUrl: "https://www.safepal.com/en/store/s1pro",
    sortOrder: 102,
  }),
  product({
    slug: "coolwallet-go",
    brand: "CoolWallet",
    brandSlug: "coolwallet",
    modelRo: "CoolWallet Go (set de 2 carduri)",
    modelEn: "CoolWallet Go (2-card set)",
    deviceType: "card",
    tier: "entry",
    listPrice: 69,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://www.coolwallet.io/products/coolwallet-go.json",
    officialUrl: "https://www.coolwallet.io/products/coolwallet-go",
    sortOrder: 110,
  }),
  product({
    slug: "trezor-safe-3",
    brand: "Trezor",
    brandSlug: "trezor",
    modelRo: "Trezor Safe 3",
    modelEn: "Trezor Safe 3",
    deviceType: "device",
    tier: "entry",
    listPrice: 39,
    currency: "EUR",
    secondaryAmount: 207,
    secondaryCurrency: "RON",
    secondaryKind: "same_page",
    priceStatus: "verified",
    priceSourceUrl: "https://trezor.io/trezor-safe-3",
    officialUrl: "https://trezor.io/trezor-safe-3",
    sortOrder: 120,
  }),
  product({
    slug: "ledger-nano-s-plus",
    brand: "Ledger",
    brandSlug: "ledger",
    modelRo: "Ledger Nano S Plus",
    modelEn: "Ledger Nano S Plus",
    deviceType: "device",
    tier: "entry",
    listPrice: 53,
    priceIsFrom: true,
    compareAtPrice: 59,
    currency: "EUR",
    priceStatus: "verified",
    priceSourceUrl: "https://store.ledger.com/products/ledger-nano-s-plus.json",
    officialUrl: "https://store.ledger.com/products/ledger-nano-s-plus",
    sortOrder: 130,
  }),
  product({
    slug: "onekey-classic-1s-pure",
    brand: "OneKey",
    brandSlug: "onekey",
    modelRo: "OneKey Classic 1S Pure (fără baterie)",
    modelEn: "OneKey Classic 1S Pure (no battery)",
    deviceType: "device",
    tier: "entry",
    listPrice: 79,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://onekey.so/compare-onekey/",
    officialUrl: "https://onekey.so/products/onekey-classic-1s/",
    affiliateCode: "PENDING:onekey",
    checkoutCodeRequired: true,
    sortOrder: 140,
  }),
  product({
    slug: "ellipal-titan-mini",
    brand: "ELLIPAL",
    brandSlug: "ellipal",
    modelRo: "ELLIPAL Titan Mini",
    modelEn: "ELLIPAL Titan Mini",
    deviceType: "airgap",
    tier: "entry",
    listPrice: 61,
    compareAtPrice: 125,
    currency: "EUR",
    priceStatus: "verified",
    priceSourceUrl: "https://www.ellipal.com/en-eu/products/ellipal-titan-mini.json",
    officialUrl: "https://www.ellipal.com/en-eu/products/ellipal-titan-mini",
    sortOrder: 150,
  }),
  product({
    slug: "ellipal-x-card",
    brand: "ELLIPAL",
    brandSlug: "ellipal",
    modelRo: "ELLIPAL X Card (1 card)",
    modelEn: "ELLIPAL X Card (1 card)",
    deviceType: "card",
    tier: "entry",
    listPrice: 72,
    compareAtPrice: 96,
    currency: "EUR",
    priceStatus: "verified",
    priceSourceUrl: "https://www.ellipal.com/en-eu/products/ellipal-x-card.json",
    officialUrl: "https://www.ellipal.com/en-eu/products/ellipal-x-card",
    sortOrder: 151,
  }),
  product({
    slug: "cypherock-x0",
    brand: "Cypherock",
    brandSlug: "cypherock",
    modelRo: "Cypherock X0",
    modelEn: "Cypherock X0",
    deviceType: "card",
    tier: "entry",
    listPrice: null,
    currency: null,
    priceStatus: "unverified",
    priceSourceUrl: "https://www.cypherock.com/cypherock-x0",
    officialUrl: "https://www.cypherock.com/cypherock-x0",
    sortOrder: 160,
  }),
  product({
    slug: "cypherock-x1-basic",
    brand: "Cypherock",
    brandSlug: "cypherock",
    modelRo: "Cypherock X1 Basic",
    modelEn: "Cypherock X1 Basic",
    deviceType: "device",
    tier: "entry",
    listPrice: 99,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://www.cypherock.com/blogs/cypherock-x1-models-comparison",
    officialUrl: "https://www.cypherock.com/store",
    sortOrder: 161,
  }),
  product({
    slug: "coolwallet-pro",
    brand: "CoolWallet",
    brandSlug: "coolwallet",
    modelRo: "CoolWallet Pro",
    modelEn: "CoolWallet Pro",
    deviceType: "card",
    tier: "mid",
    listPrice: 149,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://www.coolwallet.io/products/coolwallet-pro.json",
    officialUrl: "https://www.coolwallet.io/products/coolwallet-pro",
    sortOrder: 200,
  }),
  product({
    slug: "trezor-safe-5",
    brand: "Trezor",
    brandSlug: "trezor",
    modelRo: "Trezor Safe 5",
    modelEn: "Trezor Safe 5",
    deviceType: "device",
    tier: "mid",
    listPrice: 79,
    currency: "EUR",
    secondaryAmount: 420,
    secondaryCurrency: "RON",
    secondaryKind: "same_page",
    priceStatus: "verified",
    priceSourceUrl: "https://trezor.io/trezor-safe-5",
    officialUrl: "https://trezor.io/trezor-safe-5",
    sortOrder: 210,
  }),
  product({
    slug: "ledger-nano-x",
    brand: "Ledger",
    brandSlug: "ledger",
    modelRo: "Ledger Nano X",
    modelEn: "Ledger Nano X",
    deviceType: "device",
    tier: "mid",
    listPrice: 79,
    priceIsFrom: true,
    compareAtPrice: 99,
    currency: "EUR",
    priceStatus: "verified",
    priceSourceUrl: "https://store.ledger.com/products/ledger-nano-x.json",
    officialUrl: "https://store.ledger.com/products/ledger-nano-x",
    sortOrder: 220,
  }),
  product({
    slug: "ledger-nano-gen5",
    brand: "Ledger",
    brandSlug: "ledger",
    modelRo: "Ledger Nano Gen5",
    modelEn: "Ledger Nano Gen5",
    deviceType: "device",
    tier: "mid",
    listPrice: 179,
    currency: "EUR",
    priceStatus: "verified",
    priceSourceUrl: "https://store.ledger.com/products/ledger-nano-gen5.json",
    officialUrl: "https://store.ledger.com/products/ledger-nano-gen5",
    sortOrder: 221,
  }),
  product({
    slug: "bitbox02",
    brand: "BitBox",
    brandSlug: "bitbox",
    modelRo: "BitBox02",
    modelEn: "BitBox02",
    deviceType: "device",
    tier: "mid",
    listPrice: 149,
    currency: "EUR",
    priceStatus: "verified",
    priceSourceUrl: "https://shop.bitbox.swiss/en/products/bitbox02-80/",
    officialUrl: "https://shop.bitbox.swiss/en/products/bitbox02-80/",
    sortOrder: 230,
  }),
  product({
    slug: "bitbox02-nova",
    brand: "BitBox",
    brandSlug: "bitbox",
    modelRo: "BitBox02 Nova",
    modelEn: "BitBox02 Nova",
    deviceType: "device",
    tier: "mid",
    listPrice: 175,
    currency: "EUR",
    priceStatus: "verified",
    priceSourceUrl: "https://shop.bitbox.swiss/en/products/bitbox02-nova-79/",
    officialUrl: "https://shop.bitbox.swiss/en/products/bitbox02-nova-79/",
    sortOrder: 231,
  }),
  product({
    slug: "keystone-3-pro-1-year",
    brand: "Keystone",
    brandSlug: "keystone",
    modelRo: "Keystone 3 Pro, acoperire 1 an",
    modelEn: "Keystone 3 Pro, 1-year coverage",
    deviceType: "airgap",
    tier: "mid",
    listPrice: 149,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://shop.keyst.one/products/keystone-3-pro.json",
    officialUrl: "https://shop.keyst.one/products/keystone-3-pro?variant=44416761102489",
    sortOrder: 240,
  }),
  product({
    slug: "keystone-3-pro-2-year",
    brand: "Keystone",
    brandSlug: "keystone",
    modelRo: "Keystone 3 Pro, acoperire 2 ani",
    modelEn: "Keystone 3 Pro, 2-year coverage",
    deviceType: "airgap",
    tier: "mid",
    listPrice: 199,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://shop.keyst.one/products/keystone-3-pro.json",
    officialUrl: "https://shop.keyst.one/products/keystone-3-pro?variant=45064372453529",
    sortOrder: 241,
  }),
  product({
    slug: "keystone-3-pro-3-year",
    brand: "Keystone",
    brandSlug: "keystone",
    modelRo: "Keystone 3 Pro, acoperire 3 ani",
    modelEn: "Keystone 3 Pro, 3-year coverage",
    deviceType: "airgap",
    tier: "mid",
    listPrice: 249,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://shop.keyst.one/products/keystone-3-pro.json",
    officialUrl: "https://shop.keyst.one/products/keystone-3-pro?variant=45064372486297",
    sortOrder: 242,
  }),
  product({
    slug: "onekey-classic-1s",
    brand: "OneKey",
    brandSlug: "onekey",
    modelRo: "OneKey Classic 1S (cu baterie)",
    modelEn: "OneKey Classic 1S (with battery)",
    deviceType: "device",
    tier: "mid",
    listPrice: 99,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://onekey.so/products/onekey-classic-1s/",
    officialUrl: "https://onekey.so/products/onekey-classic-1s/",
    affiliateCode: "PENDING:onekey",
    checkoutCodeRequired: true,
    sortOrder: 250,
  }),
  product({
    slug: "onekey-neo",
    brand: "OneKey",
    brandSlug: "onekey",
    modelRo: "OneKey Neo",
    modelEn: "OneKey Neo",
    deviceType: "device",
    tier: "mid",
    listPrice: 179,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://onekey.so/products/onekey-neo/",
    officialUrl: "https://onekey.so/products/onekey-neo/",
    affiliateCode: "PENDING:onekey",
    checkoutCodeRequired: true,
    sortOrder: 251,
  }),
  product({
    slug: "ellipal-titan-2",
    brand: "ELLIPAL",
    brandSlug: "ellipal",
    modelRo: "ELLIPAL Titan 2.0",
    modelEn: "ELLIPAL Titan 2.0",
    deviceType: "airgap",
    tier: "mid",
    listPrice: 160,
    compareAtPrice: 210,
    currency: "EUR",
    priceStatus: "verified",
    priceSourceUrl: "https://www.ellipal.com/en-eu/products/ellipal-titan.json",
    officialUrl: "https://www.ellipal.com/en-eu/products/ellipal-titan?variant=40716752158918",
    sortOrder: 260,
  }),
  product({
    slug: "cypherock-x1-standard",
    brand: "Cypherock",
    brandSlug: "cypherock",
    modelRo: "Cypherock X1 Standard",
    modelEn: "Cypherock X1 Standard",
    deviceType: "device",
    tier: "mid",
    listPrice: 179,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://www.cypherock.com/blogs/cypherock-x1-models-comparison",
    officialUrl: "https://www.cypherock.com/store",
    sortOrder: 270,
  }),
  product({
    slug: "foundation-passport-prime",
    brand: "Foundation",
    brandSlug: "foundation",
    modelRo: "Passport Prime",
    modelEn: "Passport Prime",
    deviceType: "airgap",
    tier: "premium",
    listPrice: 328,
    currency: "USD",
    secondaryAmount: 1980,
    secondaryCurrency: "RON",
    secondaryKind: "geo_storefront",
    priceStatus: "verified",
    priceSourceUrl: "https://foundation.xyz/products/passport-prime?country=US",
    officialUrl: "https://foundation.xyz/products/passport-prime?country=US",
    affiliateCode: "PENDING:foundation",
    checkoutCodeRequired: true,
    sortOrder: 300,
  }),
  product({
    slug: "trezor-safe-7",
    brand: "Trezor",
    brandSlug: "trezor",
    modelRo: "Trezor Safe 7",
    modelEn: "Trezor Safe 7",
    deviceType: "device",
    tier: "premium",
    listPrice: 179,
    currency: "EUR",
    secondaryAmount: 942,
    secondaryCurrency: "RON",
    secondaryKind: "same_page",
    priceStatus: "verified",
    priceSourceUrl: "https://trezor.io/trezor-safe-7",
    officialUrl: "https://trezor.io/trezor-safe-7",
    sortOrder: 310,
  }),
  product({
    slug: "ledger-flex",
    brand: "Ledger",
    brandSlug: "ledger",
    modelRo: "Ledger Flex + Recovery Key",
    modelEn: "Ledger Flex + Recovery Key",
    deviceType: "device",
    tier: "premium",
    listPrice: 249,
    currency: "EUR",
    priceStatus: "verified",
    priceSourceUrl: "https://store.ledger.com/products/ledger-flex.json",
    officialUrl: "https://store.ledger.com/products/ledger-flex",
    sortOrder: 320,
  }),
  product({
    slug: "onekey-pro-2",
    brand: "OneKey",
    brandSlug: "onekey",
    modelRo: "OneKey Pro 2",
    modelEn: "OneKey Pro 2",
    deviceType: "device",
    tier: "premium",
    listPrice: 299,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://onekey.so/products/onekey-pro-2/",
    officialUrl: "https://onekey.so/products/onekey-pro-2/",
    affiliateCode: "PENDING:onekey",
    checkoutCodeRequired: true,
    sortOrder: 330,
  }),
  product({
    slug: "ellipal-mega-bundle",
    brand: "ELLIPAL",
    brandSlug: "ellipal",
    modelRo: "ELLIPAL Mega Bundle",
    modelEn: "ELLIPAL Mega Bundle",
    deviceType: "airgap",
    tier: "premium",
    listPrice: 255,
    compareAtPrice: 440,
    currency: "EUR",
    priceStatus: "verified",
    priceSourceUrl: "https://www.ellipal.com/en-eu/products/ellipal-titan.json",
    officialUrl: "https://www.ellipal.com/en-eu/products/ellipal-titan?variant=48601895895238",
    sortOrder: 340,
  }),
  product({
    slug: "ngrave-zero",
    brand: "NGRAVE",
    brandSlug: "ngrave",
    modelRo: "NGRAVE ZERO",
    modelEn: "NGRAVE ZERO",
    deviceType: "airgap",
    tier: "premium",
    listPrice: 398,
    currency: "EUR",
    priceStatus: "verified",
    priceSourceUrl: "https://shop.ngrave.io/products/zero.json",
    officialUrl: "https://shop.ngrave.io/products/zero",
    sortOrder: 350,
  }),
  product({
    slug: "ngrave-zero-graphene",
    brand: "NGRAVE",
    brandSlug: "ngrave",
    modelRo: "NGRAVE ZERO + GRAPHENE",
    modelEn: "NGRAVE ZERO + GRAPHENE",
    deviceType: "airgap",
    tier: "premium",
    listPrice: 498,
    currency: "EUR",
    priceStatus: "verified",
    priceSourceUrl: "https://shop.ngrave.io/products.json",
    officialUrl: "https://shop.ngrave.io/products/combo-pack-zero-graphene",
    sortOrder: 351,
  }),
  product({
    slug: "ngrave-ultimate",
    brand: "NGRAVE",
    brandSlug: "ngrave",
    modelRo: "NGRAVE Ultimate Combo Pack",
    modelEn: "NGRAVE Ultimate Combo Pack",
    deviceType: "airgap",
    tier: "premium",
    listPrice: 568,
    compareAtPrice: 597,
    currency: "EUR",
    priceStatus: "verified",
    priceSourceUrl: "https://shop.ngrave.io/products.json",
    officialUrl: "https://shop.ngrave.io/products/ultimate-combo-pack-1",
    sortOrder: 352,
  }),
  product({
    slug: "cypherock-x1-pro",
    brand: "Cypherock",
    brandSlug: "cypherock",
    modelRo: "Cypherock X1 Pro",
    modelEn: "Cypherock X1 Pro",
    deviceType: "device",
    tier: "premium",
    listPrice: 249,
    currency: "USD",
    priceStatus: "verified",
    priceSourceUrl: "https://www.cypherock.com/blogs/cypherock-x1-models-comparison",
    officialUrl: "https://www.cypherock.com/store",
    sortOrder: 360,
  }),
];

function tierRank(tier: WalletTier): number {
  if (tier === "entry") return 0;
  if (tier === "mid") return 1;
  return 2;
}

function assertCatalogIntegrity(products: readonly WalletProduct[]): void {
  const slugs = new Set<string>();
  const ids = new Set<string>();
  const orders = new Set<number>();
  for (const item of products) {
    if (slugs.has(item.slug) || ids.has(item.id) || orders.has(item.sortOrder)) {
      throw new Error(`duplicate wallet identity: ${item.slug}`);
    }
    slugs.add(item.slug);
    ids.add(item.id);
    orders.add(item.sortOrder);
    if (item.published !== false) {
      throw new Error(`wallet ${item.slug} must stay unpublished`);
    }
    if (item.imageUrl !== null) {
      throw new Error(`wallet ${item.slug} must not hotlink a product image`);
    }
  }
  for (const brandSlug of WALLET_BRAND_SLUGS) {
    if (!products.some((item) => item.brandSlug === brandSlug)) {
      throw new Error(`missing wallet brand ${brandSlug}`);
    }
  }
  const tangemMax = Math.max(
    ...products.filter((item) => item.brandSlug === "tangem").map((item) => item.sortOrder),
  );
  const others = products
    .filter((item) => item.brandSlug !== "tangem")
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);
  if (others.some((item) => item.sortOrder <= tangemMax)) {
    throw new Error("Tangem must sort ahead of every other brand");
  }
  for (let index = 1; index < others.length; index += 1) {
    const previous = others[index - 1];
    const current = others[index];
    if (!previous || !current) continue;
    if (tierRank(current.tier) < tierRank(previous.tier)) {
      throw new Error("after Tangem, catalog order is entry, then mid, then premium");
    }
  }
}

assertCatalogIntegrity(WALLET_PRODUCTS);

export function sortedWalletProducts(): WalletProduct[] {
  return WALLET_PRODUCTS.slice().sort((a, b) => a.sortOrder - b.sortOrder || a.slug.localeCompare(b.slug));
}

/** Static preview shelf. Publication flags stay false; the page still lists every model. */
export function walletCatalogForPage(): WalletProduct[] {
  return sortedWalletProducts();
}

export function filterWalletProducts(input: {
  tier: WalletTier | "all";
  deviceType: WalletDeviceType | "all";
}): WalletProduct[] {
  return sortedWalletProducts().filter((item) => {
    if (input.tier !== "all" && item.tier !== input.tier) return false;
    if (input.deviceType !== "all" && item.deviceType !== input.deviceType) return false;
    return true;
  });
}

export function walletModelName(product: WalletProduct, locale: WalletLocale): string {
  return locale === "en" ? product.modelEn : product.modelRo;
}

export function formatWalletMoney(
  amount: number,
  currency: WalletCurrency,
  locale: WalletLocale,
): string {
  const formatted = new Intl.NumberFormat(LOCALE_TAG[locale], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} ${currency}`;
}

export function formatWalletRange(
  min: number,
  max: number,
  currency: WalletCurrency,
  locale: WalletLocale,
): string {
  const formatter = new Intl.NumberFormat(LOCALE_TAG[locale], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatter.format(min)}–${formatter.format(max)} ${currency}`;
}

export function formatWalletCheckedDate(isoDate: string, locale: WalletLocale): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  const year = match[1] ?? "";
  const month = match[2] ?? "";
  const day = match[3] ?? "";
  if (locale === "ro") return `${day}.${month}.${year}`;
  const monthIndex = Number(month) - 1;
  const monthName = MONTHS_EN[monthIndex] ?? month;
  return `${Number(day)} ${monthName} ${year}`;
}

export function walletPriceView(product: WalletProduct, locale: WalletLocale): WalletPriceView {
  if (product.priceStatus !== "verified" || product.listPrice == null || product.currency == null) {
    return { status: "hidden" };
  }
  const primary =
    product.listPriceMax != null
      ? formatWalletRange(product.listPrice, product.listPriceMax, product.currency, locale)
      : formatWalletMoney(product.listPrice, product.currency, locale);
  const secondary =
    product.secondaryAmount != null && product.secondaryCurrency
      ? formatWalletMoney(product.secondaryAmount, product.secondaryCurrency, locale)
      : null;
  return {
    status: "verified",
    primary,
    priceIsFrom: product.priceIsFrom && product.listPriceMax == null,
    compareAt:
      product.compareAtPrice != null
        ? formatWalletMoney(product.compareAtPrice, product.currency, locale)
        : null,
    secondary,
    secondaryKind: secondary ? product.secondaryKind : null,
    checkedOn: formatWalletCheckedDate(product.priceCheckedAt, locale),
  };
}

export function resolveWalletOutboundBase(product: Pick<WalletProduct, "affiliateUrl" | "officialUrl">): string {
  if (!isAffiliatePlaceholder(product.affiliateUrl)) {
    try {
      const affiliate = new URL(product.affiliateUrl);
      if (affiliate.protocol === "https:") return affiliate.toString();
    } catch {
      // Placeholder or unusable value: send the shopper to the official page.
    }
  }
  return product.officialUrl;
}

export function buildWalletOutboundUrl(
  product: Pick<WalletProduct, "affiliateUrl" | "officialUrl" | "brandSlug" | "slug">,
): string {
  const url = new URL(resolveWalletOutboundBase(product));
  if (!url.searchParams.has("utm_source")) {
    url.searchParams.set("utm_source", "quickexit");
    url.searchParams.set("utm_medium", "affiliate");
    url.searchParams.set("utm_campaign", "wallets");
  }
  if (!url.searchParams.has("utm_content")) {
    url.searchParams.set("utm_content", `${product.brandSlug}-${product.slug}`.slice(0, 120));
  }
  return url.toString();
}

// --- END lib/walletCatalog.ts ---

// --- BEGIN lib/walletBrands.ts ---
/**
 * Brand-level shelf for /wallets. One card per manufacturer.
 * Photos are official files saved under public/wallets/. Source URLs are the
 * pages or CDNs they were downloaded from. Nothing is hotlinked at runtime.
 */


export type WalletImageTone = "dark" | "light";

export type WalletBrandImage = {
  src: string;
  width: number;
  height: number;
  sourceUrl: string;
  altRo: string;
  altEn: string;
  /** Present when the committed file is not a byte-for-byte copy of the source. */
  editNote: string | null;
};

export type WalletBrandProfile = {
  slug: WalletBrandSlug;
  name: string;
  positioningRo: string;
  positioningEn: string;
  /** Customer line for the homepage shelf. The /wallets page keeps positioningRo/En. */
  shortDescription?: { ro: string; en: string };
  highlights: { ro: string; en: string }[];
  image: WalletBrandImage;
  tone: WalletImageTone;
  usedByDani?: boolean;
};

export const WALLET_BRANDS: readonly WalletBrandProfile[] = [
  {
    slug: "tangem",
    name: "Tangem",
    positioningRo: "Portofel-card. Seturi de două și trei carduri, Ring și Pro Kit.",
    positioningEn: "A card wallet. Two- and three-card sets, Ring, and the Pro Kit.",
    shortDescription: {
      ro: "Portofel-card, seturi de 2 sau 3 carduri",
      en: "Card wallet, sets of 2 or 3 cards",
    },
    highlights: [{ ro: "Card", en: "Card" }],
    usedByDani: true,
    tone: "dark",
    image: {
      src: "/wallets/tangem.webp",
      width: 1600,
      height: 1280,
      sourceUrl: "https://tangem.com/_astro/1775044529322-1760979542662-Clas.D_a535fa47.webp",
      altRo: "Trei carduri Tangem negre",
      altEn: "Three black Tangem cards",
      editNote: "Official Tangem render, placed on a transparent 5:4 canvas so every card shares one frame.",
    },
  },
  {
    slug: "safepal",
    name: "SafePal",
    positioningRo: "Trei dispozitive de intrare: S1, X1 și S1 Pro.",
    positioningEn: "Three entry devices: S1, X1, and S1 Pro.",
    shortDescription: {
      ro: "S1, X1 și S1 Pro",
      en: "S1, X1, and S1 Pro",
    },
    highlights: [{ ro: "Dispozitiv", en: "Device" }],
    tone: "dark",
    image: {
      src: "/wallets/safepal.webp",
      width: 1600,
      height: 1280,
      sourceUrl: "https://www.safepal.com/assets/img/product_landing/safepal_s1.png",
      altRo: "SafePal S1, vedere față și spate",
      altEn: "SafePal S1, front and back",
      editNote: "Official SafePal S1 render. The source is 566px, so it is the limiting file; it sits on the shared transparent frame.",
    },
  },
  {
    slug: "coolwallet",
    name: "CoolWallet",
    positioningRo: "Carduri: Go, set de două, și Pro.",
    positioningEn: "Cards: the two-card Go set, and Pro.",
    highlights: [{ ro: "Card", en: "Card" }],
    tone: "light",
    image: {
      src: "/wallets/coolwallet.webp",
      width: 1600,
      height: 1280,
      sourceUrl: "https://cdn.shopify.com/s/files/1/0641/3995/2301/files/Coolwallet-Pro-04.webp?v=1736397307",
      altRo: "CoolWallet Pro lângă telefon",
      altEn: "CoolWallet Pro next to a phone",
      editNote: "Official CoolWallet store photo. The flat gray studio background was removed. The hands stay because that is the official product frame.",
    },
  },
  {
    slug: "trezor",
    name: "Trezor",
    positioningRo: "Safe 3, Safe 5 și Safe 7. Prețul canonic este în euro, cu lei pe aceeași pagină.",
    positioningEn: "Safe 3, Safe 5, and Safe 7. The canonical price is in euro, with lei on the same page.",
    shortDescription: {
      ro: "Safe 3, Safe 5 și Safe 7",
      en: "Safe 3, Safe 5, and Safe 7",
    },
    highlights: [
      { ro: "Dispozitiv", en: "Device" },
      { ro: "Cehia", en: "Czechia" },
    ],
    tone: "light",
    image: {
      src: "/wallets/trezor.webp",
      width: 1600,
      height: 1280,
      sourceUrl: "https://imagedelivery.net/dvYzklbs_b5YaLRtI16Mnw/65b748be-3f57-4f4a-1fa4-8f7a1ab40500/public",
      altRo: "Trezor Safe 5, față și spate",
      altEn: "Trezor Safe 5, front and back",
      editNote: "Official Trezor Safe 5 render. The green fringe stored in transparent pixels was cleared, then the device was placed on the shared frame.",
    },
  },
  {
    slug: "ledger",
    name: "Ledger",
    positioningRo: "Nano S Plus, Nano X, Nano Gen5 și Flex. La unele modele prețul este „de la”, după culoare.",
    positioningEn: "Nano S Plus, Nano X, Nano Gen5, and Flex. Some prices are a starting price, by color.",
    shortDescription: {
      ro: "Nano S Plus, Nano X, Nano Gen5 și Flex",
      en: "Nano S Plus, Nano X, Nano Gen5, and Flex",
    },
    highlights: [
      { ro: "Dispozitiv", en: "Device" },
      { ro: "Franța", en: "France" },
    ],
    tone: "dark",
    image: {
      src: "/wallets/ledger.webp",
      width: 1600,
      height: 1280,
      sourceUrl: "https://cdn.shopify.com/s/files/1/2974/4858/files/carrousel_lng5_1.png?v=1774363239",
      altRo: "Ledger Nano Gen5",
      altEn: "Ledger Nano Gen5",
      editNote: "Official Ledger Nano Gen5 render, placed on the shared transparent frame.",
    },
  },
  {
    slug: "onekey",
    name: "OneKey",
    positioningRo: "Classic 1S, Neo și Pro 2. Codul de checkout apare aici când există.",
    positioningEn: "Classic 1S, Neo, and Pro 2. The checkout code appears here when it exists.",
    highlights: [{ ro: "Dispozitiv", en: "Device" }],
    tone: "dark",
    image: {
      src: "/wallets/onekey.webp",
      width: 1600,
      height: 1280,
      sourceUrl: "https://cdn.shopify.com/s/files/1/0486/8613/7506/files/SY2_1S_01_7e1d95d7-e000-4070-87ac-ca4307e55879.png",
      altRo: "OneKey Classic 1S",
      altEn: "OneKey Classic 1S",
      editNote: "Replaced the Pro 2 marketing banner (logo, headline, and a hand) with the official Classic 1S product render from the OneKey shop.",
    },
  },
  {
    slug: "ellipal",
    name: "ELLIPAL",
    positioningRo: "Titan Mini, X Card, Titan 2.0 și Mega Bundle. Air-gap și un card.",
    positioningEn: "Titan Mini, X Card, Titan 2.0, and the Mega Bundle. Air-gapped devices and a card.",
    highlights: [
      { ro: "Air-gap", en: "Air-gap" },
      { ro: "Card", en: "Card" },
    ],
    tone: "light",
    image: {
      src: "/wallets/ellipal.webp",
      width: 1600,
      height: 1280,
      sourceUrl:
        "https://cdn.shopify.com/s/files/1/0031/5765/5641/files/ellipal-titan-2-0-gold-front-back-black-friday.png?v=1793949779",
      altRo: "ELLIPAL Titan 2.0, față și spate",
      altEn: "ELLIPAL Titan 2.0, front and back",
      editNote:
        "Official ELLIPAL shop photo. The gray studio background and the promotional corner were removed.",
    },
  },
  {
    slug: "cypherock",
    name: "Cypherock",
    positioningRo: "X1 în trei variante, plus X0. La X0 prețul nu era vizibil, așa că nu afișăm o cifră.",
    positioningEn: "X1 in three versions, plus X0. X0 had no visible price, so no figure is shown.",
    highlights: [
      { ro: "Card", en: "Card" },
      { ro: "Dispozitiv", en: "Device" },
    ],
    tone: "dark",
    image: {
      src: "/wallets/cypherock.webp",
      width: 1600,
      height: 1280,
      sourceUrl: "https://www.cypherock.com/assets/images/home/cypherock-x1-hero.webp",
      altRo: "Cypherock X1, dispozitiv și patru carduri",
      altEn: "Cypherock X1, device and four cards",
      editNote: "Official Cypherock hero, placed on the shared transparent frame.",
    },
  },
  {
    slug: "bitbox",
    name: "BitBox",
    positioningRo: "BitBox02 și BitBox02 Nova. Prețul afișat este în euro.",
    positioningEn: "BitBox02 and BitBox02 Nova. The price shown is in euro.",
    highlights: [
      { ro: "Dispozitiv", en: "Device" },
      { ro: "Elveția", en: "Switzerland" },
    ],
    tone: "light",
    image: {
      src: "/wallets/bitbox.webp",
      width: 1600,
      height: 1280,
      sourceUrl: "https://bitbox.swiss/assets/images/ogp/bitbox02-hardware-wallet.png",
      altRo: "BitBox02",
      altEn: "BitBox02",
      editNote: "Replaced the white-background Nova collage with the official BitBox02 product photo from bitbox.swiss. The light studio background was removed.",
    },
  },
  {
    slug: "keystone",
    name: "Keystone",
    positioningRo: "Keystone 3 Pro, air-gap, cu acoperire de 1, 2 sau 3 ani.",
    positioningEn: "Keystone 3 Pro, air-gapped, with 1-, 2-, or 3-year coverage.",
    shortDescription: {
      ro: "3 Pro, air-gap",
      en: "3 Pro, air-gapped",
    },
    highlights: [{ ro: "Air-gap", en: "Air-gap" }],
    tone: "light",
    image: {
      src: "/wallets/keystone.webp",
      width: 1600,
      height: 1280,
      sourceUrl: "https://cdn.shopify.com/s/files/1/0029/3175/3060/files/3_pro.jpg?v=1779695258",
      altRo: "Keystone 3 Pro, față și spate",
      altEn: "Keystone 3 Pro, front and back",
      editNote: "Official Keystone 3 Pro photo. The devices are cut along the gap under the chassis so the studio reflection is gone, and placed on the shared cream card. The black display is the original pixels.",
    },
  },
  {
    slug: "foundation",
    name: "Foundation",
    positioningRo: "Passport Prime. Prețul de pe card este cel al vitrinei SUA; în România magazinul arată lei.",
    positioningEn: "Passport Prime. The card price is the US storefront; in Romania the shop shows lei.",
    highlights: [
      { ro: "Air-gap", en: "Air-gap" },
      { ro: "SUA", en: "USA" },
    ],
    tone: "dark",
    image: {
      src: "/wallets/foundation.webp",
      width: 1600,
      height: 1280,
      sourceUrl: "https://cdn.shopify.com/s/files/1/0753/6738/3092/files/prime_dark.webp",
      altRo: "Foundation Passport Prime, față și spate",
      altEn: "Foundation Passport Prime, front and back",
      editNote: "Official Foundation render, placed on the shared transparent frame.",
    },
  },
  {
    slug: "ngrave",
    name: "NGRAVE",
    positioningRo: "ZERO, pachetul cu GRAPHENE și Ultimate Combo. Air-gap, preț în euro.",
    positioningEn: "ZERO, the GRAPHENE pack, and the Ultimate Combo. Air-gapped, priced in euro.",
    highlights: [
      { ro: "Air-gap", en: "Air-gap" },
      { ro: "Belgia", en: "Belgium" },
    ],
    tone: "light",
    image: {
      src: "/wallets/ngrave.webp",
      width: 1600,
      height: 1280,
      sourceUrl: "https://cdn.shopify.com/s/files/1/0285/1563/1188/files/ZERO-2.jpg?v=1732272573",
      altRo: "NGRAVE ZERO",
      altEn: "NGRAVE ZERO",
      editNote: "Official NGRAVE shop photo. The dimension callout, the cable, and the pale studio background were removed so the device stands alone.",
    },
  },
];

export const WALLET_QUICK_PICKS = [
  { id: "start", brandSlug: "tangem" },
  { id: "premium", brandSlug: "ngrave" },
  { id: "airgap", brandSlug: "foundation" },
  { id: "euro", brandSlug: "trezor" },
] as const;

export type WalletQuickPickId = (typeof WALLET_QUICK_PICKS)[number]["id"];

export type WalletBrandShelf = {
  brand: WalletBrandProfile;
  models: WalletProduct[];
};

export function walletBrandShelves(input: {
  tier: WalletTier | "all";
  deviceType: WalletDeviceType | "all";
}): WalletBrandShelf[] {
  const grouped = new Map<WalletBrandSlug, WalletProduct[]>();
  for (const model of filterWalletProducts(input)) {
    const list = grouped.get(model.brandSlug) ?? [];
    list.push(model);
    grouped.set(model.brandSlug, list);
  }
  return WALLET_BRANDS.flatMap((brand) => {
    const models = grouped.get(brand.slug);
    if (!models || models.length === 0) return [];
    return [{ brand, models }];
  });
}

export function brandNeedsCheckoutNote(models: readonly WalletProduct[]): boolean {
  return models.some((model) => model.checkoutCodeRequired && !hasRealCheckoutCode(model));
}

// --- END lib/walletBrands.ts ---
