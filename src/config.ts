export const SITE = {
  name: 'Ozmeum',
  /** Production origin — used in embed snippets shown to agencies. */
  url: 'https://ozmeum.com',
  price: 249,
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'hello@ozmeum.com',
  /** Public Web3Forms access key (safe to expose client-side). Empty = mailto fallback. */
  web3formsKey: import.meta.env.VITE_WEB3FORMS_KEY || '',
} as const;

/** Typical agency resale pricing used in the margin math. */
export const AGENCY_MATH = {
  setupCharge: 1200,
  monthlyRetainer: 99,
} as const;
