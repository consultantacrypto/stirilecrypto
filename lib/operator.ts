/**
 * Operator identity published on /despre and in the footer.
 * Tax id is intentionally unpublished: the em dash is not a CUI or EIN.
 */
export const SITE_OPERATOR = {
  name: 'QuickExit, LLC (Delaware)',
  legalName: 'QuickExit, LLC',
  address: '131 Continental Dr, Suite 305, Newark, DE 19713, US',
  streetAddress: '131 Continental Dr, Suite 305',
  addressLocality: 'Newark',
  addressRegion: 'DE',
  postalCode: '19713',
  addressCountry: 'US',
  taxIdLabel: 'CUI / EIN',
  taxId: '—',
  email: 'contact@stirilecrypto.ro',
} as const;
