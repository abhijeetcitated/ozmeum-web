import { useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CalculatorWidget from '../components/calculator/CalculatorWidget';
import { CALCULATORS } from '../calculators/meta';
import { resolveWidget } from '../data/resolveWidget';
import { usePageMeta } from '../lib/usePageMeta';

/**
 * /embed/:slug — the pure white-label widget rendered inside the host page's iframe.
 * No header, no footer, no Ozmeum branding, transparent background.
 */
export default function Embed() {
  const { slug = '' } = useParams();
  const [params] = useSearchParams();
  const cfg = resolveWidget(slug, params);
  const rootRef = useRef<HTMLDivElement>(null);

  usePageMeta(cfg ? `${cfg.brandName} — ${CALCULATORS[cfg.type].title}` : 'Calculator', true);

  useEffect(() => {
    document.documentElement.classList.add('ozm-embed');
    return () => document.documentElement.classList.remove('ozm-embed');
  }, []);

  // Report our height to the parent so the iframe never shows its own scrollbar.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || window.parent === window) return;
    let last = -1;
    const post = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      if (height !== last) {
        last = height;
        window.parent.postMessage({ type: 'OZMEUM_RESIZE', height }, '*');
      }
    };
    const ro = new ResizeObserver(post);
    ro.observe(el);
    post();
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="p-1 sm:p-2">
      {cfg ? (
        <CalculatorWidget {...cfg} />
      ) : (
        <div className="rounded-xl border border-neutral-900/10 bg-white p-6 text-center text-sm text-neutral-500">This calculator is currently unavailable.</div>
      )}
    </div>
  );
}
