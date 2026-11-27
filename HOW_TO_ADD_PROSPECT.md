# Ozmeum — Quick Guide (Hinglish) 🚀

Ye file sirf tumhare liye hai: local chalana, naya prospect add karna, aur Cloudflare Pages pe deploy karna.

---

## (a) Local pe kaise chalayein

Node.js **20 ya usse upar** chahiye (`node -v` se check karo).

```bash
npm install
npm run dev
```

Browser me kholo: **http://localhost:5173**

| URL | Kya dikhega |
|---|---|
| `/` | Homepage + Live Demo Studio |
| `/p/apex-roofing-dallas` | Sample prospect pitch page (Agency View) |
| `/p/apex-roofing-dallas?view=client` | Wahi page, **Client-Safe View** (Ozmeum + $249 sab hidden) |
| `/embed/apex-roofing-dallas` | Sirf clean white-label widget (iframe ke andar yahi load hota hai) |
| `/embed/demo-roofing` | Generic demo widget (`demo-solar`, `demo-remodel`, `demo-medspa` bhi chalte hain) |

Production build check karna ho to:

```bash
npm run build      # TypeScript check + dist/ folder banata hai
npm run preview    # dist/ ko http://localhost:4173 pe serve karta hai
```

### Optional: Claim form ko email se jodna (Web3Forms)

1. https://web3forms.com pe free access key lo (apna email daalo, key mail me aayegi).
2. Project root me `.env.local` file banao:

```bash
VITE_WEB3FORMS_KEY=yaha-apni-key-paste-karo
VITE_CONTACT_EMAIL=hello@ozmeum.com
```

Key nahi daali to bhi chalega — form automatically **mailto fallback** use karega (visitor ka email app khulega, request pre-filled).

> ⚠️ Site pe kahin bhi credit-card form nahi hai — aur nahi banana. Invoice hamesha staging approval ke baad bahar se (Stripe/PayPal/Wise invoice link) bhejo.

---

## (b) Naya agency prospect 2 minute me add karo

File kholo: **`src/data/prospects.ts`**

`prospects` array ke andar ek naya object copy-paste karo:

```ts
  {
    slug: 'summit-medspa-miami',            // URL banega: /p/summit-medspa-miami
    agencyName: 'Coastal Growth Agency',    // Jis agency ko pitch kar rahe ho
    clientName: 'Summit MedSpa Miami',      // Agency ka client (widget pe yahi naam dikhega)
    clientWebsite: 'summitmedspamiami.com', // https:// mat lagana
    calculatorType: 'medspa',               // 'roofing' | 'solar' | 'remodel' | 'medspa'
    primaryColor: '#be185d',                // Client ki brand color (hex)
    cityMultiplier: 1.12,                   // 1 = US average, 1.12 = 12% mehenga market
    targetKeyword: 'coolsculpting cost miami',
    monthlySearches: 880,                   // Ahrefs / Semrush / Google Keyword Planner se
    competitorNote: 'Top 3 Miami medspas me se kisi ke paas price calculator nahi hai.',

    // Optional:
    ctaText: 'Check my monthly payment',    // Button ka text
    city: 'Miami, FL',
    webhookUrl: '',                         // Khali = demo mode. Live karne pe GHL/Zapier webhook URL daalo
  },
```

Save karo → `npm run dev` chal raha hai to page turant update ho jayega. Bas! ✅

### Fields ka matlab (short me)

- **slug** — sirf lowercase + dash (`apex-roofing-dallas`). Unique hona chahiye.
- **calculatorType** — `roofing` (roof replacement), `solar` (solar + battery), `remodel` (kitchen & bath), `medspa` (dental implant / medspa + financing).
- **cityMultiplier** — local pricing adjust karta hai. Rough guide: Dallas/Houston ~0.95, Austin/Denver ~1.05, Miami/Seattle ~1.12, NYC/SF/LA ~1.25.
- **targetKeyword + monthlySearches + competitorNote** — sirf **Agency View** me dikhte hain (client-safe view me nahi).
- **webhookUrl** — jab ye set hai, real leads seedha visitor ke browser se is URL pe POST hoti hain (form-encoded). Ozmeum pe kuch store nahi hota.

### Prospect ko bhejna kaise hai

1. Agency ko bhejo: `https://ozmeum.com/p/<slug>` (Agency View — keyword data + $249 deploy button).
2. Agency apne client ko screen-share kare → top-right **"Switch to Client-Safe View"** toggle on kare. Ya seedha client-safe link copy kare (pitch bar me **"Copy client-safe link"** button): `https://ozmeum.com/p/<slug>?view=client`
3. Client-safe view se wapas aane ke liye: bottom-left chhota 👁 icon.

