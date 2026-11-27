import { useMemo, useState } from 'react';
import { CalcLayout, RangeField, ResultPanel, Segmented, ToggleField } from '../components/calculator/ui';
import { num, roundTo, usd, usdRange } from '../lib/format';
import type { CalculatorProps } from './types';

type Region = 'sunbelt' | 'southeast' | 'midwest' | 'north';

/** Average peak sun hours per day. */
const REGIONS: Record<Region, { label: string; sub: string; sun: number }> = {
  sunbelt: { label: 'Sunbelt', sub: 'AZ, NV, SoCal, TX', sun: 5.6 },
  southeast: { label: 'Southeast', sub: 'FL, GA, Carolinas', sun: 4.8 },
  midwest: { label: 'Midwest / Mid-Atl.', sub: 'OH, IL, VA, CO', sun: 4.3 },
  north: { label: 'Northeast / NW', sub: 'NY, MA, WA, OR', sun: 3.7 },
};

const FIXED_UTILITY_FEE = 15; // $/mo connection charge solar can't offset
const DERATE = 0.8; // inverter, wiring, soiling, temperature losses
const PRICE_PER_WATT = { low: 2.6, high: 3.3 }; // installed, before incentives
const BATTERY = { low: 12000, high: 16000 }; // ~13.5 kWh home battery installed
const PANEL_W = 420;
const ESCALATION = 0.03; // utility rate increase / yr
const DEGRADATION = 0.005; // panel output loss / yr

export default function SolarCalculator({ multiplier, ctaText, onQuote }: CalculatorProps) {
  const [bill, setBill] = useState(180);
  const [rate, setRate] = useState(0.17);
  const [region, setRegion] = useState<Region>('southeast');
  const [battery, setBattery] = useState(false);
  const [rebate, setRebate] = useState(0);

  const r = useMemo(() => {
    const offsetable = Math.max(0, bill - FIXED_UTILITY_FEE);
    const annualKWh = (offsetable / rate) * 12;
    const kW = Math.min(25, Math.max(2, annualKWh / (REGIONS[region].sun * 365 * DERATE)));
    const sizeKW = Math.round(kW * 10) / 10;
    const panels = Math.ceil((sizeKW * 1000) / PANEL_W);
    const batt = battery ? BATTERY : { low: 0, high: 0 };
    const keep = 1 - rebate / 100;
    const low = (sizeKW * 1000 * PRICE_PER_WATT.low + batt.low) * multiplier * keep;
    const high = (sizeKW * 1000 * PRICE_PER_WATT.high + batt.high) * multiplier * keep;
    const netMid = (low + high) / 2;
    const monthlySavings = offsetable * 0.95;

    let cumulative = 0;
    let payback = 0;
    for (let y = 1; y <= 25; y++) {
      cumulative += monthlySavings * 12 * Math.pow(1 + ESCALATION, y - 1) * Math.pow(1 - DEGRADATION, y - 1);
      if (!payback && cumulative >= netMid) payback = y - 1 + 0.5;
    }
    return { sizeKW, panels, low, high, monthlySavings, payback, lifetime: cumulative - netMid };
  }, [bill, rate, region, battery, rebate, multiplier]);

  const estimate = usdRange(r.low, r.high);
  const paybackText = r.payback ? `~${num(Math.round(r.payback))} years` : '25+ years';

  return (
    <CalcLayout
      inputs={
        <>
          <RangeField label="Average monthly electric bill" value={bill} min={50} max={600} step={10} onChange={setBill} format={(v) => usd(v)} />
          <RangeField
            label="Electricity rate"
            value={rate}
            min={0.1}
            max={0.45}
            step={0.01}
            onChange={setRate}
            format={(v) => `$${v.toFixed(2)}/kWh`}
          />
          <Segmented
            label="Where is the home?"
            columns={4}
            options={(Object.keys(REGIONS) as Region[]).map((k) => ({ value: k, label: REGIONS[k].label, sub: REGIONS[k].sub }))}
            value={region}
            onChange={setRegion}
          />
          <ToggleField
            label="Add battery backup"
            description="~13.5 kWh whole-home battery for outages"
            checked={battery}
            onChange={setBattery}
          />
          <RangeField
            label="State / utility rebates"
            value={rebate}
            min={0}
            max={25}
            step={5}
            onChange={setRebate}
            format={(v) => `${v}%`}
          />
        </>
      }
      result={
        <ResultPanel
          eyebrow="Estimated monthly savings"
          primary={`${usd(roundTo(r.monthlySavings, 1))}/mo`}
          secondary={`${num(r.sizeKW)} kW system · ${r.panels} panels${battery ? ' + battery' : ''}`}
          stats={[
            { label: 'Installed cost', value: estimate },
            { label: 'Estimated payback', value: paybackText },
            { label: '25-year net savings', value: r.lifetime > 0 ? usd(roundTo(r.lifetime, 100)) : '—' },
          ]}
          footnote="Assumes ~100% usage offset, 3%/yr utility increases & 0.5%/yr panel degradation. Excludes tax credits — ask about current incentives."
          ctaText={ctaText}
          onCta={() =>
            onQuote({
              estimate: `${usd(r.monthlySavings)}/mo savings · ${estimate} installed`,
              details: [
                { label: 'Monthly bill', value: usd(bill) },
                { label: 'Rate', value: `$${rate.toFixed(2)}/kWh` },
                { label: 'Region', value: REGIONS[region].label },
                { label: 'System size', value: `${num(r.sizeKW)} kW` },
                { label: 'Battery', value: battery ? 'Yes' : 'No' },
                { label: 'Payback', value: paybackText },
              ],
            })
          }
        />
      }
    />
  );
}
