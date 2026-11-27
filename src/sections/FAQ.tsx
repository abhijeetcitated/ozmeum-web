import { Plus } from 'lucide-react';
import { SITE } from '../config';

const FAQS = [
  {
    q: 'Will it slow down WordPress or hurt Core Web Vitals?',
    a: 'No. The loader is a 1 KB async script, and the calculator runs in an isolated iframe that only loads as a visitor scrolls near it. It never blocks the page from rendering, never touches the theme’s CSS or JavaScript, and sizes itself so nothing jumps.',
  },
  {
    q: 'Does Ozmeum appear anywhere?',
    a: 'No. There is no logo, no “powered by” line and no Ozmeum name in the widget, the lead form or the thank-you screen. Only your client’s name, colors and button text. If you want it hosted on the client’s own domain as well, take the source code instead of the embed.',
  },
  {
    q: 'Where do the leads go?',
    a: 'Straight from the visitor’s browser to your client’s webhook in GoHighLevel, Zapier, Make or HubSpot, or to an inbox through one of those. Each lead carries the contact details, every calculator input and the estimate shown. We store no lead data, and leads never pass through our servers.',
  },
  {
    q: 'What if I don’t like the staging link?',
    a: `Then you don’t pay. Ask for changes to copy, pricing or styling before you approve. The $${SITE.price} invoice only goes out after you sign off.`,
  },
  {
    q: 'Can it match my client’s real prices?',
    a: 'Yes. Every calculator has a local price index and editable pricing tables. Send the client’s price sheet and we wire it in, so the estimates line up with what their sales team quotes.',
  },
  {
    q: 'Which platforms does the embed work on?',
    a: 'Anything that accepts an HTML snippet: WordPress with Gutenberg, Elementor or Divi, Webflow, GoHighLevel funnels and sites, Wix, Squarespace, Shopify, Framer, Duda and hand-coded sites.',
  },
  {
    q: 'Is there a monthly fee?',
    a: `No. It’s $${SITE.price} once. Whether you charge the client a retainer for hosting, tracking and tuning is up to you, and that money is yours.`,
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="scroll-mt-16 border-t border-white/[0.08] py-24 sm:py-32">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div>
          <h2 className="section-title">Questions agencies ask</h2>
          <p className="mt-4 text-[15px] leading-6 text-fg-2">
            Something else? Email{' '}
            <a href={`mailto:${SITE.contactEmail}`} className="text-gold underline decoration-gold/30 underline-offset-4 hover:decoration-gold">
              {SITE.contactEmail}
            </a>
          </p>
        </div>
        <div className="border-t border-white/10">
          {FAQS.map((f, i) => (
            <details key={f.q} className="group border-b border-white/10" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[17px] font-semibold leading-6 tracking-[-0.01em] text-fg">
                {f.q}
                <Plus className="h-4 w-4 shrink-0 text-fg-3 transition-transform group-open:rotate-45" />
              </summary>
              <p className="-mt-2 max-w-[40rem] pb-6 text-[15px] leading-6 text-fg-2">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
