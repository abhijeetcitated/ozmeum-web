/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Geist Variable"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"Geist Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        // Graphite ramp — the late-night pitch desk
        canvas: {
          DEFAULT: '#0f0f10', // page
          1: '#161618', // card
          2: '#1f1f22', // raised: inputs, active rows
          3: '#2a2a2e', // hover on raised
        },
        fg: {
          DEFAULT: '#ededed', // primary text
          2: '#a1a1a6', // secondary text
          3: '#85858b', // muted text & icons
        },
        // One accent: gold, for money that's been agreed (margins, the $249, the approval stamp)
        gold: {
          DEFAULT: '#e5b454',
          ink: '#94670f', // gold as text on light paper (contrast-safe)
        },
        // White-label accent, driven by CSS variables set per widget (see src/lib/color.ts)
        brand: {
          DEFAULT: 'rgb(var(--brand-rgb) / <alpha-value>)',
          contrast: 'rgb(var(--brand-contrast-rgb) / <alpha-value>)',
        },
      },
      boxShadow: {
        // Neutral only — for objects floating over the page
        float: '0 24px 48px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        paper: '0 16px 32px -8px rgba(0, 0, 0, 0.55)',
        btn: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
};
