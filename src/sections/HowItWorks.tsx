import { SITE } from '../config';

const STEPS = [
  {
    time: '5 minutes',
    title: 'Send the client’s URL and webhook',
    body: 'Their website, brand color and where leads should land: GoHighLevel, Zapier, HubSpot or an inbox.',
  },
  {
    time: 'Within 48 hours',
    title: 'Review the live staging link',
    body: 'Click through the working calculator with the client’s branding and local pricing. Ask for changes before you pay.',
  },
  {
    time: 'After approval',
    title: `Pay the $${SITE.price} invoice`,
    body: 'Sent by email once you sign off. One flat fee, no subscription, and no card details entered on this site.',
  },
  {
    time: 'Same day',
    title: 'Paste one line or take the source',
    body: 'Drop the embed on any page, or download the full source and host it on the client’s own domain.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16 py-24 sm:py-32">
      <div className="container-x">
        <h2 className="section-title max-w-2xl">You see it working before you pay</h2>
        <ol className="mt-12 grid gap-y-10 border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="pt-6 sm:pr-8 lg:border-l lg:border-white/10 lg:pl-6 lg:first:border-l-0 lg:first:pl-0">
              <p className="font-mono text-xs text-fg-3">
                {String(i + 1).padStart(2, '0')} · {s.time}
              </p>
              <h3 className="mt-3 text-[17px] font-semibold leading-6 tracking-[-0.01em] text-fg">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-fg-2">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
