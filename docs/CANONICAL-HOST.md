# Canonical host: `www` only — action list for Pasha

Checked 2026-11-12 against production with `curl`. This is what actually happens
today, not what the config is supposed to do.

## What is live now

| Request | Status | Lands on | Verdict |
|---|---|---|---|
| `http://veralexconsulting.com/…` | 308 | `https://veralexconsulting.com/…` | OK, Vercel edge |
| `https://veralexconsulting.com/…` | **307** | `https://www.veralexconsulting.com/…` | ⚠️ **temporary** |
| `http://www.veralexconsulting.com/…` | 308 | `https://www.veralexconsulting.com/…` | OK |
| `https://www.veralexconsulting.com/…` | 200 | — | canonical host |

Full chain for a bare-domain URL is `http://` apex → 308 → `https://` apex →
307 → `https://www` (2 hops, ends 200).

**The problem:** the apex → www hop is a **307**, i.e. "temporary". Google treats
that as "don't transfer signals", so bare-domain backlinks keep pointing at a URL
that is being asked to stay in the index as a separate entity. One extra 307 hop
also costs latency on every bare-domain visit.

**What is already done in the app:** every response carries

```
Link: <https://www.veralexconsulting.com/>; rel="canonical"
```

(`next.config.ts` → `headers()`), so the preference is stated even on the 307
response. That is a mitigation, not a fix — it does not change the status code.

---

## Why this cannot be fixed in `next.config.ts`

The redirect is answered by Vercel's edge **before** the request reaches the Next
app, so `redirects()` in `next.config.ts` never sees it. Adding one there would
be dead code.

## Exact steps (Vercel dashboard, ~3 minutes)

1. Open **vercel.com** → team → project **veralex-web** (the project serving
   `veralexconsulting.com`).
2. **Settings → Domains**.
3. Find `veralexconsulting.com` (the one without `www`).
4. Click **Edit** (pencil) → choose **Redirect to another domain**.
5. Set the target to `www.veralexconsulting.com`.
6. Set the status code dropdown to **308 — Permanent** (if the UI offers only
   "Permanent" / "Temporary", pick **Permanent**).
7. Save.
8. Confirm `www.veralexconsulting.com` is still listed with **Valid
   Configuration** and is the *primary* domain.

### Verify (paste back to me)

```bash
curl -sI https://veralexconsulting.com/services/pt-pma | head -3
```

Expected:

```
HTTP/2 308
location: https://www.veralexconsulting.com/services/pt-pma
```

If it still says `307`, the domain is still on "Redirect" without a permanent
status — recheck step 6.

---

## Google Search Console (do after the 308 is live)

1. Search Console → property **`https://www.veralexconsulting.com`** (the URL
   prefix property, if both exist) → **Settings → Change of address** is **not**
   needed here: no domain is changing, only the redirect status. Skip it.
2. **Indexing → Pages** → check that no `https://veralexconsulting.com/…` URLs
   are listed as "Duplicate, Google chose different canonical" once the fix has
   been crawled (allow 2–4 weeks).
3. Optional sanity check: enter a bare-domain URL in **URL Inspection**; it
   should report "Page with redirect" and show the 308.
