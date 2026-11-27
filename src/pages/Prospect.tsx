import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Eye, Link2 } from 'lucide-react';
import BrowserFrame from '../components/BrowserFrame';
import EmbedCodeBox from '../components/EmbedCodeBox';
import { LedgerLine } from '../components/Ledger';
import Logo from '../components/Logo';
import CalculatorWidget from '../components/calculator/CalculatorWidget';
import { Switch } from '../components/calculator/ui';
import { useClaim } from '../components/claim/ClaimContext';
import { CALCULATORS } from '../calculators/meta';
import type { CalculatorType } from '../calculators/types';
import { AGENCY_MATH, SITE } from '../config';
import { getProspect, type Prospect as ProspectT } from '../data/prospects';
import { prospectWidget } from '../data/resolveWidget';
import { brandVars } from '../lib/color';
import { copyText } from '../lib/clipboard';
import { embedSnippet } from '../lib/embed';
import { initials, num, usd } from '../lib/format';
import { usePageMeta } from '../lib/usePageMeta';
import NotFound from './NotFound';

const PAGE_PATH: Record<CalculatorType, string> = {
  roofing: 'roof-replacement-cost',
  solar: 'solar-savings-calculator',
  remodel: 'remodel-cost-calculator',
  medspa: 'treatment-cost-calculator',
};
const AUDIENCE: Record<CalculatorType, string> = { roofing: 'homeowner', solar: 'homeowner', remodel: 'homeowner', medspa: 'patient' };

// Lead-math assumptions, shown openly in Agency View
const TOP3_CTR = 0.08;
const COMPLETION = 0.12;

export default function Prospect() {
  const { slug } = useParams();
  const p = getProspect(slug);
  const [params, setParams] = useSearchParams();
  const clientView = params.get('view') === 'client';

  usePageMeta(
    p ? (clientView ? `${p.clientName} — Instant estimate preview` : `${p.clientName} · Private demo for ${p.agencyName}`) : 'Demo not found',
    true,
  );

  if (!p) return <NotFound message="This demo link doesn’t exist, or it has been retired." />;

  const setClientView = (on: boolean) => {
    const next = new URLSearchParams(params);
    if (on) next.set('view', 'client');
    else next.delete('view');
    setParams(next, { replace: true });
    window.scrollTo({ top: 0 });
  };

  return clientView ? <ClientView p={p} onExit={() => setClientView(false)} /> : <AgencyView p={p} onClientView={() => setClientView(true)} />;
}

/* ───────────────────────────── Agency View ───────────────────────────── */

