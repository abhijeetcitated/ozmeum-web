import { useMemo, useState } from 'react';
import { CalcLayout, RangeField, ResultPanel, Segmented, ToggleField } from '../components/calculator/ui';
import { monthlyPayment, usd, usdRange } from '../lib/format';
import type { CalculatorProps } from './types';

type TreatmentId = 'implant' | 'fullarch' | 'aligners' | 'contouring';
type Term = '12' | '24' | '36' | '60';

interface Treatment {
  label: string;
  sub: string;
  low: number;
  high: number;
  qty?: { label: string; unit: [string, string]; min: number; max: number; def: number };
  addon?: { label: string; description: string; low: number; high: number; perUnit: boolean };
}

/** Typical US self-pay pricing ranges. */
const TREATMENTS: Record<TreatmentId, Treatment> = {
  implant: {
    label: 'Dental Implant',
    sub: 'Post, abutment & crown',
    low: 3800,
    high: 5500,
    qty: { label: 'Number of implants', unit: ['implant', 'implants'], min: 1, max: 8, def: 1 },
    addon: { label: 'Bone graft', description: 'Often needed if a tooth was lost a while ago', low: 400, high: 1200, perUnit: true },
  },
  fullarch: {
    label: 'Full-Arch (All-on-4®)',
    sub: 'Fixed teeth in a day',
    low: 18000,
    high: 28000,
    qty: { label: 'Arches', unit: ['arch', 'arches'], min: 1, max: 2, def: 1 },
    addon: { label: 'IV sedation', description: 'Sleep through the procedure', low: 600, high: 1200, perUnit: false },
  },
  aligners: {
    label: 'Clear Aligners',
    sub: 'Invisalign®-style',
    low: 3500,
    high: 7500,
    addon: { label: 'Add retainer set', description: 'Post-treatment retainers to lock in results', low: 300, high: 600, perUnit: false },
  },
  contouring: {
    label: 'Body Contouring',
    sub: 'Non-surgical fat reduction',
    low: 750,
    high: 1500,
    qty: { label: 'Treatment areas', unit: ['area', 'areas'], min: 1, max: 6, def: 2 },
  },
};

/** Typical patient-financing APRs (CareCredit / Cherry-style promos). */
const TERMS: Record<Term, { label: string; apr: number }> = {
  '12': { label: '12 mo', apr: 0 },
  '24': { label: '24 mo', apr: 9.99 },
  '36': { label: '36 mo', apr: 14.99 },
  '60': { label: '60 mo', apr: 17.99 },
};

export default function MedSpaCalculator({ multiplier, ctaText, onQuote }: CalculatorProps) {
  const [tid, setTid] = useState<TreatmentId>('implant');
  const [qty, setQty] = useState(TREATMENTS.implant.qty?.def ?? 1);
  const [addon, setAddon] = useState(false);
  const [down, setDown] = useState(10);
  const [term, setTerm] = useState<Term>('24');

  const t = TREATMENTS[tid];

  const changeTreatment = (id: TreatmentId) => {
    setTid(id);
    setQty(TREATMENTS[id].qty?.def ?? 1);
    setAddon(false);
  };

  const r = useMemo(() => {
    const q = t.qty ? qty : 1;
    let low = t.low * q;
    let high = t.high * q;
    if (addon && t.addon) {
      const m = t.addon.perUnit ? q : 1;
      low += t.addon.low * m;
      high += t.addon.high * m;
    }
    low *= multiplier;
    high *= multiplier;
    const mid = (low + high) / 2;
    const financed = mid * (1 - down / 100);
    const months = Number(term);
    const apr = TERMS[term].apr;
    const pay = monthlyPayment(financed, apr, months);
    return { low, high, financed, pay, interest: Math.max(0, pay * months - financed), apr };
  }, [t, qty, addon, down, term, multiplier]);

  const estimate = usdRange(r.low, r.high);

  return (
    <CalcLayout
      inputs={
        <>
          <Segmented
            label="Treatment"
            columns={2}
            options={(Object.keys(TREATMENTS) as TreatmentId[]).map((k) => ({ value: k, label: TREATMENTS[k].label, sub: TREATMENTS[k].sub }))}
            value={tid}
            onChange={changeTreatment}
          />
          {t.qty && (
            <RangeField
              label={t.qty.label}
              value={qty}
              min={t.qty.min}
              max={t.qty.max}
              onChange={setQty}
              format={(v) => `${v} ${t.qty!.unit[v === 1 ? 0 : 1]}`}
            />
          )}
          {t.addon && <ToggleField label={t.addon.label} description={t.addon.description} checked={addon} onChange={setAddon} />}
          <RangeField label="Down payment" value={down} min={0} max={50} step={5} onChange={setDown} format={(v) => `${v}%`} />
          <Segmented
            label="Payment plan"
            columns={4}
            options={(Object.keys(TERMS) as Term[]).map((k) => ({
              value: k,
              label: TERMS[k].label,
              sub: TERMS[k].apr === 0 ? '0% APR promo' : `${TERMS[k].apr}% APR`,
            }))}
            value={term}
            onChange={setTerm}
          />
        </>
      }
      result={
        <ResultPanel
          eyebrow="Estimated monthly payment"
          primary={`${usd(r.pay)}/mo`}
          secondary={`for ${term} months · ${r.apr === 0 ? '0% APR' : `${r.apr}% APR`}`}
          stats={[
            { label: 'Treatment estimate', value: estimate },
            { label: 'Amount financed', value: usd(r.financed) },
            { label: 'Est. total interest', value: usd(r.interest) },
          ]}
          footnote="Estimates only. Final treatment plan & price are confirmed at your consultation. Financing subject to credit approval."
          ctaText={ctaText}
          onCta={() =>
            onQuote({
              estimate: `${estimate} · ~${usd(r.pay)}/mo`,
              details: [
                { label: 'Treatment', value: t.label },
                ...(t.qty ? [{ label: t.qty.label, value: String(qty) }] : []),
                ...(t.addon ? [{ label: t.addon.label, value: addon ? 'Yes' : 'No' }] : []),
                { label: 'Down payment', value: `${down}%` },
                { label: 'Term', value: `${term} months` },
              ],
            })
          }
        />
      }
    />
  );
}
