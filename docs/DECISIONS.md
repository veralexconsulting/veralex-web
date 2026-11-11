# Decisions log

Short records of decisions that changed the site in a way someone will later
ask "why is it like this?". Newest last. Each entry: the decision, the reason,
and what it rules out.

---

## 2026-11-11 — Pricing has exactly one home

**Decision.** Public prices live in `src/data/pricing.ts` (packages) and
`src/lib/serviceData.ts` (per-service catalogue). No component, page or
translation string may contain a hand-typed rupiah amount; a guard test
(`scripts/check-pricing.mjs`, part of `npm test`) fails the build if one
appears.

**Why.** The homepage bundle prices were typed in `PricingSection.tsx` *and*
again in `translations.ts` *and* in an unused `PromoBanner` component — three
places to edit, three ways for the page to contradict itself.

**Rules out.** Formatting a price inline "just this once". Add the number to the
data module and interpolate it.

---

## 2026-11-11 — No struck-through prices, no discount badges

**Decision (Pasha).** All "was" prices (`Rp16/41/59jt`) and the trademark
"50% OFF" / "优惠5折" badge were removed. Only the single current price is shown.
`originalPrice` / `discountBadge` are not used by any content. The packages'
`verified: true` refers to the **price figure only** (Rp13/36/49jt, confirmed by
Pasha); package *inclusions* remain `TODO(Pasha)`.

**Why.** There was no genuine prior price behind either the strikethrough or the
badge. A discount claim with no reference price is misleading advertising, and
the promos have ended anyway.

**Rules out.** Re-introducing a strikethrough for a future promo without a
documented, real prior price and a start/end date in the data module.

---

## 2026-11-11 — `<html lang>` per locale: **postponed**

**Status.** Deferred. The site still ships `<html lang="id">` on `/en` and
`/zh` pages (a client script corrects it after hydration, so crawlers see `id`).

**What was tried and rejected.** Reading the pathname from a request header in
the root layout. It produces the right attribute, but a `headers()` call in the
root layout is incompatible with static rendering: the full build went from
**114 prerendered pages (24 static routes, 15 SSG routes, 19 dynamic)** to
**every route dynamic (ƒ)**. Losing SSG across the whole site to fix one
attribute is a bad trade — worse performance and cost for a cosmetic gain.

**Candidate solution (not started).** Move `<html>`/`<body>` out of the single
root layout into per-locale route groups — `(id)`, `[lang]` — so each tree owns
its own document shell and `lang` is correct in the static HTML while SSG
survives. This moves nearly every page directory, so it is a large, mechanical
diff with real risk of a broken route.

**When it ships.** **Together with building the `/en` homepage**, which does not
exist yet. Both need the same route restructure, so doing them separately would
mean touching the same directories twice and re-verifying everything twice.

**Interim.** Nothing. The alternative (`lang="id"` on English and Chinese pages)
is a known, documented defect; it does not block the rest of the SEO work.

---

## 2026-11-11 — hreflang is declared in both the page `<head>` and the sitemap

**Decision.** `alternates.languages` stays in each page's metadata, and the XML
sitemap now carries the same set as `xhtml:link` entries
(`src/lib/sitemapAlternates.ts`). Both read from `serviceHreflangs()` so they
cannot disagree.

**Why.** Search Console reads the sitemap independently of the page markup. The
sitemap had no language signal at all.

**Rule.** Only declare an alternate that really resolves. An hreflang pointing
at a wrong-language or dead URL teaches Google the whole cluster is unreliable.
`/en/about-us` is therefore deliberately absent.

**Open.** 17 of 21 service slugs have no EN/ZH copy, yet `/en/services/<slug>`
and `/zh/services/<slug>` URLs exist, are self-canonical, and are listed in the
sitemap. They are currently declared as English/Chinese pages holding Indonesian
text — an unresolved question for Pasha (either translate them, or stop
publishing the untranslated prefixes).

---

## 2026-11-11 — `/id/*` is a permanent redirect, not a route

**Decision.** Middleware answers any path under the `/id` segment with a 308 to
the unprefixed URL, preserving the query string.

**Why.** Indonesian is the default language; `/id` was never a route. Only a few
pages handled it, with a 307, and the rest 404'd.

**Details and the full redirect map:** `docs/REDIRECTS.md`.

---

## 2026-11-11 — Portals are secured server-side; `robots.txt` is not security

**Decision.** `/aksesraffi`, `/admin`, `/portal`, `/dashboard`, `/auth` and
`/api/*` enforce authentication in middleware *and* re-check it in the page,
server action, and API handler (`src/middleware.ts`, owner UUID match, Supabase
RLS with `REVOKE ALL` from `anon`/`authenticated`).

**Why.** A `Disallow` line only asks well-behaved crawlers to stay out. It stops
nothing else.

**Rules out.** Treating any `robots.ts` / `X-Robots-Tag` entry as an access
control.

---

## Open questions (blocking work, awaiting Pasha)

Tracked so they are not lost between sessions:

1. Package inclusions for Starter / Investor / Premium (prices are confirmed;
   contents are not).
2. Prices for Visa C2, D2 and ITAS investor (currently `TODO(Pasha)`).
3. Trust claims: `150+` clients, `99%`, `24/7` in `src/lib/businessFacts.ts`, and
   "5.0/5 · 8 reviews" vs the 6 reviews actually published.
4. Build the `/en` homepage, or drop the "three languages" claim?
5. Who verifies the Chinese copy?
