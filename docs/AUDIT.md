# Audit — veralexconsulting.com (Phase 1, read-only)

**Date:** 2026-11-10
**Auditor:** coding agent (Phase 1)
**Repo root:** `/home/pasha/Documents/veralex-web`
**Branch:** `main` (clean except one untracked asset folder `public/asetbaru/`)
**No code was modified for this audit.** Every claim below comes from reading files or running a command; the command or file is cited.

---

## 0. Reality check vs the external audit

The external audit (10 Nov 2026) described a site that is **less healthy than the real one** in several important ways. Correcting the record first, because it changes what work is actually needed:

| External audit claim | What the repo actually does | Evidence |
| --- | --- | --- |
| "Language switcher shows EN/ID/CN but the URL stays the same" | **Wrong.** Locale is in the URL for service pages: `/services/x` (ID), `/en/services/x`, `/zh/services/x`. The homepage, `/about-us`, `/artikel` have **no** `/en` or `/zh` variant at all. | `src/app/[lang]/services/[slug]/page.tsx`, `src/app/sitemap.ts` |
| "Price inconsistencies between EN/ID homepages and detail pages" | **Mostly fixed in the data layer.** `src/lib/serviceContent.ts` interpolates prices from `serviceData` and its comment documents the exact drift that was fixed. The **one remaining** hardcoded price set is the homepage package cards. | `src/lib/serviceContent.ts:5-18`, `src/components/PricingSection.tsx:41-91` |
| "JSON-LD, hreflang, canonicals unverified" | All three **exist** on service pages (hreflang is a full reciprocal set; canonical is self-referencing). Homepage has canonical but **no hreflang**. | Built HTML, see §D |
| "`/aksesraffi` protected only by robots.txt Disallow" | **Wrong.** `/aksesraffi` is protected by Supabase session + **immutable owner UUID** in middleware and again in every action/API. | `src/middleware.ts:14-33`, `src/app/aksesraffi/actions.ts:27-42` |
| "Service-role key possibly on client" | **Not present on client.** Only referenced in `src/lib/workspace/supabase.ts` (server). | grep |

---

## A. Repo map

### Stack (verified from `package.json` + `tsconfig.json`)

| Item | Value |
| --- | --- |
| Framework | **Next.js 16.1.6**, App Router, React 19.2.3 |
| Language | TypeScript, **`strict: true` already on** (`tsconfig.json`) |
| Styling | Plain CSS (`globals.css` 5,825 lines, per-component `.css`), **no Tailwind** |
| DB / auth | Supabase (`@supabase/ssr` 0.12, `@supabase/supabase-js` 2.98) + direct Postgres via `pg` for scripts |
| Analytics | GTM optional, consent-gated (`NEXT_PUBLIC_GTM_ID`) |
| Package manager | npm (`package-lock.json`) |
| Node | v26.13.0 / npm 11.20.0 |
| Routing | App Router. Public ID pages unprefixed; `/en`, `/zh` under `[lang]/`. App areas: `/admin`, `/portal`, `/dashboard`, `/auth`, `/aksesraffi` |

### Scripts (`package.json`)

`dev`, `build`, `start`, `lint`, `test` (runs 6+ node test scripts), `workspace:seed/types/bootstrap/verify-db`, `owner:provision`, `owner:verify-access`, `og`. **No `type-check` script** (must run `npx tsc --noEmit` manually).

### Size and structure

- **189 source files**, ~23,900 lines (incl. CSS).
- Largest files: `globals.css` 5,825, `translations.ts` 1,371, `serviceContent.ts` 1,003, `articles.ts` 678, `serviceData.ts` 482. Only `globals.css` and the two content files exceed 400 lines; they are data/CSS, not logic.
- Folder layout is deliberate and clean: `app/`, `components/`, `features/workspace/`, `lib/` (+ `lib/legal`, `lib/owner`, `lib/supabase`, `lib/workspace`), `data/services/`, `types/`, `scripts/`, `supabase/migrations/`, `docs/`.

### Build status — **all green**

