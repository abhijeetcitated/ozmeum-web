import { ArrowRight, Lock } from 'lucide-react';
import { useClaim } from '../components/claim/ClaimContext';
import { LedgerLine } from '../components/Ledger';
import { SITE } from '../config';

export default function Hero() {
  const { openClaim } = useClaim();
  return (
    <section className="border-b border-white/[0.08]">
      <div className="container-x grid grid-cols-1 items-center gap-16 pb-20 pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-12 lg:pb-24 lg:pt-24">
        <div>
          <h1 className="text-balance text-[40px] font-semibold leading-[1.04] tracking-[-0.035em] text-fg sm:text-[52px] lg:text-[60px]">
            White-label cost calculators that turn your clients’ SEO traffic into leads
          </h1>
          <p className="mt-6 max-w-[34rem] text-pretty text-[18px] leading-[30px] text-fg-2">
            Built and handed over in 48 hours for a flat ${SITE.price}, with no Ozmeum branding. Resell it to roofing, solar, remodeling or
            medspa clients for $1,000–$1,500, and pay only after you approve the live staging link.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => openClaim({ source: 'hero' })} className="btn-primary">
              Request a staging link <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#demo" className="btn-secondary">
              Try the live demo
            </a>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

/**
 * The moment: a client's calculator on a staging link, with the $249 invoice
 * slip pinned to it — the whole offer (built for you, paid after approval) in one picture.
 * Figures match /p/apex-roofing-dallas at its default inputs.
 */
function HeroVisual() {
  const roof = { brand: '#c2410c' };
  return (
    <div className="relative min-w-0 pb-36 sm:pb-36" aria-label="Example: a roofing client's cost calculator on a staging link, with a $249 invoice due after approval" role="img">
      {/* Staging window */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-canvas-1 shadow-float" aria-hidden="true">
        <div className="flex h-10 items-center gap-4 border-b border-white/[0.08] px-4">
          <div className="flex gap-2">
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
          </div>
          <div className="flex h-6 min-w-0 flex-1 items-center gap-2 rounded-md bg-canvas-2 px-3 font-mono text-xs text-fg-3">
            <Lock className="h-3 w-3 shrink-0" />
            <span className="truncate">staging.apexroofingdallas.com/roof-replacement-cost</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg text-xs font-semibold text-white" style={{ background: roof.brand }}>
              AR
            </span>
            <div>
              <p className="text-sm font-medium leading-5 text-neutral-900">Apex Roofing Dallas</p>
              <p className="text-xs leading-4 text-neutral-500">Roof replacement cost estimator</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_1.1fr]">
            <div className="hidden space-y-4 sm:block">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Roof area</span>
                  <span className="font-mono text-neutral-900">2,200 sq ft</span>
                </div>
                <div className="relative mt-3 h-1.5 rounded-full bg-neutral-200">
                  <div className="absolute inset-y-0 left-0 w-[30%] rounded-full" style={{ background: roof.brand }} />
                  <div className="absolute left-[30%] top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.2)]" style={{ background: roof.brand }} />
                </div>
              </div>
              <MockChoice label="Pitch" options={['Low', 'Medium', 'Steep']} active={1} color={roof.brand} />
              <MockChoice label="Material" options={['Asphalt', 'Metal', 'Tile']} active={0} color={roof.brand} />
            </div>

            <div className="rounded-xl bg-neutral-900 p-5 text-white">
              <p className="text-xs text-neutral-400">Estimated installed price</p>
              <p className="mt-2 text-[22px] font-semibold leading-7 tracking-[-0.01em] tabular-nums">$13,700 – $21,300</p>
              <p className="mt-1 text-xs text-neutral-400">Asphalt · medium pitch · tear-off</p>
              <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Price per square</span>
                  <span className="font-mono">$565 – $882</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Install time</span>
                  <span className="font-mono">1–2 days</span>
                </div>
              </div>
              <div className="mt-4 flex h-9 items-center justify-center rounded-lg text-sm font-medium" style={{ background: roof.brand }}>
                Get my free roof inspection
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice slip pinned over the corner */}
      <div
        className="absolute -bottom-2 left-4 w-[288px] -rotate-2 rounded-lg bg-[#fafaf8] text-neutral-900 shadow-paper sm:-left-8 sm:bottom-0 sm:w-[328px]"
        aria-hidden="true"
      >
        <div className="px-5 pb-5 pt-4 text-[13px] leading-6">
          <div className="flex items-baseline justify-between border-b border-dashed border-neutral-300 pb-3">
            <span className="font-semibold">Invoice 0148</span>
            <span className="font-mono text-xs text-neutral-500">to Northstar SEO</span>
          </div>
          <div className="mt-3 space-y-1">
            <LedgerLine tone="paper" label="Roof calculator, white-label" value="$249" />
            <LedgerLine tone="paper" label="Leads to GoHighLevel" value="incl." />
            <LedgerLine tone="paper" label="Due" value="after approval" strong accent />
          </div>
        </div>
        <span className="absolute -right-4 -top-4 rotate-[8deg] rounded-md border-2 border-gold-ink bg-[#fafaf8] px-2 py-0.5 font-mono text-xs font-semibold text-gold-ink shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
          Staging approved
        </span>
      </div>
    </div>
  );
}

function MockChoice({ label, options, active, color }: { label: string; options: string[]; active: number; color: string }) {
  return (
    <div>
      <p className="text-sm text-neutral-600">{label}</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {options.map((o, i) => (
          <span
            key={o}
            className="flex h-8 items-center rounded-lg border px-2 text-xs font-medium text-neutral-900"
            style={i === active ? { borderColor: color, boxShadow: `inset 0 0 0 1px ${color}`, background: `${color}0d` } : { borderColor: 'rgba(23,23,23,0.1)' }}
          >
            {o}
          </span>
        ))}
      </div>
    </div>
  );
}