function AgencyView({ p, onClientView }: { p: ProspectT; onClientView: () => void }) {
  const { openClaim } = useClaim();
  const [linkCopied, setLinkCopied] = useState(false);
  const widget = prospectWidget(p);
  const meta = CALCULATORS[p.calculatorType];
  const clicks = Math.round(p.monthlySearches * TOP3_CTR);
  const leads = Math.max(1, Math.round(clicks * COMPLETION));
  const dayOne = AGENCY_MATH.setupCharge - SITE.price;
  const deployLabel = `Deploy this live for ${p.clientName} in 48h — ${usd(SITE.price)}, pay after staging`;

  const deploy = () =>
    openClaim({
      source: `prospect:${p.slug}`,
      agencyName: p.agencyName,
      clientWebsite: p.clientWebsite,
      calculatorType: p.calculatorType,
      notes: `Deploy for ${p.clientName} (${p.clientWebsite}). Keyword: "${p.targetKeyword}".`,
    });

  const copyClientLink = async () => {
    if (await copyText(`${window.location.origin}/p/${p.slug}?view=client`)) {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1800);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Agency pitch bar */}
      <div className="sticky top-0 z-50 border-b border-white/[0.08] bg-canvas-1/90 text-fg backdrop-blur">
        <div className="container-x flex min-h-14 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
          <div className="flex min-w-0 items-center gap-4">
            <Logo />
            <p className="hidden truncate text-sm text-fg-2 sm:block">
              Private demo for <span className="text-fg">{p.agencyName}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyClientLink}
              className="hidden h-8 items-center gap-2 rounded-md px-3 text-sm text-fg-2 transition-colors hover:bg-white/10 hover:text-fg md:inline-flex"
            >
              {linkCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
              {linkCopied ? 'Copied' : 'Copy client-safe link'}
            </button>
            <label className="flex h-9 cursor-pointer items-center gap-3 rounded-lg bg-white/[0.08] pl-3 pr-2 text-sm">
              Switch to client-safe view
              <Switch checked={false} onChange={onClientView} tone="gold" label="Switch to client-safe view" />
            </label>
          </div>
        </div>
      </div>

      <main className="container-x py-16 sm:py-20">
        <div className="max-w-3xl">
          <p className="text-sm text-fg-3">Prepared for {p.agencyName}</p>
          <h1 className="mt-3 text-balance text-[36px] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-[52px]">
            The instant-quote calculator {p.clientName} is missing
          </h1>
          <p className="mt-6 max-w-[40rem] text-pretty text-[18px] leading-7 text-fg-2">
            Built for {p.clientWebsite}
            {p.city ? ` in ${p.city}` : ''}, with their branding, their button text and local pricing, and leads routed straight to their CRM.
            Ready for {p.agencyName} to resell in 48 hours.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-canvas-1 p-6">
            <p className="text-sm text-fg-3">Keyword opportunity</p>
            <p className="mt-2 text-[17px] font-semibold leading-6 tracking-[-0.01em] text-fg">“{p.targetKeyword}”</p>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Monthly searches" value={num(p.monthlySearches)} strong />
              <Row label={`Clicks in the top 3, ~${TOP3_CTR * 100}% CTR`} value={`~${num(clicks)}/mo`} />
              <Row label={`Leads, ~${COMPLETION * 100}% complete it`} value={`~${num(leads)}/mo`} strong />
            </dl>
            <p className="mt-4 text-xs text-fg-3">A rough guide. Click-through and completion rates vary with ranking and offer.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-canvas-1 p-6">
            <p className="text-sm text-fg-3">Where competitors fall short</p>
            <p className="mt-2 text-[15px] leading-6 text-fg-2">{p.competitorNote}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-canvas-1 p-6 md:col-span-2 lg:col-span-1">
            <p className="text-sm text-fg-3">Deploy for {p.clientName}</p>
            <div className="mt-4 space-y-2 text-sm">
              <LedgerLine label="Built and live on staging" value="48 hours" />
              <LedgerLine label="Your cost, after approval" value={usd(SITE.price)} />
              <LedgerLine label={`Resell at ${usd(AGENCY_MATH.setupCharge)}, margin`} value={usd(dayOne)} strong accent />
            </div>
            <button type="button" onClick={deploy} className="btn-primary mt-6 h-auto w-full py-3 text-left leading-5">
              {deployLabel}
            </button>
          </div>
        </div>

        <div className="mt-8">
          <BrowserFrame url={`${p.clientWebsite}/${PAGE_PATH[p.calculatorType]}`}>
            <CalculatorWidget {...widget} />
          </BrowserFrame>
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-5 lg:items-start">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold tracking-[-0.015em]">How to pitch it</h2>
            <ol className="mt-4 space-y-3 text-[15px] leading-6 text-fg-2">
              <li className="flex gap-3">
                <span className="font-mono text-sm text-fg-3">01</span>
                <span>Turn on client-safe view in the bar above and share your screen. Ozmeum and our pricing disappear.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-sm text-fg-3">02</span>
                <span>
                  Let {p.clientName} try it the way a {AUDIENCE[p.calculatorType]} would.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-sm text-fg-3">03</span>
                <span>Quote your price. Once they say yes, request staging. This line goes on their site:</span>
              </li>
            </ol>
          </div>
          <div className="lg:col-span-3">
            <EmbedCodeBox
              code={embedSnippet(p.slug)}
              note={`Works on ${p.clientWebsite} as soon as it’s pasted. The ${meta.title.toLowerCase()} loads lazily and sizes itself.`}
            />
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 rounded-2xl border border-white/10 bg-canvas-1 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[28px] font-semibold leading-9 tracking-[-0.02em] text-fg [overflow-wrap:anywhere]">Ready to put this on {p.clientWebsite}?</h2>
            <p className="mt-2 max-w-xl text-[15px] leading-6 text-fg-2">Staging link in 48 hours. The invoice only comes after you approve it.</p>
          </div>
          <button type="button" onClick={deploy} className="btn-primary h-auto shrink-0 py-3 text-left leading-5 lg:max-w-sm">
            {deployLabel} <ArrowRight className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </main>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-fg-2">{label}</dt>
      <dd className={`text-right font-mono tabular-nums ${strong ? 'font-medium text-fg' : 'text-fg-2'}`}>{value}</dd>
    </div>
  );
}

