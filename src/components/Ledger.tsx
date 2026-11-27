import type { ReactNode } from 'react';

/**
 * Signature detail: a quote-sheet line with a dotted leader and a mono figure.
 *   Setup ........................ $1,200
 * Used only where money is itemized (hero invoice slip, margin sheet, deploy card).
 */
export function LedgerLine({
  label,
  value,
  strong = false,
  accent = false,
  tone = 'dark',
}: {
  label: ReactNode;
  value: ReactNode;
  strong?: boolean;
  accent?: boolean;
  /** 'dark' = on the graphite page, 'paper' = on a white paper object */
  tone?: 'dark' | 'paper';
}) {
  const c =
    tone === 'paper'
      ? { label: strong ? 'text-neutral-900' : 'text-neutral-600', value: 'text-neutral-900', accent: 'text-gold-ink' }
      : { label: strong ? 'text-fg' : 'text-fg-2', value: 'text-fg', accent: 'text-gold' };
  return (
    <div className="flex items-baseline gap-2">
      <span className={c.label}>{label}</span>
      <span className={`leader ${c.label}`} aria-hidden="true" />
      <span className={`font-mono tabular-nums ${accent ? `font-medium ${c.accent}` : `${strong ? 'font-medium' : ''} ${c.value}`}`}>{value}</span>
    </div>
  );
}
