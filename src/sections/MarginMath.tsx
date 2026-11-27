import { useState } from 'react';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import { useClaim } from '../components/claim/ClaimContext';
import { LedgerLine } from '../components/Ledger';
import { AGENCY_MATH, SITE } from '../config';
import { usd } from '../lib/format';

export default function MarginMath() {
  const { openClaim } = useClaim();
  const [clients, setClients] = useState(3);
  const { setupCharge, monthlyRetainer } = AGENCY_MATH;
  const dayOne = setupCharge - SITE.price;
  const retainerYear = monthlyRetainer * 12;
  const yearOne = dayOne + retainerYear;

  return (
    <section id="margin" className="scroll-mt-16 border-y border-white/[0.08] bg-canvas-1 py-24 sm:py-32">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
        <div>
          <h2 className="section-title">One client covers the cost four times over</h2>
          <p className="section-lede">
            You pay ${SITE.price} once. A typical agency charges the client {usd(setupCharge)} to set up a lead calculator and {usd(monthlyRetainer)} a
            month to look after it. The difference is yours.
          </p>
          <button type="button" onClick={() => openClaim({ source: 'margin-math' })} className="btn-primary mt-8">
            Start with one client <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Quote sheet */}
        <div className="rounded-2xl border border-white/10 bg-canvas-1 p-6 shadow-float sm:p-8">
          <div className="grid grid-cols-2 gap-6 border-b border-white/[0.08] pb-6">
            <div>
              <p className="text-sm text-fg-3">Your cost</p>
              <p className="mt-2 font-mono text-[28px] leading-8 tabular-nums text-fg">{usd(SITE.price)}</p>
              <p className="mt-1 text-sm text-fg-3">one time, after approval</p>
            </div>
            <div>
              <p className="text-sm text-fg-3">Typical client charge</p>
              <p className="mt-2 font-mono text-[28px] leading-8 tabular-nums text-fg">{usd(setupCharge)}</p>
              <p className="mt-1 text-sm text-fg-3">setup, plus {usd(monthlyRetainer)}/mo</p>
            </div>
          </div>

          <div className="space-y-2 py-6 text-[15px]">
            <LedgerLine label="Client setup fee" value={usd(setupCharge)} />
            <LedgerLine label="Your cost" value={`−${usd(SITE.price)}`} />
            <LedgerLine label="Margin on day one" value={usd(dayOne)} strong />
            <LedgerLine label={`Retainer, 12 × ${usd(monthlyRetainer)}`} value={usd(retainerYear)} />
            <LedgerLine label="Year-one margin per client" value={usd(yearOne)} strong />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-6">
            <div className="flex items-center gap-3">
              <span className="text-[15px] text-fg-2">With</span>
              <div className="flex h-9 items-center rounded-lg border border-white/10 bg-canvas-2">
                <button
                  type="button"
                  aria-label="Fewer clients"
                  onClick={() => setClients((c) => Math.max(1, c - 1))}
                  className="grid h-9 w-9 place-items-center text-fg-3 transition-colors hover:text-fg"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-20 text-center font-mono text-sm tabular-nums" aria-live="polite">
                  {clients} client{clients === 1 ? '' : 's'}
                </span>
                <button
                  type="button"
                  aria-label="More clients"
                  onClick={() => setClients((c) => Math.min(50, c + 1))}
                  className="grid h-9 w-9 place-items-center text-fg-3 transition-colors hover:text-fg"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-right">
              <span className="block text-sm text-fg-3">Year-one margin</span>
              <span className="font-mono text-[28px] leading-8 tabular-nums text-gold">{usd(yearOne * clients)}</span>
            </p>
          </div>
          <p className="mt-6 text-xs text-fg-3">Typical agency pricing. Your resale price and retainer are up to you.</p>
        </div>
      </div>
    </section>
  );
}
