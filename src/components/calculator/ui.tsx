import { useId, type CSSProperties, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

/*
 * Widget primitives. Neutral graphite only — the widget is dropped onto client
 * sites we don't control, so the client's brand color is the only hue in it.
 */

function FieldLabel({ label, value, htmlFor }: { label: string; value?: ReactNode; htmlFor?: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <label htmlFor={htmlFor} className="text-sm font-[450] text-neutral-700">
        {label}
      </label>
      {value !== undefined && <span className="font-mono text-sm font-medium tabular-nums text-neutral-900">{value}</span>}
    </div>
  );
}

export function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format = String,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <FieldLabel label={label} value={format(value)} htmlFor={id} />
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ozm-range"
        style={{ '--fill': `${pct}%` } as CSSProperties}
      />
      <div className="mt-2 flex justify-between font-mono text-xs text-neutral-400">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

export interface Option<T extends string> {
  value: T;
  label: string;
  sub?: string;
}

const COLS = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
} as const;

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  columns = 3,
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  columns?: keyof typeof COLS;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-[450] text-neutral-700">{label}</legend>
      <div className={`grid gap-2 ${COLS[columns]}`}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={`min-h-12 rounded-[10px] border px-3 py-2 text-left transition-[border-color,background-color,box-shadow] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/20 ${
                active
                  ? 'border-brand bg-brand/[0.06] shadow-[inset_0_0_0_1px_rgb(var(--brand-rgb))]'
                  : 'border-neutral-300 bg-white hover:border-neutral-400'
              }`}
            >
              <span className="block text-sm font-[550] leading-5 text-neutral-900">{o.label}</span>
              {o.sub && <span className="block text-xs leading-4 text-neutral-500">{o.sub}</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Switch({
  id,
  checked,
  onChange,
  label,
  tone = 'brand',
}: {
  id?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  tone?: 'brand' | 'gold';
}) {
  const on = tone === 'brand' ? 'bg-brand' : 'bg-gold';
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/20 ${
        checked ? on : 'bg-neutral-300'
      }`}
    >
      <span
        className={`inline-block h-6 w-6 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 rounded-[10px] border border-neutral-300 bg-white px-4 py-3">
      <div className="min-w-0">
        <label htmlFor={id} className="block cursor-pointer text-sm font-[550] text-neutral-900">
          {label}
        </label>
        {description && <p className="text-xs leading-4 text-neutral-500">{description}</p>}
      </div>
      <Switch id={id} checked={checked} onChange={onChange} />
    </div>
  );
}

export function ResultPanel({
  eyebrow,
  primary,
  secondary,
  stats,
  footnote,
  ctaText,
  onCta,
}: {
  eyebrow: string;
  primary: string;
  secondary?: ReactNode;
  stats: { label: string; value: string }[];
  footnote?: string;
  ctaText: string;
  onCta: () => void;
}) {
  return (
    <div className="flex h-full flex-col rounded-xl bg-neutral-900 p-6 text-white">
      <p className="text-sm text-neutral-400">{eyebrow}</p>
      <p className="mt-2 text-[30px] font-semibold leading-9 tabular-nums tracking-[-0.025em]" aria-live="polite">
        {primary}
      </p>
      {secondary && <div className="mt-2 text-sm text-neutral-300">{secondary}</div>}
      <dl className="mt-6 space-y-3 border-t border-white/10 pt-6">
        {stats.map((s) => (
          <div key={s.label} className="flex items-baseline justify-between gap-4 text-sm">
            <dt className="text-neutral-400">{s.label}</dt>
            <dd className="text-right font-mono tabular-nums text-neutral-100">{s.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto pt-6">
        <button type="button" onClick={onCta} className="btn-brand w-full">
          {ctaText}
          <ArrowRight className="h-4 w-4" />
        </button>
        {footnote && <p className="mt-3 text-xs leading-4 text-neutral-500">{footnote}</p>}
      </div>
    </div>
  );
}

export function CalcLayout({ inputs, result }: { inputs: ReactNode; result: ReactNode }) {
  return (
    <div className="grid gap-6 md:grid-cols-5 md:gap-8">
      <div className="space-y-6 md:col-span-3">{inputs}</div>
      <div className="md:col-span-2">{result}</div>
    </div>
  );
}
