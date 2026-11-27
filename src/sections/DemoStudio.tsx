import { useState } from 'react';
import { Check, Code2, RotateCcw } from 'lucide-react';
import BrowserFrame from '../components/BrowserFrame';
import EmbedCodeBox from '../components/EmbedCodeBox';
import CalculatorWidget from '../components/calculator/CalculatorWidget';
import { CALCULATORS, CALCULATOR_TYPES } from '../calculators/meta';
import type { CalculatorType } from '../calculators/types';
import { copyText } from '../lib/clipboard';
import { normalizeHex } from '../lib/color';
import { embedSnippet } from '../lib/embed';
import { slugify } from '../lib/format';

const SWATCHES = ['#c2410c', '#0f766e', '#2563eb', '#be123c', '#7c3aed', '#171717'];

export default function DemoStudio() {
  const [type, setType] = useState<CalculatorType>('roofing');
  // null = follow the industry default; once edited, the agency's choice sticks across tabs
  const [brand, setBrand] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [cta, setCta] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const meta = CALCULATORS[type];
  const eff = {
    brand: brand ?? meta.demoBrand,
    color: normalizeHex(color ?? meta.demoColor),
    cta: cta ?? meta.demoCta,
  };
  const code = embedSnippet(`demo-${type}`, { brand: eff.brand, color: eff.color, cta: eff.cta });
  const customized = brand !== null || color !== null || cta !== null;

  const copy = async () => {
    if (await copyText(code)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <section id="demo" className="scroll-mt-16 py-24 sm:py-32">
      <div className="container-x">
        <div className="max-w-2xl">
          <h2 className="section-title">Try it the way your client’s customers will</h2>
          <p className="section-lede">
            Real math and current US pricing, with a lead form at the end. Change the brand below and the widget restyles as you type. This
            is what ships.
          </p>
        </div>

        {/* White-label settings */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-canvas-1 p-4 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
            <label className="block lg:col-span-3">
              <span className="label">Brand name</span>
              <input value={eff.brand} onChange={(e) => setBrand(e.target.value)} maxLength={48} className="input" />
            </label>

            <div className="lg:col-span-3">
              <span className="label">Accent color</span>
              <div className="flex h-10 items-center gap-2">
                <label className="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-white/10" style={{ background: eff.color }}>
                  <input
                    type="color"
                    value={eff.color}
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label="Pick any accent color"
                  />
                </label>
                <div className="flex gap-1">
                  {SWATCHES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setColor(s)}
                      className="grid h-6 w-6 place-items-center rounded-md shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
                      style={{ background: s }}
                      aria-label={`Use ${s}`}
                    >
                      {eff.color === s && <Check className="h-4 w-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className="block lg:col-span-3">
              <span className="label">Button text</span>
              <input value={eff.cta} onChange={(e) => setCta(e.target.value)} maxLength={40} className="input" />
            </label>

            <div className="flex gap-2 lg:col-span-3">
              <button type="button" onClick={copy} className="btn-primary h-10 flex-1 whitespace-nowrap px-4 text-sm">
                {copied ? <Check className="h-4 w-4" /> : <Code2 className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy 1-line embed code'}
              </button>
              {customized && (
                <button
                  type="button"
                  onClick={() => {
                    setBrand(null);
                    setColor(null);
                    setCta(null);
                  }}
                  className="btn-secondary h-10 w-10 px-0"
                  aria-label="Reset to defaults"
                  title="Reset"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Industry tabs */}
        <div className="mt-8 flex gap-1 overflow-x-auto border-b border-white/10" role="tablist" aria-label="Industry">
          {CALCULATOR_TYPES.map((t) => {
            const M = CALCULATORS[t];
            const active = t === type;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setType(t)}
                className={`-mb-px inline-flex h-11 shrink-0 items-center gap-2 border-b-2 px-4 text-[15px] transition-colors ${
                  active ? 'border-ink text-fg' : 'border-transparent text-fg-3 hover:text-fg'
                }`}
              >
                <M.icon className="h-4 w-4" /> {M.tab}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <BrowserFrame url={`www.${slugify(eff.brand).replace(/-/g, '')}.com/${type}-cost-calculator`}>
            <CalculatorWidget key={type} type={type} brandName={eff.brand} primaryColor={eff.color} ctaText={eff.cta} />
          </BrowserFrame>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-5 lg:items-start">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold tracking-[-0.015em]">One line of HTML on any site</h3>
            <p className="mt-3 text-[15px] leading-6 text-fg-2">
              A 1 KB async loader adds a lazy-loaded iframe that sizes itself to the calculator. No plugin, no theme edits and no clash with
              your client’s CSS.
            </p>
            <p className="mt-3 text-[15px] leading-6 text-fg-2">Every build also comes with the full source code if you’d rather host it on the client’s domain.</p>
          </div>
          <div className="lg:col-span-3">
            <EmbedCodeBox code={code} note="This snippet works now and follows your settings above. The client’s own slug is set at handover." />
          </div>
        </div>
      </div>
    </section>
  );
}
