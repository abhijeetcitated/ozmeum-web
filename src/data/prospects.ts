import type { CalculatorType } from '../calculators/types';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  TROJAN HORSE PROSPECT ENGINE
 *  Add one object below → instantly live at  /p/<slug>  and  /embed/<slug>
 *  Full guide: HOW_TO_ADD_PROSPECT.md
 *
 *  ⚠️  This file ships inside the public JS bundle. Never put passwords,
 *      private API keys, or anything confidential here.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export interface Prospect {
  /** URL id → /p/<slug>. lowercase-with-dashes only. */
  slug: string;
  /** The agency you are pitching (only shown in Agency View). */
  agencyName: string;
  /** The agency's end client — shown on the calculator itself. */
  clientName: string;
  /** Client domain, without https:// (e.g. "apexroofingdallas.com"). */
  clientWebsite: string;
  calculatorType: CalculatorType;
  /** Client brand color, #rrggbb. */
  primaryColor: string;
  /** Local price index vs US average. 1 = national avg, 1.15 = 15% pricier market. */
  cityMultiplier: number;
  /** The keyword this calculator page should rank for. */
  targetKeyword: string;
  /** Monthly US search volume for targetKeyword (from Ahrefs / Semrush / GKP). */
  monthlySearches: number;
  /** One-line observation about the client's competitors (Agency View only). */
  competitorNote: string;

  // ── Optional ──────────────────────────────────────────────────────────────
  /** Button text on the calculator. Defaults to the industry default. */
  ctaText?: string;
  /** e.g. "Dallas, TX" — shown in the pitch copy. */
  city?: string;
  /** If set, real leads POST here (GHL / Zapier / Make / HubSpot webhook). Leave empty for demo mode. */
  webhookUrl?: string;
}

export const prospects: Prospect[] = [
  {
    // SAMPLE — replace keyword volume & competitor note with your own research
    slug: 'apex-roofing-dallas',
    agencyName: 'Northstar SEO Partners',
    clientName: 'Apex Roofing Dallas',
    clientWebsite: 'apexroofingdallas.com',
    calculatorType: 'roofing',
    primaryColor: '#c2410c',
    cityMultiplier: 0.96,
    targetKeyword: 'roof replacement cost dallas',
    monthlySearches: 1900,
    competitorNote:
      'None of the top 5 map-pack roofers in Dallas offer an instant estimate — searchers bounce to national cost guides instead of booking.',
    ctaText: 'Get my free roof inspection',
    city: 'Dallas, TX',
  },
  {
    // SAMPLE — replace keyword volume & competitor note with your own research
    slug: 'lumina-dental-austin',
    agencyName: 'Brightline Digital',
    clientName: 'Lumina Dental Austin',
    clientWebsite: 'luminadentalaustin.com',
    calculatorType: 'medspa',
    primaryColor: '#0e7490',
    cityMultiplier: 1.06,
    targetKeyword: 'dental implants cost austin',
    monthlySearches: 1300,
    competitorNote:
      'Competing Austin practices say "call for pricing" — a transparent price + monthly payment view is a clear differentiator for high-intent searchers.',
    ctaText: 'Check my monthly payment',
    city: 'Austin, TX',
  },
];

export function getProspect(slug: string | undefined): Prospect | undefined {
  if (!slug) return undefined;
  return prospects.find((p) => p.slug === slug.toLowerCase());
}
