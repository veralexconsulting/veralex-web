# VERALEX Workspace — frontend review inventory

## Repository and scope

- Next.js 16.1.6 App Router, React 19, strict TypeScript, plain global CSS; no Tailwind or icon library.
- Existing public routes, marketing content, prices, SEO, imagery, and WhatsApp actions remain in place.
- The new workspace is a frontend review build. It uses typed browser state for project and workflow interactions. It has no production authentication, authorization, database persistence, atomic link claims, or payment processing. Those require a separately approved backend phase.
- Original `public/logo.webp` is used on workspace, access, and portal screens.
- Existing Supabase-backed order routes are legacy functionality. Their document upload/download surfaces and upload server actions were removed without deleting any existing stored files or database rows. Existing data needs a separate migration review before backend consolidation.

## Routes

| Area | Routes |
| --- | --- |
| Access | `/admin/login`, `/admin/aktivasi`, `/invite/[token]` |
| Admin | `/admin`, `/admin/proyek`, `/admin/proyek/baru`, `/admin/proyek/[id]`, `/admin/klien`, `/admin/klien/[id]`, `/admin/tim`, `/admin/pengaturan`, `/admin/notifikasi` |
| Client | `/portal`, `/portal/proyek/[id]`, `/portal/notifikasi` |
| Existing | Public marketing routes, `/auth/*`, `/dashboard/*`, `/admin/orders/*`, `/admin/settings` |

## Files and components

Created: `src/features/workspace/model.ts`, `workflowCatalog.ts`, `store.tsx`, `ui.tsx`, `admin-projects.tsx`, `project-detail.tsx`, `project-workflow.tsx`, `admin-management.tsx`, `client-pages.tsx`, `LegacyAdminLayout.tsx`, and `workspace.css`; route pages under `src/app/admin/{login,aktivasi,proyek,klien,tim,pengaturan,notifikasi}`, `src/app/invite/[token]`, and `src/app/portal`; `scripts/check-workspace.mjs`; and this inventory.

Modified: `src/app/admin/layout.tsx`, `page.tsx`, `actions.ts`; legacy admin order detail page/component; `src/app/dashboard/actions.ts` and legacy client order detail page/component; `src/middleware.ts`; `next.config.ts`; and `scripts/check-marketing.mjs`. Existing `supabase/*.sql` moves to `supabase/lama/` and `prd_new_fitur.md` were present before this frontend work and were not changed here.

Reusable UI: `WorkspaceShell`, `PageHeader`, `Badge`, `ProjectCard`, `ProjectTable`, `Timeline`, `ProgressSummary`, `EmptyState`, `ConfirmDialog`, `NoticeList`, and `ProjectWorkflowEditor`.

## Frontend completion checklist

- [x] Two application roles in domain model: admin and client. PIC is project assignment, not a role.
- [x] Dashboard, responsive project list, creation and detail; creator, PIC, last updater, activity, client progress.
- [x] Complete starter SOPs for all 20 website service variants, including five product certification offerings, with editable template versions and project snapshots.
- [x] Individual project stage/task addition, editing, reordering, removal, conditional steps, status changes, and exception reasons.
- [x] Shareable project link UI, claim, revoke, regenerate, reset, and client-account isolation as frontend interactions.
- [x] Team account creation form with initial password and confirmation; password is validated and discarded, never saved to browser state.
- [x] Client management, priority configuration/request review, and role-specific notifications.
- [x] Removed document interfaces and upload actions, including legacy order screens; no stored customer data deleted.
- [x] Original VERALEX logo and responsive workspace/portal layouts.
- [ ] Production security and persistence: explicitly outside the approved frontend scope.

## Validation performed

- `npx tsc --noEmit`: passed on the completed frontend.
- `npm run lint`: passed with two pre-existing `<img>` warnings in the legacy dashboard layout and marketing testimonials.
- `npm run build`: passed and generated all new routes.
- `npm test`: marketing regression test passed.
- `node scripts/check-workspace.mjs`: all 20 service SOPs, trademark/PT PMDN stage counts, snapshot isolation, and no-document/no-password model checks passed.
- Production server smoke test: 19 selected workspace/invitation/public routes returned HTTP 200. Invitation headers include `Referrer-Policy: no-referrer`, `Cache-Control: no-store`, and `X-Robots-Tag: noindex, nofollow`.
- Interactive browser and viewport screenshot QA could not be completed: the browser connection list was empty and the available headless Firefox session did not produce a screenshot. Responsive CSS was implemented for desktop, tablet, and mobile; it still needs visual product-owner review.

## Review flows

1. Open `/admin/login`, then use the local frontend review entry. The email/password form cannot authenticate until the backend phase.
2. On `/admin/proyek/baru`, select a website service and inspect its prefilled SOP. Create a project and open its generated link in the sharing panel. Browser state is temporary and local to this browser.
3. Open the link to review first-claim, previously claimed, expired, revoked, and invalid states. Google sign-in requires the future backend; the frontend review control changes local profile state only.
4. Edit tasks and stages on the project's workflow tab, change PIC, and inspect the activity history. Create another project with the same service to confirm its snapshot is unchanged.
5. Use `/admin/tim` to inspect direct account creation and deactivation safeguards. No Supabase Auth user is created in this phase.
6. Use `/portal` and `/portal/proyek/[id]` to inspect the client-visible timeline and priority request flow. Payment is unavailable pending an approved provider.

## Backend integration boundary

- Replace `src/features/workspace/store.tsx` with trusted server operations and map their results to `model.ts` contracts. Do not use browser state as authorization evidence.
- Implement Supabase Auth for admins and Google OAuth for clients, active-admin checks, first-login password change, and server-only team user creation.
- Create transactional project/SOP snapshot persistence, append-only audit logs, RLS, and atomic single-use first-claim link handling with hashed tokens. Existing local token behavior is only a visual interaction.
- Use verified provider webhooks before any real priority payment state. The current UI does not mark payments successful.
- Keep document storage outside the new portal. Review legacy stored data separately; no destructive migration is included here.

## SOP review sources

These are operational starting points for VERALEX legal-team review, not promised government procedures or processing times. Official starting references: [DJKI](https://www.dgip.go.id/index.php/artikel/detail-artikel-berita/permenkum-baru-kini-pemeriksaan-substantif-merek-jadi-lebih-cepat?kategori=pengumuman), [AHU PT](https://portal.ahu.go.id/page/faq/faq-perseroan), [AHU PT Perorangan](https://panduan.ahu.go.id/doku.php?id=panduan_pendirian_ptp), [OSS](https://oss.go.id/id/panduan), [BPJPH](https://bpjph.halal.go.id/read/kepala-bpjph-urus-sertifikasi-halal-itu-mudah-begini-caranya), [BPOM](https://www.pom.go.id/layanan), [Sertifikasi Perangkat Telekomunikasi](https://sertifikasi.postel.go.id/sertifikasi/informasi-sertifikasi/persyaratan-dan-kewajiban), and [Imigrasi](https://imigrasi.go.id/siaran_pers/ditjen-imigrasi-terapkan-kebijakan-terbaru-tentang-klasifikasi-visa).
