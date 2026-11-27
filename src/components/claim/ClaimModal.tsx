import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Check, Loader2, Mail, X } from 'lucide-react';
import { CALCULATORS, CALCULATOR_TYPES } from '../../calculators/meta';
import { SITE } from '../../config';
import type { ClaimPrefill } from './ClaimContext';

type Status = 'idle' | 'sending' | 'sent' | 'mailto';

const DESTINATIONS = ['GoHighLevel', 'Zapier / Make', 'HubSpot', 'Email inbox', 'Other / not sure yet'];

/**
 * "Request Staging / Claim Widget" modal.
 * COMPLIANCE: no payment fields here, ever. Invoices are sent externally after staging approval.
 */
export default function ClaimModal({ prefill, onClose }: { prefill: ClaimPrefill; onClose: () => void }) {
  const [status, setStatus] = useState<Status>('idle');
  const [mailtoHref, setMailtoHref] = useState('');
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get('botcheck')) return;
    const data = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      agency: String(fd.get('agency') ?? ''),
      client_website: String(fd.get('client_website') ?? ''),
      calculator: CALCULATORS[(fd.get('calculator') as keyof typeof CALCULATORS) ?? 'roofing']?.title ?? '',
      lead_destination: String(fd.get('destination') ?? ''),
      notes: String(fd.get('notes') ?? ''),
      source: prefill.source,
    };
    setStatus('sending');

    if (SITE.web3formsKey) {
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: SITE.web3formsKey,
            subject: `New staging request — ${data.agency || data.name}`,
            from_name: 'Ozmeum.com',
            replyto: data.email,
            ...data,
          }),
        });
        const json = (await res.json()) as { success?: boolean };
        if (json.success) {
          setStatus('sent');
          return;
        }
      } catch {
        /* fall back to mailto */
      }
    }

    const body = Object.entries(data)
      .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v || '-'}`)
      .join('\n');
    const href = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(`Staging request — ${data.agency || data.name}`)}&body=${encodeURIComponent(body)}`;
    setMailtoHref(href);
    setStatus('mailto');
    window.location.href = href;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="claim-title">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-canvas-1 shadow-float sm:rounded-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-fg-3 transition-colors hover:bg-canvas-2 hover:text-fg"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {status === 'sent' || status === 'mailto' ? (
          <div className="px-6 py-12 text-center sm:px-8">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-canvas-2">
              {status === 'sent' ? <Check className="h-5 w-5 text-fg" /> : <Mail className="h-5 w-5 text-fg" />}
            </div>
            <h2 id="claim-title" className="mt-4 text-xl font-medium">
              {status === 'sent' ? 'Request received' : 'One more step: send the email'}
            </h2>
            {status === 'sent' ? (
              <p className="mx-auto mt-2 max-w-sm text-[15px] leading-6 text-fg-2">
                We reply within one business day to confirm the details. The staging link follows within 48 hours, and you pay nothing until
                you approve it.
              </p>
            ) : (
              <p className="mx-auto mt-2 max-w-sm text-[15px] leading-6 text-fg-2">
                Your email app should have opened with the request filled in. If it didn’t,{' '}
                <a href={mailtoHref} className="text-gold underline decoration-gold/30 underline-offset-4">
                  open it here
                </a>{' '}
                or write to <span className="text-fg">{SITE.contactEmail}</span>.
              </p>
            )}
            <button type="button" onClick={onClose} className="btn-primary mt-8">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 sm:p-8">
            <h2 id="claim-title" className="pr-8 text-2xl font-medium leading-8">
              Request a staging link
            </h2>
            <p className="mt-2 text-[15px] leading-6 text-fg-2">
              Tell us about the client. You get a working staging link within 48 hours, and the ${SITE.price} invoice only after you approve it.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Your name">
                <input ref={firstRef} name="name" required autoComplete="name" className="input" />
              </Field>
              <Field label="Work email">
                <input name="email" type="email" required autoComplete="email" className="input" />
              </Field>
              <Field label="Agency">
                <input name="agency" defaultValue={prefill.agencyName} autoComplete="organization" className="input" />
              </Field>
              <Field label="Client website">
                <input name="client_website" defaultValue={prefill.clientWebsite} placeholder="clientsite.com" required className="input" />
              </Field>
              <Field label="Calculator">
                <select name="calculator" defaultValue={prefill.calculatorType ?? 'roofing'} className="input">
                  {CALCULATOR_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {CALCULATORS[t].tab}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Leads go to">
                <select name="destination" defaultValue={DESTINATIONS[0]} className="input">
                  {DESTINATIONS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </Field>
              <Field label="Notes, optional" className="sm:col-span-2">
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={prefill.notes}
                  placeholder="Brand color, service area, pricing, webhook URL"
                  className="input h-auto resize-none py-2"
                />
              </Field>
              <input type="checkbox" name="botcheck" tabIndex={-1} className="hidden" aria-hidden="true" />
            </div>

            <button type="submit" disabled={status === 'sending'} className="btn-primary mt-6 w-full">
              {status === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === 'sending' ? 'Sending' : 'Request my staging link'}
            </button>
            <p className="mt-3 text-center text-sm text-fg-3">No card needed. This site never asks for payment details.</p>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, className = '', children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
