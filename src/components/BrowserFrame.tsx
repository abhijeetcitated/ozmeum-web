import type { ReactNode } from 'react';
import { Lock } from 'lucide-react';

/** Browser chrome so the calculator reads as "on the client's own site". */
export default function BrowserFrame({ url, children, tag }: { url: string; children: ReactNode; tag?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-canvas-2 shadow-float">
      <div className="flex h-10 items-center gap-4 border-b border-white/[0.08] bg-canvas-1 px-4">
        <div className="flex gap-2" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </div>
        <div className="flex h-6 min-w-0 flex-1 items-center gap-2 rounded-md bg-canvas-2 px-3 font-mono text-xs text-fg-3">
          <Lock className="h-3 w-3 shrink-0" />
          <span className="truncate">{url}</span>
        </div>
        {tag && <span className="hidden font-mono text-xs text-fg-3 sm:inline">{tag}</span>}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}
