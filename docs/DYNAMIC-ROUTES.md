# The 19 dynamic routes: what each one is, and why it stays dynamic

Taken from the build output (`npm run build`, Next 16.4 @ `053b3af`). A dynamic
`ƒ` route renders per request. There are 19: 18 pages and the middleware proxy.
None of them is public content, so none of them can be made static without
either weakening auth or serving a stale, person-specific page to everyone.

| # | Route | Why it must be dynamic | Could it be static/ISR? |
|---|---|---|---|
| 1 | `/admin/klien/[id]` | Server component reads Supabase for the signed-in admin, per client id. | No. Data is per-user and private. |
| 2 | `/admin/proyek/[id]` | Same, per project id. | No. |
| 3 | `/aksesraffi` | Token-gated internal screen (auth checked before it renders). | No. |
| 4 | `/aksesraffi/ganti-password` | Password change form behind the same gate. | No. |
| 5 | `/aksesraffi/login` | Auth entry point; must set cookies per request. | No. |
| 6 | `/api/analytics/event` | Write endpoint (POST). | Not a page. |
| 7 | `/api/analytics/overview` | Read endpoint, auth-gated. | Not a page. |
| 8 | `/api/workspace/reminders` | Read endpoint, auth-gated. | Not a page. |
| 9 | `/auth/callback` | OAuth/PKCE exchange. Must read the live cookie and code. | No. A cached response would break sign-in. |
| 10 | `/dashboard` | Signed-in workspace home. | No. |
| 11 | `/dashboard/orders` | Signed-in order list. | No. |
| 12 | `/dashboard/orders/[id]` | Signed-in single order. | No. |
| 13 | `/invite` | Reads a one-time invite token from the URL/cookie. | No. A shared cache would let token A see token B. |
| 14 | `/portal` | Client portal home, session-gated. | No. |
| 15 | `/portal/login` | Auth entry point. | No. |
| 16 | `/portal/notifikasi` | Per-client notifications. | No. |
| 17 | `/portal/pengaturan` | Per-client settings. | No. |
| 18 | `/portal/proyek/[id]` | Per-client project. | No. |
| 19 | `Proxy (Middleware)` | Runs on every non-static request to refresh the Supabase session cookie. | It **must** stay dynamic. This is what keeps the session alive. |

## Conclusion

There is nothing to convert. Every public, indexable page is already static or
SSG:

- **24 static** `○` routes (home, services index, about, gallery, artikel index,
  contact, auth screens, the articles/services parents).
- **15 SSG** `●` routes under `/en`, `/zh`, `/en/services/*`, `/artikel/*` and
  the translated service pages.
- **50 URLs** in the sitemap, all of which are served from the prerendered HTML.

The 19 dynamic routes are the authenticated product. Converting any of them
would mean either caching someone's client data for everyone to fetch, or
sending a logged-out HTML shell. Both are worse than the half-second of server
time each request costs.

**One thing that *is* worth knowing:** because `/portal`, `/dashboard` and
`/admin` are dynamic, they are never in the sitemap and never indexed — that is
correct, and it is why the SEO audit excludes them (see `docs/SEO-AUDIT.md`).

## If this list ever grows

The only dynamic routes that should exist are ones that read a session, a token,
or a request body. A new *public* page has no reason to be `ƒ`; if one appears,
check whether it is calling `cookies()`/`headers()` unnecessarily — that call is
what forces the route to render on demand.
