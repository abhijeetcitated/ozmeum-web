const usdFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const numFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

export const usd = (n: number) => usdFmt.format(Math.round(n));
export const num = (n: number) => numFmt.format(n);
export const roundTo = (n: number, step: number) => Math.round(n / step) * step;
export const usdRange = (low: number, high: number, step = 100) =>
  `${usd(roundTo(low, step))} – ${usd(roundTo(high, step))}`;

/** Standard amortized monthly payment. */
export function monthlyPayment(principal: number, aprPct: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = aprPct / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

export function slugify(s: string): string {
  const out = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return out || 'yourclient';
}

export function initials(s: string): string {
  const out = s
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
  return out || 'A';
}
