import Footer from '../components/Footer';
import Header from '../components/Header';
import DemoStudio from '../sections/DemoStudio';
import FAQ from '../sections/FAQ';
import FinalCTA from '../sections/FinalCTA';
import Hero from '../sections/Hero';
import HowItWorks from '../sections/HowItWorks';
import MarginMath from '../sections/MarginMath';
import { usePageMeta } from '../lib/usePageMeta';

export default function Home() {
  usePageMeta('Ozmeum — 48-Hour White-Label Lead Calculators for Agencies ($249 Flat)');
  return (
    <>
      <Header />
      <main>
        <Hero />
        <DemoStudio />
        <MarginMath />
        <HowItWorks />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
