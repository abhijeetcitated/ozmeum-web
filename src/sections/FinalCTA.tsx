import { ArrowRight } from 'lucide-react';
import { useClaim } from '../components/claim/ClaimContext';
import { SITE } from '../config';

export default function FinalCTA() {
  const { openClaim } = useClaim();
  return (
    <section className="pb-24">
      <div className="container-x">
        <div className="flex flex-col gap-8 rounded-2xl border border-white/10 bg-canvas-1 px-6 py-12 sm:px-12 sm:py-16 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="max-w-xl text-balance text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-fg sm:text-[40px]">
              Pick one client and see their calculator live in 48 hours
            </h2>
            <p className="mt-4 max-w-md text-[17px] leading-7 text-fg-2">No card and no sales call. If it isn’t right, you don’t pay the ${SITE.price}.</p>
          </div>
          <button
            type="button"
            onClick={() => openClaim({ source: 'final-cta' })}
            className="btn-primary shrink-0"
          >
            Request a staging link <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
