import { SITE } from '../config';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Builds the 1-line embed snippet an agency pastes into WordPress / Webflow / GHL / Wix / Shopify. */
export function embedSnippet(slug: string, overrides?: { brand?: string; color?: string; cta?: string }): string {
  const attrs = [`data-ozmeum="${esc(slug)}"`];
  if (overrides?.brand) attrs.push(`data-brand="${esc(overrides.brand)}"`);
  if (overrides?.color) attrs.push(`data-color="${esc(overrides.color)}"`);
  if (overrides?.cta) attrs.push(`data-cta="${esc(overrides.cta)}"`);
  return `<div ${attrs.join(' ')}></div><script async src="${SITE.url}/embed.js"></script>`;
}
