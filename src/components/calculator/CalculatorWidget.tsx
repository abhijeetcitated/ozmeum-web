import { useState, type FormEvent, type InputHTMLAttributes } from 'react';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import RoofingCalculator from '../../calculators/RoofingCalculator';
import SolarCalculator from '../../calculators/SolarCalculator';
import RemodelCalculator from '../../calculators/RemodelCalculator';
import MedSpaCalculator from '../../calculators/MedSpaCalculator';
import { CALCULATORS } from '../../calculators/meta';
import type { CalculatorProps, CalculatorType, QuoteSummary } from '../../calculators/types';
import { brandVars } from '../../lib/color';
import { initials } from '../../lib/format';
import { sendLead } from '../../lib/leads';

const COMPONENTS: Record<CalculatorType, (p: CalculatorProps) => JSX.Element> = {
  roofing: RoofingCalculator,
  solar: SolarCalculator,
  remodel: RemodelCalculator,
  medspa: MedSpaCalculator,
};

export interface WidgetConfig {
  type: CalculatorType;
  brandName: string;
  primaryColor: string;
  ctaText: string;
  cityMultiplier?: number;
  /** Real lead destination. Empty → demo mode (nothing is sent anywhere). */
  webhookUrl?: string;
}

type Step = 'calc' | 'lead' | 'done';
const STEP_LABEL: Record<Step, string> = { calc: 'Estimate', lead: 'Your details', done: 'Sent' };

/**
 * The 100% white-label widget. Nothing in here may reference Ozmeum —
 * it renders identically inside the homepage demo, /p/:slug and /embed/:slug.
 */
export default function CalculatorWidget({ type, brandName, primaryColor, ctaText, cityMultiplier = 1, webhookUrl }: WidgetConfig) {
  const [step, setStep] = useState<Step>('calc');
  const [quote, setQuote] = useState<QuoteSummary | null>(null);
  const [firstName, setFirstName] = useState('');
  const [demo, setDemo] = useState(false);
  const meta = CALCULATORS[type];
  const Calc = COMPONENTS[type];
  const brand = brandName.trim() || 'Your brand';
  const cta = ctaText || meta.demoCta;

  return (
    <div style={brandVars(primaryColor)} className="overflow-hidden rounded-xl border border-neutral-200 bg-white text-left text-neutral-900">
      <div className="flex h-16 items-center gap-3 border-b border-neutral-900/[0.06] px-6">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand text-xs font-semibold text-brand-contrast">{initials(brand)}</div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-5">{brand}</p>
          <p className="truncate text-xs leading-4 text-neutral-500">{meta.title}</p>
        </div>
        <StepMeter step={step} />
      </div>

      <div className="p-6">
        <div hidden={step !== 'calc'}>
          <Calc
            multiplier={cityMultiplier}
            ctaText={cta}
            onQuote={(q) => {
              setQuote(q);
              setStep('lead');
            }}
          />
        </div>

        {step === 'lead' && quote && (
          <LeadForm
            quote={quote}
            ctaText={cta}
            brand={brand}
            onBack={() => setStep('calc')}
            onSubmit={async (lead) => {
              const res = await sendLead(webhookUrl, {
                ...lead,
                brand,
                calculator: meta.title,
                estimate: quote.estimate,
                details: Object.fromEntries(quote.details.map((d) => [d.label, d.value])),
              });
              setFirstName(lead.name.split(' ')[0] ?? '');
              setDemo(res.demo);
              setStep('done');
            }}
          />
        )}

        {step === 'done' && quote && (
          <div className="mx-auto max-w-md py-8 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand/10">
              <Check className="h-5 w-5 text-brand" />
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-[-0.01em]">Thanks{firstName ? `, ${firstName}` : ''}, your request is in</h3>
            <p className="mt-2 text-sm text-neutral-600">{brand} will call or email shortly to confirm your exact price.</p>
            <div className="mt-6 flex items-baseline justify-between gap-4 rounded-lg bg-neutral-100 px-4 py-3 text-sm">
              <span className="text-neutral-500">Your estimate</span>
              <span className="font-mono tabular-nums">{quote.estimate}</span>
            </div>
            {demo && <p className="mt-4 text-xs text-neutral-500">Preview mode. On the live site this lead goes straight to {brand}'s CRM.</p>}
            <button
              type="button"
              onClick={() => setStep('calc')}
              className="mt-6 inline-flex h-9 items-center rounded-lg border border-neutral-900/10 px-4 text-sm font-medium transition-colors hover:bg-neutral-50"
            >
              Run another estimate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StepMeter({ step }: { step: Step }) {
  const idx = step === 'calc' ? 0 : step === 'lead' ? 1 : 2;
  return (
    <div className="flex items-center gap-2" aria-label={`Step ${idx + 1} of 3: ${STEP_LABEL[step]}`}>
      <span className="hidden font-mono text-xs text-neutral-500 sm:inline">{idx + 1}/3</span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`h-1 w-4 rounded-full transition-colors ${i <= idx ? 'bg-brand' : 'bg-neutral-200'}`} />
        ))}
      </div>
    </div>
  );
}

interface LeadFields {
  name: string;
  email: string;
  phone: string;
  zip: string;
}

function LeadForm({
  quote,
  ctaText,
  brand,
  onBack,
  onSubmit,
}: {
  quote: QuoteSummary;
  ctaText: string;
  brand: string;
  onBack: () => void;
  onSubmit: (f: LeadFields) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get('company_website')) return; // honeypot
    setBusy(true);
    setError('');
    try {
      await onSubmit({
        name: String(fd.get('name') ?? '').trim(),
        email: String(fd.get('email') ?? '').trim(),
        phone: String(fd.get('phone') ?? '').trim(),
        zip: String(fd.get('zip') ?? '').trim(),
      });
    } catch {
      setError('That didn’t go through. Check your connection and try again.');
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-5 md:gap-8">
      <div className="md:col-span-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-8 items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" /> Adjust estimate
        </button>
        <div className="mt-4 rounded-xl bg-neutral-900 p-6 text-white">
          <p className="text-sm text-neutral-400">Your estimate</p>
          <p className="mt-2 text-xl font-medium leading-7 tabular-nums">{quote.estimate}</p>
          <dl className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
            {quote.details.map((d) => (
              <div key={d.label} className="flex justify-between gap-4">
                <dt className="text-neutral-400">{d.label}</dt>
                <dd className="text-right text-neutral-100">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <form onSubmit={handle} className="md:col-span-3">
        <h3 className="text-lg font-semibold tracking-[-0.01em]">Where should we send your exact quote?</h3>
        <p className="mt-1 text-sm text-neutral-500">Four fields, no obligation</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input name="name" label="Full name" autoComplete="name" required className="sm:col-span-2" />
          <Input name="email" label="Email" type="email" autoComplete="email" required />
          <Input name="phone" label="Phone" type="tel" autoComplete="tel" required pattern="[\d\s\(\)\+\.\-]{7,}" />
          <Input name="zip" label="ZIP code" autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{5}" required className="sm:col-span-2" />
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={busy} className="btn-brand mt-6 w-full">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {busy ? 'Sending' : ctaText}
        </button>
        <p className="mt-3 text-xs leading-4 text-neutral-500">
          By submitting, you agree that {brand} may contact you by phone, text or email about this request. Consent is not a condition of purchase.
        </p>
      </form>
    </div>
  );
}

function Input({ label, className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-[450] text-neutral-700">{label}</span>
      <input {...props} className="w-input" />
    </label>
  );
}