/* ──────────────────────── Client-safe view (zero Ozmeum) ──────────────────────── */

function ClientView({ p, onExit }: { p: ProspectT; onExit: () => void }) {
  const widget = prospectWidget(p);
  const audience = AUDIENCE[p.calculatorType];
  const POINTS = [
    { title: 'Answers the price question at 11pm', body: `Every ${audience} gets a realistic number on the spot, instead of leaving to “think about it”.` },
    { title: 'Leads arrive with the details', body: 'Name, phone and email, plus every answer and the estimate they saw, straight into your CRM.' },
    { title: 'Your brand and your prices', body: `${p.clientName}'s colors and local pricing, so the estimate lines up with what you quote.` },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900" style={brandVars(widget.primaryColor)}>
      <header className="border-b border-neutral-900/[0.08] bg-white">
        <div className="container-x flex h-16 items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-xs font-semibold text-brand-contrast">{initials(p.clientName)}</span>
          <span className="font-medium">{p.clientName}</span>
          <span className="ml-auto text-sm text-neutral-500">Preview</span>
        </div>
      </header>

      <main className="container-x py-16">
        <div className="max-w-3xl">
          <h1 className="text-balance text-[36px] font-medium leading-[1.08] tracking-[-0.02em] [overflow-wrap:anywhere] sm:text-[44px]">
            Instant estimates for everyone who lands on {p.clientWebsite}
          </h1>
          <p className="mt-4 text-[18px] leading-7 text-neutral-600">Try it the way a {audience} would, then see the lead it creates.</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-neutral-900/10 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
          <div className="flex h-10 items-center gap-4 border-b border-neutral-900/[0.08] px-4">
            <div className="flex gap-2" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-neutral-300" />
              <span className="h-2 w-2 rounded-full bg-neutral-300" />
              <span className="h-2 w-2 rounded-full bg-neutral-300" />
            </div>
            <span className="truncate font-mono text-xs text-neutral-500">
              {p.clientWebsite}/{PAGE_PATH[p.calculatorType]}
            </span>
          </div>
          <div className="bg-neutral-100/60 p-4 sm:p-6">
            <CalculatorWidget {...widget} />
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-t border-neutral-900/10 pt-8 sm:grid-cols-3">
          {POINTS.map((b) => (
            <div key={b.title}>
              <h3 className="text-[17px] font-semibold leading-6 tracking-[-0.01em]">{b.title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-neutral-600">{b.body}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Discreet exit — no text, no branding visible during screen-share */}
      <button
        type="button"
        onClick={onExit}
        title="Back to agency view"
        aria-label="Back to agency view"
        className="fixed bottom-4 left-4 z-50 grid h-8 w-8 place-items-center rounded-full border border-neutral-900/10 bg-white text-neutral-400 opacity-40 transition-opacity hover:opacity-100 focus-visible:opacity-100"
      >
        <Eye className="h-4 w-4" />
      </button>
    </div>
  );
}
