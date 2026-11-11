# Redirect map — veralexconsulting.com

Every URL change on this site has to appear here, because the rule during the
cleanup is **never break a URL that has been live**. This file is the source of
truth for what moved where and why.

Status column: `live` = implemented and tested in this repo, `planned` = agreed
but not yet built, `verify` = believed to be handled outside the app (Vercel /
DNS) and must be confirmed in production.

## 1. Locale prefix

Indonesian is the default language and lives on unprefixed URLs. `/en/...` and
`/zh/...` are real, separate URLs with their own copy. `/id/...` is **not** a
route and never has been.

| From | To | Status | Where |
|---|---|---|---|
| `/id` | `/` | live (308) | `src/middleware.ts` → `idPrefixRedirect()` |
| `/id/*` | `/*` | live (308) | same |
| `/en/about-us` | *(renders, canonical → `/about-us`)* | live | exists but declares `/about-us` as canonical, so it is absent from the sitemap on purpose — two URLs for one page is a duplicate, not a redirect job |

Implementation notes:

- The redirect is answered in middleware **before routing**, so it covers the
  entire prefix — `/id`, `/id/about-us`, `/id/services/anything`, typos
  included — not just the handful of pages that exist under `/[lang]`.
- **308, not 307.** A 308 is permanent, so the authority signal sticks, and it
  preserves the request method, which matters because Next's server actions POST
  to the same URLs.
- The query string is preserved (built from `nextUrl.clone()`), so campaign
  attribution (`utm_*`, `gclid`) survives the hop.
- Only a path *starting* with the `/id` segment is matched, so a future page at
  `/services/id-card` is not swallowed.
- `/app/[lang]/services/[slug]/page.tsx` also uses `permanentRedirect()` for
  `lang === 'id'`. That is belt-and-braces: the middleware normally answers
  first, but if the matcher is ever narrowed the route still redirects.

Covered by `scripts/check-id-redirect.mjs` (in `npm test`).

## 2. Legacy legal pages

| From | To | Status | Where |
|---|---|---|---|
| `/en/privacy-policy` | `/privacy-policy` | live (permanent) | `src/app/[lang]/privacy-policy/page.tsx` |
| `/en/terms-and-conditions` | `/terms-and-conditions` | live (permanent) | `src/app/[lang]/terms-and-conditions/page.tsx` |
| `/zh/privacy-policy` | *(renders)* | live | Chinese copy exists |
| `/zh/terms-and-conditions` | *(renders)* | live | Chinese copy exists |

## 3. Scheme / host canonicalisation

| From | To | Status | Where |
|---|---|---|---|
| `http://*` | `https://*` | verify | believed handled by Vercel/DNS — confirm in production |
| apex (`veralexconsulting.com`) | `www.veralexconsulting.com` | verify | `metadataBase` is the `www` host; no explicit redirect in `next.config.ts` — requires a deliberate decision (see `docs/DECISIONS.md`) |
| `/path/` (trailing slash) | `/path` | live | `next.config.ts` → `trailingSlash: false` |

## 4. What must **not** redirect

These are real, self-canonical URLs and any redirect on them would be a
regression:

- `/` — the Indonesian home. It carries the language toggle, so it is *not*
  redirected to `/en`.
- `/services/{slug}` — Indonesian service pages (21 slugs).
- `/en/services/{slug}`, `/zh/services/{slug}` — localised service pages. All
  21 slugs exist under both prefixes, but only four (see below) have translated
  copy; the rest render the Indonesian catalogue text.
- `/about-us`, `/zh/about-us`, `/gallery`, `/artikel`, `/artikel/{slug}`.
- `/en/about-us` — it renders (the `[lang]` segment is dynamic), and its
  canonical points at `/about-us`. It is left alone rather than redirected
  because a canonical already handles duplicate consolidation; redirecting a
  200 would be a second, redundant signal.
- `/privacy-policy`, `/terms-and-conditions`, and their `/zh/...` twins.

## 5. Slugs with real EN/ZH copy

Only these four have translated landing copy. The other 17 slugs exist under
`/en` and `/zh` but serve Indonesian content — relevant to the sitemap hreflang
set and to the still-open question of what to do about them.

- `pt-pma`
- `itas-investor-1-tahun`
- `itas-investor-2-tahun`
- `pendaftaran-merek`

## Change log

- 2026-11-11 — `/id/*` moved from a per-route 307 to a middleware 308; query
  string preserved; `/id` root covered.
