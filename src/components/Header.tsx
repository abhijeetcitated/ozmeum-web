import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { useClaim } from './claim/ClaimContext';

const NAV = [
  { href: '#demo', label: 'Live demo' },
  { href: '#margin', label: 'Margin math' },
  { href: '#how', label: 'How it works' },
  { href: '#faq', label: 'FAQ' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { openClaim } = useClaim();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-canvas/80 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-fg-2 transition-colors hover:text-fg">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => openClaim({ source: 'header' })} className="btn-primary btn-sm hidden sm:inline-flex">
            Request staging
          </button>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg text-fg-2 transition-colors hover:bg-canvas-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-white/[0.08] bg-canvas md:hidden" aria-label="Mobile">
          <div className="container-x flex flex-col gap-1 py-4">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="flex h-10 items-center rounded-lg px-2 text-[15px] text-fg-2 hover:bg-canvas-2">
                {n.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openClaim({ source: 'mobile-menu' });
              }}
              className="btn-primary mt-2"
            >
              Request staging
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
