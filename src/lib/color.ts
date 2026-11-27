import type { CSSProperties } from 'react';

const HEX6 = /^#[0-9a-f]{6}$/i;
const HEX3 = /^#[0-9a-f]{3}$/i;

/** Returns a safe #rrggbb string, or the fallback if input is invalid. */
export function normalizeHex(input: string | null | undefined, fallback = '#4f46e5'): string {
  if (!input) return fallback;
  let v = input.trim();
  if (!v.startsWith('#')) v = `#${v}`;
  if (HEX3.test(v)) v = `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  return HEX6.test(v) ? v.toLowerCase() : fallback;
}

function toRgb(hex: string): [number, number, number] {
  const h = normalizeHex(hex).slice(1);
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function luminance([r, g, b]: [number, number, number]) {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Picks white or slate-900 text — whichever has higher WCAG contrast on the accent. */
export function contrastRgb(hex: string): string {
  const L = luminance(toRgb(hex));
  const onWhite = 1.05 / (L + 0.05);
  const onDark = (L + 0.05) / (0.0175 + 0.05); // slate-900 luminance ≈ 0.0175
  return onWhite >= onDark ? '255 255 255' : '15 23 42';
}

/** Inline CSS variables that re-theme every `brand` utility inside the element. */
export function brandVars(hex: string): CSSProperties {
  const c = normalizeHex(hex);
  return {
    '--brand-rgb': toRgb(c).join(' '),
    '--brand-contrast-rgb': contrastRgb(c),
  } as CSSProperties;
}