| Command | Result |
| --- | --- |
| `npx tsc --noEmit` | **exit 0**, no errors |
| `npx eslint .` | **0 errors, 1 warning** (`<img>` in `src/app/dashboard/layout.tsx:81`, an internal app page) |
| `npm test` | **pass** — 18/18 + 14/14 suites, plus workspace SOP/security checks |
| `npm run build` | **success**, 114 static pages generated |
| `npm audit` | **17 vulns: 1 critical, 11 high, 4 moderate, 1 low** (see §E) |

### Dead code / hygiene

| Finding | File | Note |
| --- | --- | --- |
| **Unused component** | `src/components/BrandSection.tsx` | never imported |
| **Unused component** | `src/components/PromoBanner.tsx` | never imported (but hardcodes "Rp13.000.000" — see §C) |
| **Unused component** | `src/components/UrgencyCTA.tsx` | never imported |
| **Unused component + dep** | `ParticleCanvasWrapper.tsx`, `ParticleCanvas.tsx` | never imported; `three` + `@types/three` therefore **unused dependencies** (not in public bundles) |
| `console.log` | 0 in `src` | clean |
| `: any` / `as any` | 0 | clean |
| TODO/FIXME | only `TEMPORARY_HIDE_COOKIE_NOTICE` (`MarketingChrome.tsx:11`) | intentional |
| Huge `globals.css` | 5,825 lines | one file for the whole marketing site; high collision risk, hard to review |
| Legacy duplicate flows | `/dashboard`, `/auth/*` | README says these are the *old* client flows replaced by `/portal` + `/admin`; still reachable. **Needs a keep/remove decision.** |
| Temp asset dir | `public/asetbaru/` | untracked, not referenced? (verify before commit) |

---

## B. i18n

**Model:** hand-rolled. No i18n library.

- Translation dictionary: `src/lib/translations.ts` — one flat `Record<Lang, Record<string,string>>` keyed `'nav.home'` etc., ~1,371 lines, three locales `id`/`en`/`zh`.
- Client hook: `src/lib/useLang.ts` resolves language in this order: **URL segment** → **`localStorage['veralex-lang']`** → default `id`.
- Server translation: `ServiceDetailContent.tsx` has its own lookup mirroring `useLang().t`.

### Languages per surface (verified against build output)

| Surface | `id` | `en` | `zh` |
| --- | --- | --- | --- |
| Homepage `/` | ✅ SSR ID | ❌ **no `/en` route → 404** | ❌ no `/zh` home |
| `/about-us` | ✅ | ❌ `/en/about-us` **404s** (only `/zh/about-us` generated) | ✅ `/zh/about-us` |
| `/privacy-policy`, `/terms-and-conditions` | ✅ | ❌ (redirects to ID via `permanentRedirect`) | ✅ |
| `/artikel`, `/artikel/[slug]` | ✅ | ❌ | ❌ |
| `/services/[slug]` (21) | ✅ full ID content | ✅ all 21 render, but only **4 slugs have real EN landing copy** (`pt-pma`, `itas-investor-1-tahun`, `itas-investor-2-tahun`, `pendaftaran-merek`); the other 17 fall back to `serviceData` short descriptions (`titleEn/descriptionEn`), i.e. **thin EN pages** | same as EN (only 4 have real ZH copy) |

### Real problems in i18n

1. **`<html lang>` is wrong for every EN/ZH page.** The root layout hardcodes `lang="id"` (`src/app/layout.tsx:74`). `[lang]/layout.tsx` "fixes" it with a tiny inline script that sets `document.documentElement.lang` on the client — **but the static HTML a crawler first reads still says `lang="id"`**. Verified in built files:
   - `.next/server/app/en/services/pendaftaran-merek.html` → `<html lang="id"`
   - `.next/server/app/zh/services/pendaftaran-merek.html` → `<html lang="id"`
   The existing code comment already admits this. **hreflang mitigates but does not fix it.**
2. **`localStorage` can override the URL language.** `useLang` returns `urlLang ?? localStorage ?? 'id'`. On an English page, if a client component reads `useLang()` and the visitor had previously picked Indonesian, the component renders Indonesian text **inside an English URL**. Googlebot has no `localStorage`, so this mostly hurts real users (mixed-language pages) — but the code path is fragile and hard to reason about.
3. **Chinese content quality unverified.** `zh` copy in `serviceContent.ts` reads like fluent human Chinese, not machine placeholder, but this needs a native speaker check (prices inside are interpolated, correct). **Flag for review.**
4. **Hardcoded strings outside translation files.** Many `zh`/`en` JSON landing pages carry their own copy (fine) but the *same* brand name transliteration varies. Minor.

