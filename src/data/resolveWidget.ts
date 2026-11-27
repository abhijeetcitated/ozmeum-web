import { CALCULATORS, CALCULATOR_TYPES } from '../calculators/meta';
import type { CalculatorType } from '../calculators/types';
import type { WidgetConfig } from '../components/calculator/CalculatorWidget';
import { normalizeHex } from '../lib/color';
import { getProspect, type Prospect } from './prospects';

export function prospectWidget(p: Prospect): WidgetConfig {
  return {
    type: p.calculatorType,
    brandName: p.clientName,
    primaryColor: normalizeHex(p.primaryColor),
    ctaText: p.ctaText ?? CALCULATORS[p.calculatorType].demoCta,
    cityMultiplier: p.cityMultiplier,
    webhookUrl: p.webhookUrl,
  };
}

/**
 * Resolves an /embed/:slug request.
 *  - Prospect slugs from src/data/prospects.ts
 *  - Generic demos: demo-roofing | demo-solar | demo-remodel | demo-medspa
 * Optional ?brand=&color=&cta= overrides (set by embed.js data-* attributes).
 * The webhook can never be overridden from the URL.
 */
export function resolveWidget(slug: string, params: URLSearchParams): WidgetConfig | null {
  let base: WidgetConfig | null = null;
  const p = getProspect(slug);
  if (p) {
    base = prospectWidget(p);
  } else {
    const t = slug.replace(/^demo-/, '') as CalculatorType;
    if (slug.startsWith('demo-') && CALCULATOR_TYPES.includes(t)) {
      const m = CALCULATORS[t];
      base = { type: t, brandName: m.demoBrand, primaryColor: m.demoColor, ctaText: m.demoCta };
    }
  }
  if (!base) return null;

  const brand = params.get('brand')?.trim().slice(0, 60);
  const cta = params.get('cta')?.trim().slice(0, 48);
  return {
    ...base,
    brandName: brand || base.brandName,
    primaryColor: normalizeHex(params.get('color'), base.primaryColor),
    ctaText: cta || base.ctaText,
  };
}
