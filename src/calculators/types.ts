export type CalculatorType = 'roofing' | 'solar' | 'remodel' | 'medspa';

export interface QuoteSummary {
  /** Headline estimate, e.g. "$14,200 – $19,800" */
  estimate: string;
  /** Inputs + outputs that travel with the lead to the client's CRM. */
  details: { label: string; value: string }[];
}

export interface CalculatorProps {
  /** Local price index (1 = US national average). */
  multiplier: number;
  ctaText: string;
  onQuote: (q: QuoteSummary) => void;
}
