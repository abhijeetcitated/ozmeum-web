import { Home, Sun, ChefHat, Sparkles, type LucideIcon } from 'lucide-react';
import type { CalculatorType } from './types';

export interface CalculatorMeta {
  type: CalculatorType;
  tab: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  /** Defaults used by the homepage demo + /embed/demo-* routes */
  demoBrand: string;
  demoColor: string;
  demoCta: string;
}

export const CALCULATORS: Record<CalculatorType, CalculatorMeta> = {
  roofing: {
    type: 'roofing',
    tab: 'Roofing',
    title: 'Roof replacement cost estimator',
    subtitle: 'Instant installed-price range for your home',
    icon: Home,
    demoBrand: 'Summit Roofing Co.',
    demoColor: '#c2410c',
    demoCta: 'Get my exact roof quote',
  },
  solar: {
    type: 'solar',
    tab: 'Solar',
    title: 'Solar and battery savings calculator',
    subtitle: 'System size, cost, payback & monthly savings',
    icon: Sun,
    demoBrand: 'BrightPath Solar',
    demoColor: '#d97706',
    demoCta: 'See my solar plan',
  },
  remodel: {
    type: 'remodel',
    tab: 'Kitchen & bath',
    title: 'Kitchen and bath remodel budget',
    subtitle: 'Realistic budget range in under a minute',
    icon: ChefHat,
    demoBrand: 'Oakline Remodeling',
    demoColor: '#0f766e',
    demoCta: 'Book a free design consult',
  },
  medspa: {
    type: 'medspa',
    tab: 'MedSpa / Dental',
    title: 'Treatment cost and monthly payment calculator',
    subtitle: 'See your treatment range and monthly payment',
    icon: Sparkles,
    demoBrand: 'Lumière Aesthetics & Dental',
    demoColor: '#7c3aed',
    demoCta: 'Check my financing options',
  },
};

export const CALCULATOR_TYPES = Object.keys(CALCULATORS) as CalculatorType[];
