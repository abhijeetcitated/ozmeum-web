import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CalculatorType } from '../../calculators/types';
import ClaimModal from './ClaimModal';

export interface ClaimPrefill {
  /** Where the CTA was clicked — included in the request email. */
  source: string;
  agencyName?: string;
  clientWebsite?: string;
  calculatorType?: CalculatorType;
  notes?: string;
}

const ClaimCtx = createContext<{ openClaim: (p?: ClaimPrefill) => void } | null>(null);

export function ClaimProvider({ children }: { children: ReactNode }) {
  const [prefill, setPrefill] = useState<ClaimPrefill | null>(null);
  const openClaim = useCallback((p?: ClaimPrefill) => setPrefill(p ?? { source: 'site' }), []);
  const value = useMemo(() => ({ openClaim }), [openClaim]);
  return (
    <ClaimCtx.Provider value={value}>
      {children}
      {prefill && <ClaimModal prefill={prefill} onClose={() => setPrefill(null)} />}
    </ClaimCtx.Provider>
  );
}

export function useClaim() {
  const ctx = useContext(ClaimCtx);
  if (!ctx) throw new Error('useClaim must be used inside <ClaimProvider>');
  return ctx;
}
