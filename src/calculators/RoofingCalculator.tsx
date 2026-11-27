import { useMemo, useState } from 'react';
import { CalcLayout, RangeField, ResultPanel, Segmented, ToggleField } from '../components/calculator/ui';
import { num, usd, usdRange } from '../lib/format';
import type { CalculatorProps } from './types';

type Material = 'asphalt' | 'metal' | 'tile';
type Pitch = 'low' | 'medium' | 'steep';

/** Installed $/sq ft, US national averages (materials + labor + underlayment + flashing). */
const MATERIALS: Record<Material, { label: string; sub: string; low: number; high: number; life: string; days: number }> = {
  asphalt: { label: 'Asphalt', sub: 'Architectural shingle', low: 4.25, high: 6.25, life: '25–30 years', days: 0 },
  metal: { label: 'Metal', sub: 'Standing seam', low: 10.0, high: 16.0, life: '40–70 years', days: 1 },
  tile: { label: 'Tile', sub: 'Clay / concrete', low: 12.0, high: 22.0, life: '50–100 years', days: 2 },
};

const PITCH: Record<Pitch, { label: string; sub: string; factor: number }> = {
  low: { label: 'Low', sub: 'Up to 4/12', factor: 1.0 },
  medium: { label: 'Medium', sub: '5/12 – 8/12', factor: 1.15 },
  steep: { label: 'Steep', sub: '9/12 and up', factor: 1.35 },
};

const WASTE = 1.1; // 10% cut/waste factor
const TEAR_OFF = { low: 1.0, high: 2.0 }; // $/sq ft remove + dispose existing layer

export default function RoofingCalculator({ multiplier, ctaText, onQuote }: CalculatorProps) {
  const [area, setArea] = useState(2200);
  const [pitch, setPitch] = useState<Pitch>('medium');
  const [material, setMaterial] = useState<Material>('asphalt');
  const [tearOff, setTearOff] = useState(true);

  const r = useMemo(() => {
    const m = MATERIALS[material];
    const f = PITCH[pitch].factor;
    const billable = area * WASTE;
    const squares = billable / 100;
    const low = billable * (m.low * f + (tearOff ? TEAR_OFF.low : 0)) * multiplier;
    const high = billable * (m.high * f + (tearOff ? TEAR_OFF.high : 0)) * multiplier;
    const baseDays = area <= 2500 ? 1 : 2;
    const days = `${baseDays + m.days}–${baseDays + m.days + (pitch === 'steep' ? 2 : 1)} days`;
    return { low, high, squares, perSqLow: low / squares, perSqHigh: high / squares, days, life: m.life };
  }, [area, pitch, material, tearOff, multiplier]);

  const estimate = usdRange(r.low, r.high);

  return (
    <CalcLayout
      inputs={
        <>
          <RangeField
            label="Roof area"
            value={area}
            min={1000}
            max={5000}
            step={50}
            onChange={setArea}
            format={(v) => `${num(v)} sq ft`}
          />
          <Segmented label="Roof pitch" options={(Object.keys(PITCH) as Pitch[]).map((k) => ({ value: k, ...PITCH[k] }))} value={pitch} onChange={setPitch} />
          <Segmented
            label="Roofing material"
            options={(Object.keys(MATERIALS) as Material[]).map((k) => ({ value: k, label: MATERIALS[k].label, sub: MATERIALS[k].sub }))}
            value={material}
            onChange={setMaterial}
          />
          <ToggleField
            label="Tear off existing roof"
            description="Remove & haul away the old layer (recommended)"
            checked={tearOff}
            onChange={setTearOff}
          />
        </>
      }
      result={
        <ResultPanel
          eyebrow="Estimated installed price"
          primary={estimate}
          secondary={`${MATERIALS[material].label} · ${PITCH[pitch].label} pitch${tearOff ? ' · incl. tear-off' : ''}`}
          stats={[
            { label: 'Roofing squares (incl. waste)', value: num(Math.ceil(r.squares)) },
            { label: 'Price per square', value: `${usd(r.perSqLow)} – ${usd(r.perSqHigh)}` },
            { label: 'Expected lifespan', value: r.life },
            { label: 'Typical install time', value: r.days },
          ]}
          footnote="Includes materials, labor, underlayment, flashing & cleanup. Final price is confirmed after a free on-site inspection."
          ctaText={ctaText}
          onCta={() =>
            onQuote({
              estimate,
              details: [
                { label: 'Roof area', value: `${num(area)} sq ft` },
                { label: 'Pitch', value: PITCH[pitch].label },
                { label: 'Material', value: MATERIALS[material].label },
                { label: 'Tear-off', value: tearOff ? 'Yes' : 'No' },
              ],
            })
          }
        />
      }
    />
  );
}