---

## C. Data & pricing

### Where services come from
Single catalogue: **`src/lib/serviceData.ts`** (`ServiceItem[]`, 21 services) — the de-facto source of truth for price, title (id/en/zh), features. No CMS, no DB for services.

`src/lib/serviceContent.ts` holds long-form ID/EN/ZH copy + FAQs, and **interpolates the price** from `serviceData` via `priceOf()` — this is the right pattern and already fixed the ITAS/PMDN drift the external audit saw.

EN/ZH landing detail: `src/data/services/{en,zh}/*.json` (4 slugs each). `src/lib/servicePageData.ts` re-derives `price` from `serviceData` at render (`getServicePageData`), so those JSONs cannot drift the *price* even though they contain old literal prices in text (they get rewritten by `refreshCopy`).

### Every place a price literal appears (grep `Rp`)

| File:line | Values | Authoritative? | Issue |
| --- | --- | --- | --- |
| `src/lib/serviceData.ts` (all `price:`) | 21 services | **YES — the one source of truth** | — |
| `src/components/PricingSection.tsx:45,46,60,61,77,78` | **Rp13jt / Rp16jt, Rp36jt / Rp41jt, Rp49jt / Rp59jt** | ❌ hardcoded bundle prices | **The main remaining pricing problem.** Not in `serviceData`, not in any terms table. |
| `src/lib/translations.ts:191,192,351,645,646,805,1099,1100,1259` | "Rp13.000.000", "Hemat Rp3.000.000" | ❌ hardcoded in translation strings | Duplicate of the Starter package; will drift from `PricingSection`. |
| `src/components/PromoBanner.tsx` | Rp13.000.000 | ❌ dead component | unused, but delete or wire to source |
| `src/lib/serviceContent.ts:742-888…` | e.g. Rp5jt BPOM, Rp1,5jt PIRT, Rp12jt POSTEL, Rp7jt K3L, Rp6jt PSE | ✅ interpolated via `priceOf()` | good pattern to copy |
| `src/data/services/{en,zh}/*.json` | Rp6jt, Rp15jt, Rp18jt, Rp20jt | ⚠️ literal in text, **overwritten at render** | safe today; a maintenance trap |
| `src/features/workspace/project-detail.tsx:47` | `Rp${project.priorityPrice}` | ✅ from DB | fine (client project) |

**Price conflict table**

| Service | `serviceData` (authority) | Homepage packages / copy | Detail-page text | Conflict? |
| --- | --- | --- | --- | --- |
| PT PMDN | Rp10.000.000 | — | interpolated → Rp10jt | ✅ consistent |
| PT PMA | Rp15.000.000 | — | interpolated | ✅ |
| Pendirian CV | Rp5.000.000 | — | interpolated | ✅ (old 3jt drift gone) |
| Trademark | Rp6.000.000 | — | interpolated | ✅ |
| ITAS Investor 1 th | Rp18.000.000 | — | interpolated | ✅ (old 16jt gone) |
| ITAS Investor 2 th | Rp20.000.000 | "1× ITAS 2 th" in package | interpolated | ✅ |
| **"Starter Business"** | **— not in catalogue —** | Rp13jt (was 16jt) | translations also say Rp13jt | ⚠️ only exists as a hardcoded bundle |
| **"Investor Package"** | — | Rp36jt (was 41jt) | — | ⚠️ hardcoded |
| **"Premium"** | — | Rp49jt (was 59jt) | — | ⚠️ hardcoded |

**Bundle math check (not verified with Pasha):** Starter = PT + Trademark + website = 10 + 6 = **Rp16jt** at catalogue prices. Advertised "Rp13jt (hemat Rp3jt)" implies the bundle undercuts the sum of parts by 3jt — plausible but must be a deliberate business decision, and the "was Rp16jt" strikethrough must reflect a real prior price (ad-law risk if invented).

