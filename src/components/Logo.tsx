import { Link } from 'react-router-dom';

/** Flat mark: an equals sign — the line where an estimate lands. */
export function LogoMark({ className = 'h-6 w-6', tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  const fill = tone === 'light' ? '#ededed' : '#0f0f10';
  const line = tone === 'light' ? '#0f0f10' : '#ededed';
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="7" fill={fill} />
      <rect x="9" y="12" width="14" height="2.5" rx="1.25" fill={line} />
      <rect x="9" y="17.5" width="14" height="2.5" rx="1.25" fill={line} />
    </svg>
  );
}

export default function Logo({ className = '', tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 text-[17px] font-semibold leading-none tracking-[-0.02em] ${tone === 'light' ? 'text-fg' : 'text-canvas'} ${className}`}
      aria-label="Ozmeum home"
    >
      <LogoMark tone={tone} />
      ozmeum
    </Link>
  );
}
