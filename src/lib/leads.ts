export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  zip: string;
  brand: string;
  calculator: string;
  estimate: string;
  details: Record<string, string>;
}

/**
 * Sends a lead straight from the visitor's browser to the client's webhook
 * (GoHighLevel inbound webhook, Zapier/Make catch hook, HubSpot form endpoint, etc.).
 * Nothing touches Ozmeum servers — we store zero lead PII.
 *
 * Uses form-encoded `no-cors` POST so it works with webhooks that don't send CORS headers.
 * With no webhook configured, the widget runs in demo mode.
 */
export async function sendLead(webhookUrl: string | undefined, lead: LeadPayload): Promise<{ demo: boolean }> {
  if (!webhookUrl) {
    await new Promise((r) => setTimeout(r, 650));
    return { demo: true };
  }
  const body = new URLSearchParams({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    zip: lead.zip,
    brand: lead.brand,
    calculator: lead.calculator,
    estimate: lead.estimate,
    page_url: document.referrer || window.location.href,
    submitted_at: new Date().toISOString(),
  });
  for (const [k, v] of Object.entries(lead.details)) {
    body.append(`input_${k.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`, v);
  }
  await fetch(webhookUrl, { method: 'POST', mode: 'no-cors', body });
  return { demo: false };
}