### ⚠️ Misleading discount (highest-confidence legal risk)
`src/data/services/en/pendaftaran-merek.json:26` `"discountBadge": "50% OFF"` and `zh/.../:26` `"优惠5折"`. **There is no `originalPrice` anywhere in `serviceData` for the trademark**, so "50% off" has no reference price shown. That is a potential misleading-advertising exposure (and Google Ads disapproves unsupported discount claims). **Must be removed or backed by a real original price + period.**

---

## D. SEO technical

Evidence = the generated `index.html`, `en/...` and `zh/...` files in `.next/server/app/`.

| Check | Homepage | `/services/x` (ID) | `/en/services/x` | Verdict |
| --- | --- | --- | --- | --- |
| `<title>` | 69 chars ❌ over 60 | OK | OK | homepage too long |
| meta description | **182 chars** ❌ over 155 | OK (~96–145) | OK | homepage too long |
| canonical | ✅ `https://www…com` | ✅ self | ✅ self | good |
| hreflang | ❌ **none** | ✅ full set + x-default | ✅ | homepage missing |
| `<html lang>` | ✅ `id` | ✅ `id` | ❌ **`id`** (should be `en`) | broken for EN/ZH |
| H1 count | 1 | 1 | 1 | ✅ |
| JSON-LD | LegalService, WebSite, Organization | + BreadcrumbList, Service, **FAQPage** | Service, BreadcrumbList | see below |
| OG/Twitter | ✅ | ✅ per-slug OG image | ✅ (uses `/logo.webp` for the 17 fallback slugs) | minor |

### Issues

1. **`/en` and `/en/about-us` 404.** There is no EN homepage route and `[lang]/about-us` only generates `zh`. Advertising "publish in three languages" (README) is only true for service pages. Either build EN/ID/ZH homes or stop claiming it.
2. **Sitemap has no hreflang alternates.** `sitemap.xml` lists 50 URLs but **zero `xhtml:link`** entries — so Google gets no sitemap-level language signal (it still gets on-page hreflang for services). `src/app/sitemap.ts` also hardcodes `now` as `lastModified` for everything (worst-case freshness signal).
3. **`FAQPage` on all 21 ID service pages**, but EN/ZH pages **don't** emit FAQPage even when they show an FAQ → inconsistent; and FAQPage rich results have been heavily restricted by Google — only keep where a real visible FAQ exists (it does, so keep ID).
4. **`/id/*` uses `redirect()` (307) not `permanentRedirect()` (308/301)** in `src/app/[lang]/services/[slug]/page.tsx:89`. Should be permanent so the signal sticks.
5. **Homepage `keywords` meta** present (ignored by Google, harmless) and **`geo.*` meta** — fine.
6. **Breadcrumb on EN/ZH points "Home" and "Services" to ID URLs** (`src/lib/serviceBreadcrumbs.ts:26-27` hardcode `'/'` and `'/#services'`). Breadcrumb structured data therefore sends EN/ZH pages to Indonesian breadcrumbs — a real structured-data inconsistency.
7. **No `noindex` on `/portal/login`?** confirmed handled via `X-Robots-Tag: noindex` header in `next.config.ts:36-38` (portal, admin, dashboard, auth). ✅ Good — this the external audit missed.
8. **Trailing slash / www:** `trailingSlash: false`; `metadataBase` = `https://www…`. **No explicit `www`↔apex or `http`→`https` redirects in `next.config.ts`** — relies on Vercel. Verify in production.
9. **404 / error pages:** `not-found.tsx`, `error.tsx`, `global-error.tsx` all exist ✅.
10. **Content depth (see §G):** `visa-c2` 1 section, `visa-d2-1/2-tahun` 1 section, `perpanjangan/pengalihan/hak-cipta/desain-industri/pendirian-cv/pt-perorangan` 2 sections → thin.

### Images / performance
- Hero uses `next/image` with `priority`, `sizes`, `alt` ✅.
- `GalleryPage.tsx` disables the lint rule and uses raw `<img>` (its `alt` is `"Bukti layanan VERALEX ${idx+1}"` — generic, not descriptive).
- OG images exist per-service (`public/og/*.png`) ✅. `sharp` pinned via `allowScripts`.
- **three.js not shipped** to public (only unused component imports it).
- Largest JS chunks ~259 KB / 223 KB (framework). No Lighthouse run yet (see below).

