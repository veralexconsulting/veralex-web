# VERALEX Workspace backend integration inventory

## Existing state

- Next.js 16 App Router; new workspace presentation lives in `src/features/workspace/`.
- `store.tsx` now loads authorized server snapshots and sends mutations through server actions; it does not persist browser records.
- Existing `public.users`, `services`, `orders`, `payments`, and `documents` belong to an older order flow. Workspace tables will be additive and named `workspace_*` where legacy names collide. No migration deletes old data.
- No `.env.local`, Supabase CLI, or local PostgreSQL client is present. Production authentication and database scenarios require project credentials and a test database.

## Frontend action → server operation

| UI action | Server operation | Actor |
| --- | --- | --- |
| Admin login/logout/password change/reset | Supabase Auth SSR | Admin |
| List dashboard, projects, clients, team, SOP | Server queries after active admin verification; RLS also blocks direct browser access | Active admin |
| Add/deactivate/reactivate team | Protected server action + Auth Admin API + profile update | Active admin |
| Create/edit/archive project and PIC | Transactional SQL plus audit/outbox | Active admin |
| Edit project stages/tasks; complete/reopen | Transactional SQL plus audit/client update | Active admin |
| Publish internal/client-visible update | Transactional project update plus audit/notification | Active admin |
| Edit SOP template/priority offering | Versioned SQL plus audit | Active admin |
| Generate/revoke/reset access link | Random token, SHA-256 hash, SQL transaction | Active admin |
| Open link and Google sign-in | Fragment token handoff + Supabase OAuth + server token status check | Authenticated Google user for claim |
| Claim link | Row-locked SQL transaction, one owner | Authenticated Google user |
| List portal/detail | Server queries scoped to bound project IDs; RLS blocks direct browser reads | Bound client |
| Request/cancel priority | Eligibility validation + SQL transaction | Bound client |
| Review priority | SQL transaction + audit/outbox | Active admin |
| Read notifications | Project-scoped RLS update | Authorized actor |

## Delivery phases

1. Schema, policies, seed, and runtime config.
2. Auth, direct team creation, and route protection.
3. Projects, workflow, link claims, and client portal.
4. Priority, notifications, audit, frontend mock removal, and tests.

Each phase is tracked in the migration and implementation notes in this directory. External deployment is not performed without actual project credentials and database access.
