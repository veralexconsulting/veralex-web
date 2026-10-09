# VERALEX Workspace backend handoff

## Scope and status

The Workspace uses Supabase Auth and PostgreSQL through server-only operations. The old order flow and its tables remain in place. Existing legacy admins are mapped to Workspace admin profiles when `public.users` exists; new team admins also receive the legacy admin role for consistent access. Workspace contains no document upload, download, attachment, or storage path. The Workspace schema is additive and uses `workspace_services` and `workspace_payments` to avoid the legacy `services` and `payments` tables.

The local Supabase configuration was added on 9 October 2026. A read-only database check confirmed 19 Workspace tables with RLS and 20 populated SOPs. The deployment history of those schema objects was not verified. Real authentication, mutations, and end-to-end claims have not been exercised. The application fails closed when configuration is absent.

## Deployment configuration

1. Create a Supabase project and obtain `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `DATABASE_URL`. Set the service key and database URI only in server secrets. Use a direct or Session Pooler PostgreSQL connection URI that works from the hosting environment.
   `DATABASE_SSL=require` encrypts the connection but does not verify the server certificate. For verified TLS, download the Supabase CA certificate from Database Settings, set `DATABASE_SSL=verify-full`, and set `DATABASE_CA_CERT` to the PEM content in server secrets.
2. Apply `supabase/migrations/202610090001_workspace_schema.sql`, then `202610090002_workspace_seed.sql`, in order to a backed-up test database. Check pre-existing `public.profiles` and auth triggers before applying to an already customized Supabase project. The migration does not drop customer records.
3. Configure Supabase Auth URL settings and enable Google as an OAuth provider. Set Site URL to `https://www.veralexconsulting.com` and add the exact `https://www.veralexconsulting.com/workspace/auth/callback` to Redirect URLs. The portal and project invitation use that single URL without a query string. The legacy Google flow also needs `https://www.veralexconsulting.com/auth/callback`; password recovery currently needs `https://www.veralexconsulting.com/workspace/auth/callback?next=/admin/aktivasi`. Configure the Google OAuth callback URL supplied by Supabase in Google Cloud. Keep the allow-list narrow for production.
4. Set a long random `CRON_SECRET` for the reminders route. Configure a daily scheduler to GET `/api/workspace/reminders` with `Authorization: Bearer <CRON_SECRET>`.
5. Set `WORKSPACE_BOOTSTRAP_EMAIL`, `WORKSPACE_BOOTSTRAP_NAME`, and `WORKSPACE_BOOTSTRAP_PASSWORD` privately, then run `npm run workspace:bootstrap` exactly once. The command refuses to run when an active admin exists. Remove the bootstrap password from the environment afterward. The first login requires a password change.
6. Run `npm run workspace:verify-db`. Run live authorization and concurrency tests against a non-production Supabase project before promotion.

The project link format is `https://<origin>/invite#<random-token>`. The fragment does not reach HTTP access logs or referrers. The client keeps the token in tab session storage only across the Google redirect, then sends it to a server action and removes it after a successful claim. The database stores its SHA-256 hash only. Avoid routing the Workspace through analytics that collect page URLs.

## Implementation phases

| Phase | Implemented | Verification still required |
| --- | --- | --- |
| Repository audit | Frontend action inventory and legacy table separation | Compare with deployed schema before migration |
| Schema and seed | Additive migration, RLS, twenty populated service SOPs, generated schema-derived row types | Apply to test Supabase and inspect constraints/policies |
| Auth and team | SSR login, logout, reset, first password change, protected server actions, direct Auth Admin API creation, activation/deactivation guards | Live email/password and ban/session behavior |
| Project CRUD | Transactional creation, PIC, client records, workflow snapshot, project updates and immutable audit table | Live SQL transaction and simultaneous mutation tests |
| Link claim | Random expiring hashed token, Google OAuth, atomic row-locked first claim, revoke/reset | Invalid, expired, revoked, replayed, concurrent and wrong-account tests |
| Portal | Client-scoped server snapshot, visible stages/updates, PIC and official contact | Two-account isolation test |
| Priority | Configurable offering, server eligibility, client request, admin review, payment unavailable state, provider interface and dormant verified-event handler with amount/idempotency checks | Real payment provider, signed webhook route and live payment test after separate approval |
| Notifications | Persistent in-app notices, read state, follow-up and overdue cron endpoint, outbox records | Scheduled invocation and future email/push transport |
| Frontend removal | Seeded browser store and preview login removed; Workspace actions use server state | Browser interaction and responsive QA with configured test backend |

Primary files by phase:

- Schema and SOP: `supabase/migrations/202610090001_workspace_schema.sql`, `202610090002_workspace_seed.sql`, `scripts/generate-workspace-seed.mjs`, `src/types/workspace-database.ts`.
- Auth and team: `src/lib/workspace/{auth,supabase,browser}.ts`, `src/middleware.ts`, `src/features/workspace/client-pages.tsx`, `admin-management.tsx`, `scripts/bootstrap-workspace-admin.mjs`.
- Projects, workflows and links: `src/lib/workspace/{operations,claims,queries,token}.ts`, `src/app/workspace-actions.ts`, `src/features/workspace/{store,admin-projects,project-detail,project-workflow}.tsx`.
- Priority and notifications: `src/lib/workspace/payments.ts`, `src/app/api/workspace/reminders/route.ts`, and the Workspace settings, portal and notification components.
- Verification: `scripts/{check-workspace,check-workspace-security,verify-workspace-db}.mjs` and this handoff note.

## Operational constraints

- Workspace data refreshes immediately after a completed mutation, every 20 seconds while the tab is visible, and when the tab regains focus. This is polling, not push-based Supabase Realtime.
- `workspace_payments` has no active provider. A priority request can be reviewed, but the UI cannot show a successful real payment or activate paid service without a verified provider and webhook implementation.
- The outbox marks in-app notifications delivered in the same transaction as persistence. Email and push delivery workers are not configured.
- The row types in `src/types/workspace-database.ts` are generated from the migration. Replace them with Supabase CLI generated types after the deployed schema is validated.
- Existing legacy `public.documents` data, if any, is untouched. The Workspace creates no document table or storage integration.
- Existing published SOP snapshots remain attached to existing projects. New template edits save a draft and require explicit publication.

## Checks executed in this checkout

| Check | Result |
| --- | --- |
| `npm test` | Passed: existing marketing test, twenty SOP templates, 500 random token generation/hash checks |
| `npm run lint` | Passed with two existing image warnings outside Workspace |
| `npm run build` | Passed; public and Workspace routes generated |
| Production HTTP smoke | `/`, `/services/pendaftaran-merek`, `/admin/login`, `/invite`, `/portal/login` returned 200; protected `/admin` and `/portal` redirected to login; reminders endpoint returned 401 without secret |
| Invitation headers | `Referrer-Policy: no-referrer`, `Cache-Control: no-store`, and `X-Robots-Tag: noindex, nofollow` confirmed |
| `node --env-file=.env scripts/verify-workspace-db.mjs` | Passed: 19 RLS tables and 20 populated services |
| Live login, CRUD, RLS and concurrent claim | Not executed; needs configured Auth and two-account acceptance run |
