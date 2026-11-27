import { useMemo, useState } from 'react';
import { CalcLayout, RangeField, ResultPanel, Segmented, ToggleField } from '../components/calculator/ui';
import { monthlyPayment, num, usd, usdRange } from '../lib/format';
import type { CalculatorProps } from './types';

type Room = 'kitchen' | 'bath';
type Tier = 'refresh' | 'mid' | 'upscale';

const ROOMS: Record<Room, { label: string; sub: string; min: number; max: number; def: number }> = {
  kitchen: { label: 'Kitchen', sub: 'Cabinets, counters, flooring', min: 70, max: 400, def: 160 },
  bath: { label: 'Bathroom', sub: 'Tile, vanity, fixtures', min: 35, max: 150, def: 60 },
};

const TIERS: Record<Tier, { label: string; sub: string }> = {
  refresh: { label: 'Refresh', sub: 'Paint, fronts, fixtures' },
  mid: { label: 'Mid-range', sub: 'Semi-custom, quartz' },
  upscale: { label: 'Upscale', sub: 'Custom, premium' },
};

/** Installed $/sq ft, US national averages. */
const PSF: Record<Room, Record<Tier, [number, number]>> = {
  kitchen: { refresh: [100, 175], mid: [225, 350], upscale: [450, 700] },
  bath: { refresh: [175, 275], mid: [350, 500], upscale: [650, 1000] },
};

const APPLIANCES: Record<Tier, [number, number]> = { refresh: [4000, 7000], mid: [8000, 14000], upscale: [18000, 35000] };
const SHOWER: Record<Tier, [number, number]> = { refresh: [4000, 6500], mid: [6500, 10000], upscale: [10000, 18000] };
const WEEKS: Record<Room, Record<Tier, string>> = {
  kitchen: { refresh: '3–5 weeks', mid: '6–10 weeks', upscale: '10–16 weeks' },
  bath: { refresh: '2–3 weeks', mid: '4–6 weeks', upscale: '6–10 weeks' },
};
const LOAN = { apr: 9.99, months: 120 };

export default function RemodelCalculator({ multiplier, ctaText, onQuote }: CalculatorProps) {
  const [room, setRoom] = useState<Room>('kitchen');
  const [size, setSize] = useState(ROOMS.kitchen.def);
  const [tier, setTier] = useState<Tier>('mid');
  const [layout, setLayout] = useState(false);
  const [extra, setExtra] = useState(true);

  const changeRoom = (r: Room) => {
    setRoom(r);
    setSize(ROOMS[r].def);
  };

  const r = useMemo(() => {
    const [pl, ph] = PSF[room][tier];
    let low = size * pl;
    let high = size * ph;
    if (layout) {
      low *= 1.15;
      high *= 1.2;
    }
    if (extra) {
      const [al, ah] = room === 'kitchen' ? APPLIANCES[tier] : SHOWER[tier];
      low += al;
      high += ah;
    }
    low *= multiplier;
    high *= multiplier;
    return { low, high, monthly: monthlyPayment((low + high) / 2, LOAN.apr, LOAN.months) };
  }, [room, size, tier, layout, extra, multiplier]);

  const estimate = usdRange(r.low, r.high, 500);
  const extraLabel = room === 'kitchen' ? 'New appliance package' : 'Walk-in tile shower + glass';

  return (
    <CalcLayout
      inputs={
        <>
          <Segmented
            label="Which room?"
            columns={2}
            options={(Object.keys(ROOMS) as Room[]).map((k) => ({ value: k, label: ROOMS[k].label, sub: ROOMS[k].sub }))}
            value={room}
            onChange={changeRoom}
          />
          <RangeField
            label={`${ROOMS[room].label} size`}
            value={size}
            min={ROOMS[room].min}
            max={ROOMS[room].max}
            step={5}
            onChange={setSize}
            format={(v) => `${num(v)} sq ft`}
          />
          <Segmented
            label="Finish level"
            options={(Object.keys(TIERS) as Tier[]).map((k) => ({ value: k, ...TIERS[k] }))}
            value={tier}
            onChange={setTier}
          />
          <div className="space-y-3">
            <ToggleField
              label="Move plumbing or walls"
              description="Layout changes add structural & trade work"
              checked={layout}
              onChange={setLayout}
            />
            <ToggleField
              label={extraLabel}
              description={room === 'kitchen' ? 'Fridge, range, dishwasher, hood' : 'Curbless tile, niche & frameless glass'}
              checked={extra}
              onChange={setExtra}
            />
          </div>
        </>
      }
      result={
        <ResultPanel
          eyebrow="Estimated project budget"
          primary={estimate}
          secondary={
            <>
              Or about <span className="font-mono text-white">{usd(r.monthly)}/mo</span> with financing*
            </>
          }
          stats={[
            { label: 'Project', value: `${TIERS[tier].label} ${ROOMS[room].label.toLowerCase()}` },
            { label: 'Size', value: `${num(size)} sq ft` },
            { label: 'Typical timeline', value: WEEKS[room][tier] },
          ]}
          footnote={`Includes labor, materials, permits & cleanup. *Illustrative ${LOAN.months / 12}-yr term at ${LOAN.apr}% APR, subject to credit approval.`}
          ctaText={ctaText}
          onCta={() =>
            onQuote({
              estimate,
              details: [
                { label: 'Room', value: ROOMS[room].label },
                { label: 'Size', value: `${num(size)} sq ft` },
                { label: 'Finish', value: TIERS[tier].label },
                { label: 'Layout change', value: layout ? 'Yes' : 'No' },
                { label: extraLabel, value: extra ? 'Yes' : 'No' },
              ],
            })
          }
        />
      }
    />
  );
}
