import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyText } from '../lib/clipboard';

const PLATFORMS = [
  { id: 'wordpress', label: 'WordPress', how: 'Add a Custom HTML block in Gutenberg, or an HTML widget in Elementor or Divi, and paste' },
  { id: 'webflow', label: 'Webflow', how: 'Drag in an Embed element, paste the line, then save and publish' },
  { id: 'ghl', label: 'GoHighLevel', how: 'In the funnel or website builder, add a Custom JS/HTML element and paste' },
  { id: 'wix', label: 'Wix', how: 'Add → Embed code → Embed HTML, choose Code, paste and stretch it to full width' },
  { id: 'shopify', label: 'Shopify', how: 'In the theme editor, add a Custom Liquid section and paste' },
] as const;

export default function EmbedCodeBox({ code, note }: { code: string; note?: string }) {
  const [platform, setPlatform] = useState<(typeof PLATFORMS)[number]['id']>('wordpress');
  const [copied, setCopied] = useState(false);
  const p = PLATFORMS.find((x) => x.id === platform)!;

  const copy = async () => {
    if (await copyText(code)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-canvas-1 p-2">
      <div className="flex flex-wrap gap-1 p-1" role="tablist" aria-label="Platform">
        {PLATFORMS.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={x.id === platform}
            onClick={() => setPlatform(x.id)}
            className={`h-8 rounded-md px-3 text-sm transition-colors ${
              x.id === platform ? 'bg-canvas-2 text-fg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]' : 'text-fg-3 hover:text-fg'
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>
      <p className="px-3 pb-4 pt-2 text-sm text-fg-2">{p.how}</p>
      <div className="overflow-hidden rounded-[10px] border border-white/[0.08] bg-black/40">
        <div className="flex h-10 items-center justify-between border-b border-white/[0.08] pl-4 pr-2">
          <span className="font-mono text-xs text-fg-3">1 line of HTML</span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-7 items-center gap-2 rounded-md px-2 text-xs text-fg transition-colors hover:bg-white/10"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="whitespace-pre-wrap break-all p-4 font-mono text-xs leading-5 text-fg">
          <code>{code}</code>
        </pre>
      </div>
      {note && <p className="px-3 pb-2 pt-3 text-xs text-fg-3">{note}</p>}
    </div>
  );
}