### What I could **not** verify (needs a live/prod check)
- Real Lighthouse/CWV numbers (no running prod server in this environment). **Do not trust any LCP/CLS figure until measured.**
- `www` vs apex and `http`→`https` redirect behavior in production.
- Actual Google index state (which locales are indexed).
- Whether `/en/about-us` 404 is also happening in production (static export says yes).

---

## E. Security

Overall **strong** — clearly built by someone security-aware. Findings:

| Area | Status | Evidence |
| --- | --- | --- |
| `/admin` auth | ✅ protected by default, `profiles.role='admin'` + `active`, re-checked in actions | `middleware.ts:43,58` |
| `/portal` auth | ✅ `role='client'` + `active` | `middleware.ts:60` |
| `/aksesraffi` (owner) | ✅ **immutable owner UUID** (`VERALEX_OWNER_USER_ID`), not role; forced password rotation | `middleware.ts:14-33`, `lib/owner/auth.ts` |
| `/api/analytics/overview` | ✅ owner-only, re-checked, 403 | route.ts:13-23 |
| `/api/analytics/event` | ✅ public by design, origin-checked, ≤1 KB, allowlisted fields, rate-limited | route.ts, `rate-limit.ts` |
| `/api/workspace/reminders` | ✅ `CRON_SECRET` with `timingSafeEqual` | route.ts:5-8 |
| Service-role key | ✅ server-only (`lib/workspace/supabase.ts`) | grep |
| Secrets in git | ✅ none tracked; `.env` gitignored; `.env.local.example` has no real values; a test asserts "no credential reaches source control" | `.gitignore`, `npm test` |
| RLS | ✅ migrations enable RLS + `REVOKE ALL` for anon/authenticated; `audit_logs` append-only trigger | `supabase/migrations/202610090001_workspace_schema.sql` |
| Login brute-force | ✅ rate-limited (IP + username), generic error message | `aksesraffi/actions.ts:19-24` |
| Security headers | ✅ `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. ⚠️ **No CSP, no HSTS** | `next.config.ts:17-23` |
| Env validation | ❌ **none** — no zod schema; a missing var throws a generic Indonesian error at request time | grep for zod → only transitive |
| Dependency CVEs | ❌ **17 (1 critical, 11 high)** — `next` critical (via `postcss`/`sharp`), plus `zod`, `nanoid`, `minimatch`, `js-yaml`, `source-map-js`, etc. | `npm audit` |
| Spam on public forms | ⚠️ forms are mostly WhatsApp links; portal/admin forms are behind auth. No Turnstile/honeypot on any public lead form (there is none to speak of). | — |

**Not a security hole but flagged:** `robots.ts` disallows `/api/` and `/aksesraffi` — the `Disallow` is cosmetic; the real protection is server-side (present). Good.

---

## F. Conversion & tracking

- **WhatsApp CTAs everywhere** with `data-cta-location` attributes and prefilled messages (`whatsappHref`). `marketing.ts` captures UTM + gclid into `sessionStorage`, pushes `whatsapp_click` / `phone_click` / `email_click` to `dataLayer`, and posts a first-party copy to `/api/analytics/event` (consent-gated). **This is well-built** and already better than most sites.
- **GTM is optional and currently unset** in local `.env` (`NEXT_PUBLIC_GTM_ID` empty). So **in production we must confirm GTM is set** — otherwise no GA4/Ads events fire at all. `GoogleTagManager` validates `GTM-[A-Z0-9]+`.
- **Consent:** `CookiePreferences` gates GTM + first-party event reporting. But `MarketingChrome.tsx:11` **hides the first-visit prompt** (`showInitialPrompt={false}`) "temporarily". Effect: analytics only runs if the user opens footer settings and accepts. If GTM is supposed to run on click IDs, this needs a decision (EU/CN users → consent; Indonesian-only → could be acceptable but Privacy Policy must match).
- **No dedicated thank-you page** and no Ads landing pages with price/promo match. Service pages are the de-facto landing pages (good content, but no Ads-specific variant).
- **`gclid` is captured but never sent anywhere** used for Ads offline conversion import; `trackLeadAction` deliberately drops click IDs (privacy choice) — so **Google Ads cannot attribute conversions from the offline side**. Needs a GA4/Ads-side decision (import conversions or send enhanced conversions).

---

## G. Content depth per service page (0–5)

Scoring from `src/lib/serviceContent.ts` (sections + FAQs) + `serviceData` completeness. 5 = trademark (reference). All 21 have: definition (from `serviceData.description`), features, price, 1–3 FAQ blocks rendered, WhatsApp CTA, related services, breadcrumbs.

| Slug | Sections | FAQ Qs | Score | Main gap |
| --- | --- | --- | --- | --- |
| pendaftaran-merek | 6 | 12 | **5** | reference page ✅ |
| pt-pma | 5 | 9 | 5 | none |
| itas-investor-1-tahun | 4 | 9 | 4 | vs 2-tahun differentiation thin |
| itas-investor-2-tahun | 4 | 9 | 4 | near-duplicate of 1-tahun |
| itas-family | 3 | 19 | 3 | big catalogue of Qs but no sections |
| pt-pmdn | 3 | 12 | 4 | vs PMA comparison |
| kitas-kerja | 3 | 12 | 4 | — |
| izin-bpom | 3 | 10 | 3 | scope vague ("cakupan dibahas") |
| pirt | 3 | 10 | 3 | eligibility unclear |
| pse-lokal / pse-asing | 3 | 10 | 3 | vs each other |
| visa-d2-1-tahun | 1 | 6 | **2** | thin |
| visa-d2-2-tahun | 1 | 6 | **2** | thin, near-dup of 1-tahun |
| **visa-c2** | 1 | 9 | **2** | thin; Rp56jt price needs source |
| perpanjangan-merek | 2 | 9 | 3 | — |
| pengalihan-merek | 2 | 9 | 3 | EN leak reported by external audit — verify |
| hak-cipta | 2 | 9 | 3 | — |
| desain-industri | 2 | 9 | 3 | — |
| pt-perorangan | 2 | 9 | 3 | vs CV comparison missing |
| pendirian-cv | 2 | 9 | 3 | vs PT Perorangan |
| sertifikasi-k3l | 2 | 8 | 3 | — |
| sertifikasi-postel | 2 | 10 | 3 | — |

Missing across the board (WS6 target): explicit **timeline** table, **requirements checklist**, **who-it's-for / comparison**, and **related articles** (only some pages have related services).

---

## Top 10 risks (by business impact)

1. **P0 — "50% OFF" trademark badge with no original price.** Misleading advertising; Google Ads + trust risk. (`pendaftaran-merek.json:26`, zh line 26)
2. **P0 — 17 dependency CVEs incl. critical `next`.** (`npm audit`)
3. **P0 — Homepage bundle prices hardcoded + duplicated in translations/promo/dead banner.** Next price change will drift again; also bundle math unconfirmed. (`PricingSection.tsx`, `translations.ts:191…`)
4. **P0 — `/en` and `/en/about-us` 404**, while README markets 3 languages. Broken promise + lost international traffic/Ads targeting.
5. **P1 — `<html lang="id">` on every EN/ZH page.** Weakens language targeting sitewide.
6. **P1 — Thin service pages** (`visa-c2`, `d2-1`, `d2-2` at score 2) and near-duplicates (ITAS 1/2, D2 1/2, PMDN/PMA) → cannibalisation, low ranking.
7. **P1 — Sitemap missing hreflang alternates; fake `lastModified = now`.** Freshness + language signals lost.
8. **P1 — Unverified brand claims** `150+ clients`, `99% success`, `24/7` (`businessFacts.ts`) shown in hero, and "5.0/5 · 8 reviews" vs 6 published reviews → legal/trust exposure.
9. **P1 — `localStorage` can override URL language** → mixed-language pages for real users; fragile.
10. **P2 — No CSP/HSTS; no env validation** → weaker defense-in-depth and fail-fast.

---

## Prioritized backlog

**P0 — trust / revenue / security**
| # | Task | Effort |
| --- | --- | --- |
| P0-1 | Remove or substantiate the "50% OFF" trademark badge (decide with Pasha) | S |
| P0-2 | `npm audit fix`; bump `next`/`sharp`/`postcss` within range; re-run build+tests | S |
| P0-3 | Move homepage package prices into a `data/pricing` module; import in `PricingSection`, `PromoBanner`, translations; add a grep test that fails on stray `Rp` literals | M |
| P0-4 | Build `/en` (and decide `/zh`) homepage + `/en/about-us`, or remove the "3 languages" claim | M |
| P0-5 | Confirm `businessFacts` numbers with Pasha or remove; fix "5.0/5 · 8" vs 6 reviews mismatch | S |

**P1 — SEO foundation**
| # | Task | Effort |
| --- | --- | --- |
| P1-1 | Per-routing `<html lang>` via `[lang]` segment (restructure so EN/ZH get correct `lang` in static HTML) | M |
| P1-2 | Add hreflang alternates to sitemap + real `lastModified` | S |
| P1-3 | Service page template (timeline, requirements, comparison, related articles) + deepen `visa-c2`, `d2-1`, `d2-2`; differentiate near-duplicates | L |
| P1-4 | Fix breadcrumbs for EN/ZH (locale-aware home/services links) | S |
| P1-5 | `permanentRedirect` for `/id/*`; verify www/apex/http redirects in prod | S |
| P1-6 | Remove `localStorage` override; language = URL only | S |
| P1-7 | Dedicated OG fallback per slug for the 17 thin EN/ZH pages | M |
| P1-8 | Lighthouse before/after; fix LCP/CLS; descriptive gallery alt text; one clear H1 per templated page | M |

**P2 — growth / tracking**
| # | Task | Effort |
| --- | --- | --- |
| P2-1 | Confirm GTM set in prod; GA4 + Ads conversion import decision | S |
| P2-2 | Ads-ready landing variants matching ad copy | M |
| P2-3 | Trademark fee calculator (PNBP configurable, source+date, legal review) | L |
| P2-4 | Cookie banner UX revisit; ensure Privacy Policy matches actual tracking | M |

**P3 — polish**
| # | Task | Effort |
| --- | --- | --- |
| P3-1 | Delete unused components (`BrandSection`, `PromoBanner`, `UrgencyCTA`, `Particle*`), drop `three`/`@types/three` | S |
| P3-2 | Split `globals.css`; raise/confirm thresholds for giant files | M |
| P3-3 | CSP + HSTS headers; zod env validation | M |
| P3-4 | Decide fate of legacy `/dashboard`, `/auth/*` | S |

---

## Questions for Pasha (batched, max 10)

1. **Homepage packages:** Is "Starter Business Rp13jt (was Rp16jt)" a real, current offer? What exactly is in each of Starter / Investor (Rp36jt) / Premium (Rp49jt), and is the "was" price a genuine past price (needed for ad-law safety)?
2. **Trademark 50% OFF:** Is there a real original price (e.g. Rp12jt) and a promo end date, or should I remove the "50% OFF" badge now?
3. **Trust numbers:** Are `150+ klien`, `99% success`, `5+ tahun`, `24/7` verified and usable? And is it "8 reviews" (profile) or "6 reviews" (published) — which should the page say?
4. **English/Chinese homepages:** Do you want full `/en` and `/zh` homepages (recommended for Ads/foreign-investor traffic), or should I keep 3 languages only for service pages?
5. **Chinese copy:** Who checks the ZH text quality? I won't publish ZH on pages you can't verify.
6. **Real prices for thin pages:** Visa C2 shows Rp56jt, D2 1yr Rp8jt / 2yr Rp12jt — confirm these, and confirm ITAS 1yr Rp18jt / 2yr Rp20jt.
7. **Legacy `/dashboard` + `/auth/*`:** keep as-is, or remove (with 301s to `/portal`)?
8. **Tracking:** Is GTM set in production, and do we want Google Ads conversion import (click-ID based) for lead attribution?
9. **Legal review:** Who signs off on PNBP/regulation figures (e.g. KITAS DPKK $1,200, trademark timeline 12–18 months)?
10. **Branch/comms:** OK to start on `chore/veralex-cleanup` with small commits in the P0→P3 order above?

---

### Migration note
`globals.css` (5,825 lines) is a single-file style dump. Splitting it is a P3 cleanup with real regression risk (no visual-regression tests). Recommend doing it only after P0/P1 and behind a branch, with screenshots at 360px/768px/1280px.

*(End of Phase 1. No code changed.)*