### Deal close hone ke baad (live embed)

Agency client ki site pe ye 1 line paste karegi (WordPress Custom HTML / Webflow Embed / GHL Custom Code / Wix Embed HTML / Shopify Custom Liquid):

```html
<div data-ozmeum="summit-medspa-miami"></div><script async src="https://ozmeum.com/embed.js"></script>
```

Iframe khud resize hota hai (no double scrollbar). Live karne se pehle `webhookUrl` zaroor bhar dena.

> ⚠️ `prospects.ts` public JS bundle me jaata hai — koi password / private API key yaha mat daalna. Webhook URL theek hai (wo lead bhejne ke liye hi hota hai), par jaan lo ki wo browser me visible hoga.

> Note: `/p/*` aur `/embed/*` pages `noindex` hain aur `robots.txt` me disallowed — Google pe index nahi honge.

---

## (c) Vercel → Cloudflare Pages migration (ozmeum.com)

### Step 1: Code GitHub/GitLab pe push karo

```bash
git init
git add .
git commit -m "Ozmeum v1"
git branch -M main
git remote add origin https://github.com/<tumhara-username>/ozmeum-web.git
git push -u origin main
```

### Step 2: Cloudflare Pages project banao

Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → repo select karo.

**Build settings (exact):**

| Setting | Value |
|---|---|
| Framework preset | `Vite` (ya `None`) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(khali chhodo)* |
| Production branch | `main` |

**Environment variables** (Settings → Variables and Secrets → Production):

| Name | Value |
|---|---|
| `NODE_VERSION` | `20` |
| `VITE_WEB3FORMS_KEY` | tumhari Web3Forms key (optional) |
| `VITE_CONTACT_EMAIL` | `hello@ozmeum.com` (ya jo bhi email) |

**Save and Deploy** dabao. 1–2 minute me `https://ozmeum-web.pages.dev` pe site live.

`public/_redirects` (`/* /index.html 200`) already hai — isse `/p/...` aur `/embed/...` jaise React Router URLs refresh pe bhi 404 nahi denge. `public/_headers` caching set karta hai.

> Agar build log me `_redirects` ke liye "infinite loop" jaisa warning aaye to ghabrao mat — Cloudflare Pages me jab `404.html` nahi hota to wo already SPA fallback deta hai, routes phir bhi chalenge.

#### Agar project **Workers** ke through bana hai (Pages ki jagah)

Naye Cloudflare dashboard me "Workers & Pages → Create" kabhi-kabhi **Worker** bana deta hai, jisme build ke baad **Deploy command** `npx wrangler deploy` chalta hai. Ye bhi bilkul theek hai — repo me `wrangler.jsonc` already hai jo `dist/` ko static site ki tarah serve karta hai (SPA routing ke saath).

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | *(khali chhodo)* |

> ⚠️ Agar `wrangler.jsonc` delete kar doge to deploy fail hoga: *"The version of Vite used in the project ("5.4.21") cannot be automatically configured"*. Ye file rehne do.

Live URL hoga: `https://ozmeum-web.<tumhara-subdomain>.workers.dev`. Custom domain ke liye: Worker → **Settings → Domains & Routes → Add → Custom domain** → `ozmeum.com`.

### Step 3: Custom domain ozmeum.com jodo

1. Pages project → **Custom domains** → **Set up a custom domain** → `ozmeum.com` daalo (phir `www.ozmeum.com` bhi add karo).
2. **Agar domain ka DNS already Cloudflare pe hai:** Cloudflare khud CNAME record bana dega. Done.
3. **Agar DNS abhi Vercel / registrar (GoDaddy, Namecheap) pe hai:**
   - Cloudflare me **Add a site** → `ozmeum.com` → Free plan → jo 2 nameservers mile, unhe registrar pe update karo (Vercel nameservers hata do).
   - Nameserver propagate hone ke baad (kuch minute se 24 ghante) step 1 dobara karo.
4. SSL certificate automatic issue hoga (thoda time lag sakta hai).

### Step 4: Vercel saaf karo

- Vercel project → **Settings → Domains** → `ozmeum.com` aur `www` **remove** karo (warna conflict hoga).
- Cloudflare pe site sahi chal rahi hai confirm karne ke baad hi Vercel project delete/pause karo.

### Step 5: Test checklist ✅

- [ ] `https://ozmeum.com` khulta hai
- [ ] `https://ozmeum.com/p/apex-roofing-dallas` refresh karne pe bhi khulta hai
- [ ] `https://ozmeum.com/embed.js` JavaScript file dikhata hai
- [ ] Claim form submit karke test email aata hai

Uske baad har `git push` pe Cloudflare automatically naya deploy kar dega. 🎉
