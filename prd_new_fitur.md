# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# VERALEX Workspace & Client Tracking Portal

**Product:** VERALEX CONSULTING  
**Project Type:** Existing Next.js Application Extension  
**Version:** 1.0  
**Status:** Ready for Codex Implementation Planning  
**Primary Stack:** Next.js + TypeScript + Supabase  
**Website:** https://veralexconsulting.com

---

## 1. PROJECT OVERVIEW

### 1.1 Background

VERALEX CONSULTING currently operates a public-facing website providing business legal consulting services, including company establishment, intellectual property registration, business licensing, product certification, and immigration services.

The existing website functions as a marketing and lead-generation platform.

Customers browse available services and contact the VERALEX team through WhatsApp for consultation, negotiation, and closing.

The business now requires an internal project management system and client-facing tracking portal.

This functionality must be integrated into the **existing Next.js codebase**.

Do not create a separate Next.js application or replace the existing website.

### 1.2 Product Objectives

Build an integrated platform that enables:

1. VERALEX administrators to manage customer service projects.
2. Automatic generation of project workflows based on selected services.
3. Assignment of a responsible administrator (PIC) to each project.
4. Secure client access through invitation links and Google authentication.
5. Transparent project tracking for clients.
6. Comprehensive accountability through activity and audit logs.
7. Optional paid priority-handling services.
8. Future Android application support using the same backend.
9. Minimal administrative workload through task automation and intuitive UI.

### 1.3 Core Product Philosophy

**Simple for staff. Transparent for clients. Secure by default. Scalable by design.**

The platform must not become an unnecessarily complicated enterprise resource planning system.

Administrative users should immediately understand what needs to be done.

Client users should immediately understand the status of their services.

---

## 2. EXISTING CODEBASE PRESERVATION

### 2.1 Mandatory Repository Inspection

Before implementing any functionality, Codex MUST inspect the existing workspace.

Inspect:

- Project directory structure.
- Next.js version and routing architecture.
- TypeScript configuration.
- Existing styling and design system.
- Package manager and dependencies.
- Existing authentication implementations.
- Existing API routes and server actions.
- Current environment variable conventions.
- Existing database integrations, if any.
- Deployment configuration.
- Existing navigation, layouts, and middleware/proxy.
- Existing public pages and WhatsApp contact flows.

Do not assume the project is empty.

### 2.2 Preservation Requirements

Codex MUST:

- Preserve all existing public pages.
- Preserve current service content and pricing.
- Preserve existing SEO metadata.
- Preserve current WhatsApp CTA behavior.
- Preserve existing responsive layouts.
- Preserve existing branding and assets.
- Avoid unnecessary dependency upgrades.
- Avoid unrelated refactoring.
- Reuse existing UI components where practical.
- Maintain compatibility with the current deployment.

No destructive database migrations.

No deletion or rewriting of public website functionality without explicit authorization.

### 2.3 Implementation Rule

Extend the current application using the existing architecture.

If the repository uses Next.js App Router, follow its established conventions.

Do not introduce an independent backend server unless a concrete technical requirement justifies it.

Before modifying files, provide a short implementation plan listing affected modules and potential compatibility risks.

---

## 3. BUSINESS WORKFLOW

### 3.1 Customer Acquisition

The public website continues to operate as before.

Customer journey:

1. Customer visits veralexconsulting.com.
2. Customer selects a legal consulting service.
3. Customer contacts VERALEX through WhatsApp.
4. VERALEX discusses requirements, pricing, and service scope.
5. Customer and VERALEX reach an agreement.
6. VERALEX administrator creates a project internally.
7. Administrator generates a secure invitation.
8. Invitation is delivered through WhatsApp.
9. Customer opens the invitation link.
10. Customer signs in using Google.
11. System verifies the authenticated Google identity against the invitation.
12. Customer gains access to the assigned project.
13. Customer tracks project progress through the portal.

### 3.2 Important Business Rule

The public website does NOT require:

- Online checkout for the initial service.
- Public customer registration.
- Automatic project creation from website visitors.
- Automatic service orders.
- Public project submission forms.

Projects are created manually by VERALEX administrators after WhatsApp closing.

The priority-handling payment feature is separate from the original service agreement.

---

## 4. USER ROLES

The system contains exactly two application roles.

### 4.1 ADMIN

Authentication: email and password using Supabase Auth.

Every admin has equal administrative permissions.

Admin capabilities:

- View all projects.
- Create projects.
- Edit projects.
- Archive and restore projects.
- Manage clients.
- Create and invite new administrators.
- Deactivate administrator accounts.
- Assign and reassign project PICs.
- Manage project workflows.
- Manage service templates.
- Update project statuses.
- Complete tasks.
- Upload project documents.
- Review activity logs.
- Configure priority service offerings.
- Manage priority requests.
- Access operational dashboards.
- Manage system settings.

No super-admin hierarchy.

All administrators have equal application-level authority.

### 4.2 CLIENT

Authentication: Google OAuth using Supabase Auth.

Client capabilities:

- View authorized projects.
- View project progress.
- View project updates.
- View assigned PIC information.
- View authorized documents.
- View project activity intended for clients.
- Submit priority-handling requests when eligible.
- View priority request and payment statuses.
- Access multiple projects linked to the same Google identity.

Clients must never access other customers' projects or internal administrative information.

### 4.3 Account Safety

Although all administrators have equal permissions, enforce:

- No public admin registration.
- Admin accounts created through authorized server-side invitations.
- Admin password set privately by the invited administrator.
- Admin cannot deactivate their own account.
- Last active admin cannot be deactivated.
- Audit logs cannot be edited through the application.
- Destructive operations require confirmation.
- Sensitive administrative actions are logged.

Bootstrap the initial admin through a controlled deployment procedure.

Never implement a public endpoint that automatically grants admin privileges.

---

## 5. AUTHENTICATION AND INVITATIONS

### 5.1 Administrator Authentication

Route:

`/admin/login`

Authentication method:

- Email.
- Password.
- Supabase Auth.

Admin registration must not be publicly accessible.

An existing administrator creates an invitation for another administrator.

The invited administrator receives a secure activation link and sets their password.

### 5.2 Client Authentication

Client authentication uses Google OAuth.

The customer does not independently register for a project.

Project access is granted only through an administrator-created invitation.

Example invitation route:

`/invite/[token]`

### 5.3 Invitation Flow

1. Admin creates a project.
2. Admin enters the client's Google email address.
3. System generates a cryptographically secure invitation token.
4. Only a hash of the token is stored in the database.
5. Invitation has an expiration timestamp.
6. Admin copies the invitation URL.
7. Admin sends the URL through WhatsApp.
8. Client opens the invitation.
9. Client authenticates with Google.
10. Backend validates the authenticated, verified email against the invitation.
11. Backend validates token validity, expiration, and redemption status.
12. Backend atomically associates the authenticated user with the project.
13. Invitation is marked as accepted.
14. Client is redirected to the project portal.

An invitation token must be single-use for initial claiming.

After successful claiming, the client's project access is based on the authenticated user ID and database authorization, not possession of the original invitation URL.

### 5.4 Returning Clients

Clients can visit:

`/portal`

They sign in using Google and see all projects they are authorized to access.

They do not need the original invitation again.

### 5.5 Access Rules

- Wrong Google account: access denied.
- Expired invitation: access denied with instructions to request a new invitation.
- Revoked invitation: access denied.
- Unauthenticated user: redirected to login.
- Unauthorized project: access denied.
- Revoked project membership: project access removed.

Preserve the intended invitation destination throughout the OAuth redirect process using a secure state mechanism.

Do not rely on client-side email comparison for authorization.

---

## 6. ADMIN WORKSPACE

### 6.1 Main Navigation

Keep the interface minimal.

Primary navigation:

1. Dashboard
2. Projects
3. Clients
4. Team
5. Settings

Project tasks and activity logs should primarily be accessible from project details.

Avoid unnecessary navigation categories.

### 6.2 Dashboard

The dashboard is the default admin landing page.

Display:

- Active projects.
- Projects requiring action.
- Projects waiting for clients.
- Overdue follow-ups.
- Paid priority projects.
- Recently updated projects.

Main CTA:

**Create Project**

Primary dashboard section:

**Needs Attention Today**

Each item displays:

- Client or company name.
- Service.
- Current task.
- Assigned PIC.
- Priority status.
- Due date, if applicable.
- Action button.

The dashboard must prioritize actionable information rather than decorative analytics.

### 6.3 Create Project

Required fields:

- Client name or company name.
- Client Google email.
- Service type.
- Project title.
- Primary PIC.

Optional fields:

- Client phone number.
- Internal notes.
- Start date.
- Expected next follow-up date.
- Supporting administrators.
- Relevant service details.

On creation:

1. Validate submitted data.
2. Create project.
3. Assign creator.
4. Assign PIC.
5. Instantiate workflow from the selected service template.
6. Generate invitation.
7. Record project creation audit event.
8. Display the new project and invitation-sharing action.

Creation must be transactional where appropriate to prevent partially initialized projects.

### 6.4 Project Detail

The project detail page displays:

- Project ID.
- Project title.
- Client information.
- Service type.
- Current status.
- Creator.
- Primary PIC.
- Last updated by.
- Last update timestamp.
- Current workflow stage.
- Current actionable task.
- Internal checklist.
- Client-visible progress.
- Activity history.
- Documents.
- Priority service status.

The interface should emphasize the next action.

Examples:

- Complete Task
- Request Documents
- Update Status
- Record External Decision
- Set Follow-up
- Reassign PIC

Avoid presenting every possible action with equal visual importance.

### 6.5 PIC Assignment

Every project has one primary PIC.

All administrators may access and modify projects regardless of PIC assignment.

PIC assignment is for accountability and workload organization, not authorization restrictions.

Changing the PIC must create an audit event.

### 6.6 Team Management

Every administrator can:

- Invite a new admin.
- View existing admins.
- View assigned project counts.
- Deactivate eligible accounts.
- Reactivate accounts through an authorized workflow.
- Review account invitation status.

Do not expose password values.

---

## 7. SERVICE WORKFLOW ENGINE

### 7.1 Objective

Each service must have a predefined workflow.

When an administrator selects a service, the system automatically creates its workflow and checklist.

Administrators must not be required to manually design a workflow for every new customer.

### 7.2 Two Workflow Layers

**Internal workflow**

Detailed operational checklist for administrators.

**Client-facing workflow**

Simplified, understandable stages visible to customers.

Internal tasks may be grouped under one client-facing stage.

### 7.3 Workflow Configuration

Each workflow template supports:

- Service identifier.
- Template version.
- Stage name.
- Stage description.
- Stage order.
- Internal tasks.
- Client-facing label.
- Client-facing description.
- Required tasks.
- Optional tasks.
- Conditional tasks.
- Task dependencies.
- Follow-up intervals.
- Evidence requirements.
- Eligibility for priority handling.

### 7.4 Workflow Statuses

Project-level statuses:

- Draft
- Active
- Waiting for Client
- Waiting for External Institution
- Needs Review
- Completed
- Rejected / Unsuccessful
- Cancelled
- Archived

Task-level statuses:

- Pending
- In Progress
- Blocked
- Completed
- Skipped

Stage-level completion must be derived from relevant tasks and approved transitions.

Administrators can record exceptional outcomes with a reason.

### 7.5 Workflow Versioning

When a project is created, instantiate a snapshot of the current approved workflow template.

Future edits to the template must not silently modify existing projects.

Workflow migrations for existing projects must be explicit and auditable.

---

## 8. INITIAL SERVICE TEMPLATES

The platform must support configurable templates for the services currently offered by VERALEX.

Initial template catalog:

- Trademark Registration.
- Trademark Renewal.
- Trademark Ownership Transfer.
- Copyright Registration.
- Industrial Design Registration.
- PT Perorangan.
- CV Establishment.
- PT PMDN.
- PT PMA.
- Investor ITAS.
- Work KITAS.
- Visa services.
- Halal Certification.
- BPOM Registration.
- SNI Certification.
- K3L.
- Postel Certification.

Do not hardcode the catalog into UI components.

Store service definitions and workflows in the database.

### 8.1 Initial Fully Specified Template: Trademark Registration

Client-facing stages:

**Stage 1 — Document Collection**

Internal tasks:

- Confirm applicant identity and applicant type.
- Obtain trademark name and label/logo if applicable.
- Collect product/service description.
- Obtain required supporting documents.
- Verify completeness.

**Stage 2 — Preliminary Trademark Review**

Internal tasks:

- Search relevant trademark records.
- Review potentially conflicting marks.
- Determine applicable goods/services classes.
- Review goods/services descriptions.
- Communicate preliminary findings.
- Obtain client confirmation before proceeding.

**Stage 3 — Application Preparation**

Internal tasks:

- Verify applicant details.
- Prepare required authorization documents.
- Validate trademark representation.
- Validate classifications.
- Confirm filing readiness.

**Stage 4 — DJKI Submission**

Internal tasks:

- Prepare the official application.
- Complete applicable billing/payment steps.
- Submit the application.
- Record application number.
- Store filing acknowledgment.

**Stage 5 — DJKI Processing**

Internal tasks:

- Monitor formalities examination.
- Monitor publication.
- Monitor objections if any.
- Monitor substantive examination.
- Record official correspondence.
- Respond to requests or objections when applicable.
- Record relevant official decisions.

**Stage 6 — Decision and Handover**

Internal tasks:

- Record final application outcome.
- Verify official documents.
- Deliver certificate if approved.
- Explain further options if refused or otherwise unsuccessful.
- Record handover.
- Close the project.

### 8.2 Workflow Branching

The system must support cases such as:

- Missing documents.
- Client-requested changes.
- Official correction requests.
- Objections.
- Provisional refusal.
- Final refusal.
- Additional required action.
- Successful registration.

Do not force all projects through a single successful completion path.

### 8.3 Legal Process Validation

All initial workflow templates must be treated as operational drafts until approved by the VERALEX legal team.

Codex must not invent legally binding timelines or guarantee approval.

Government processing timelines must not be represented as controllable by VERALEX.

For services other than trademark registration, implement the configurable workflow engine first and populate detailed SOP templates only from verified requirements or approved service definitions.

Unverified templates must be marked Draft and must not be available for production project creation until approved.

---

## 9. CLIENT PORTAL

### 9.1 Main Route

`/portal`

### 9.2 Client Dashboard

Display:

- Client's active projects.
- Service name.
- Project reference number.
- Current stage.
- Latest update.
- Assigned PIC.
- Next expected action.
- Project status.

### 9.3 Project Tracking Page

Display:

- Project overview.
- Client-facing timeline.
- Completed stages.
- Current stage.
- Upcoming stages.
- Recent updates.
- Required client actions.
- Authorized downloadable documents.
- Assigned PIC information.
- Priority service option, when eligible.

Do not expose:

- Internal notes.
- Private administrative checklists.
- Internal employee discussions.
- Other customers' information.
- Sensitive audit metadata.
- Confidential pricing or operational settings.

### 9.4 Progress Calculation

Do not calculate progress using arbitrary elapsed time.

Progress should reflect completed workflow stages or tasks.

For externally controlled processes, show the current official processing stage rather than implying guaranteed completion percentages.

Avoid misleading completion estimates.

### 9.5 Mobile Experience

The client portal must be mobile-first.

Requirements:

- Responsive layout.
- Clear progress timeline.
- Large touch targets.
- Minimal navigation.
- Readable status messages.
- Accessible contrast.
- Fast page loading.

---

## 10. ACTIVITY LOGS AND ACCOUNTABILITY

### 10.1 Mandatory Project Metadata

Each project stores:

- `created_by`
- `created_at`
- `pic_user_id`
- `updated_by`
- `updated_at`

These fields have distinct meanings.

`created_by` must remain unchanged.

`pic_user_id` can change.

`updated_by` changes whenever a meaningful project mutation occurs.

### 10.2 Audit Events

Record:

- Project created.
- Project updated.
- Project archived.
- Project restored.
- PIC assigned.
- PIC changed.
- Project status changed.
- Task completed.
- Task reopened.
- Workflow overridden.
- Document added or removed.
- Client invitation created.
- Client invitation revoked.
- Client access granted or revoked.
- Admin account invited or deactivated.
- Service template modified.
- Priority pricing changed.
- Priority request approved or rejected.
- Payment status updated.

### 10.3 Audit Data

Each event should contain:

- Event ID.
- Actor user ID.
- Actor role.
- Project ID, where applicable.
- Event type.
- Timestamp.
- Sanitized before/after values where relevant.
- Optional reason.

Audit events must be generated by trusted backend/database operations.

Do not trust actor IDs supplied by frontend requests.

Use database transactions for business mutations and their associated audit events.

Audit history must be append-only from the application perspective.

Do not include secrets, passwords, authentication tokens, or complete identity documents in audit payloads.

### 10.4 UI Presentation

Example:

"Rifdah completed document verification."

"Fajar changed the project status from Preparation to Submitted."

"Ahmad created the project."

Every event includes a timestamp.

---

## 11. PAID PRIORITY-HANDLING SERVICE

### 11.1 Feature Overview

Eligible clients may request paid priority handling for specific VERALEX-controlled operational activities.

This feature must never promise faster processing by DJKI or other government authorities unless a legitimate official expedited mechanism exists and its terms have been verified.

### 11.2 Client UI

Show:

**Request Priority Handling**

Only when the project is eligible.

Before payment, explain:

- What additional service is provided.
- Which activities receive priority.
- Expected internal response or handling commitment.
- Applicable limitations.
- Price.
- Payment terms.
- Refund/cancellation conditions.

### 11.3 Priority Workflow

1. Client opens project.
2. Client selects priority handling.
3. System checks eligibility.
4. System displays the applicable offering or requests admin review.
5. Client accepts terms.
6. Payment is initiated.
7. Payment provider processes transaction.
8. Verified payment webhook confirms successful payment.
9. System activates priority status.
10. Assigned PIC and admins are notified.
11. Priority work appears in the admin dashboard.
12. Fulfillment is tracked and recorded.

### 11.4 Payment Integration

Design a payment-provider abstraction.

Possible future providers:

- Midtrans.
- Xendit.

Do not select or integrate a production payment provider without configuration and business approval.

Never mark payment as successful based solely on a client-side redirect.

Verify payment webhooks and ensure idempotent processing.

### 11.5 Pricing

Prices must be stored in the database.

Administrators can manage eligible offerings and prices.

Store the agreed price snapshot on each priority request.

Future pricing changes must not retroactively alter existing transactions.

### 11.6 MVP Boundary

The initial release may include:

- Priority offering configuration.
- Eligibility logic.
- Priority request records.
- Admin review.
- UI states for pending and approved requests.

Production payment processing must remain disabled until provider integration, legal terms, and operational fulfillment are approved.

Do not create a fake successful payment flow.

---

## 12. DATABASE DESIGN — SUPABASE

Use Supabase PostgreSQL.

Proposed logical tables:

### Identity

`profiles`
- id
- email
- full_name
- role
- is_active
- created_at
- updated_at

`admin_invitations`
- id
- email
- invited_by
- status
- created_at
- expires_at

### Customers

`clients`
- id
- name
- email
- phone
- auth_user_id
- created_at

`client_project_access`
- id
- client_id
- project_id
- auth_user_id
- granted_at
- revoked_at

### Services and Templates

`services`
- id
- slug
- name
- description
- is_active

`workflow_templates`
- id
- service_id
- version
- approval_status
- is_active

`workflow_template_steps`
- id
- template_id
- title
- description
- position
- visibility

`workflow_template_tasks`
- id
- template_step_id
- title
- position
- is_required
- configuration

### Projects

`projects`
- id
- reference_number
- client_id
- service_id
- workflow_template_id
- title
- status
- created_by
- pic_user_id
- updated_by
- created_at
- updated_at

`project_members`
- id
- project_id
- user_id

`project_steps`
- id
- project_id
- template_step_id
- title
- position
- status
- completed_at

`project_tasks`
- id
- project_step_id
- title
- status
- assigned_to
- due_at
- completed_by
- completed_at

`project_updates`
- id
- project_id
- author_id
- message
- visibility
- created_at

### Invitations

`project_invitations`
- id
- project_id
- invited_email
- token_hash
- created_by
- expires_at
- accepted_at
- revoked_at

### Audit

`audit_logs`
- id
- actor_id
- project_id
- action
- old_data
- new_data
- created_at

### Documents

`project_documents`
- id
- project_id
- uploaded_by
- storage_path
- filename
- visibility
- created_at

### Priority Services

`priority_offerings`
- id
- service_id
- title
- description
- price
- eligibility_rules
- is_active

`priority_requests`
- id
- project_id
- offering_id
- requested_by
- price_snapshot
- status
- created_at

`payments`
- id
- priority_request_id
- provider
- provider_reference
- amount
- status
- created_at
- confirmed_at

### Notifications

`notifications`
- id
- recipient_id
- type
- title
- body
- target_path
- read_at
- created_at

`notification_outbox`
- id
- event_type
- payload
- status
- attempts
- created_at

`device_tokens`
- id
- user_id
- platform
- token
- is_active
- created_at

### Schema Implementation Rules

This schema is a logical starting point, not a requirement to create every table immediately.

Codex must refine:

- Foreign keys.
- Uniqueness constraints.
- Indexes.
- Enum/check constraints.
- Deletion policies.
- Timestamp management.
- Transaction boundaries.
- Referential integrity.
- Migration ordering.

Avoid duplicating identities unnecessarily.

Ensure client access can support multiple projects and access revocation.

---

## 13. SECURITY REQUIREMENTS

### 13.1 Authorization

Use Supabase Row Level Security.

Clients can read only explicitly authorized project records.

Administrators can manage all projects.

Sensitive writes must use trusted server-side operations with explicit authorization checks.

Do not rely exclusively on frontend route guards.

### 13.2 Authentication Separation

Admins use email/password.

Clients use Google OAuth.

Do not assume authentication method alone proves authorization role.

Role assignments must be controlled by trusted backend operations.

A Google-authenticated user must not automatically become an administrator.

### 13.3 Storage

Use private Supabase Storage buckets for confidential project documents.

Downloads must require authenticated authorization.

Use short-lived signed URLs or equivalent protected delivery.

### 13.4 Secrets

Never expose:

- Supabase service-role key.
- Database credentials.
- Payment provider secrets.
- Webhook signing secrets.
- Administrative bootstrap secrets.

Never commit production secrets to Git.

### 13.5 Additional Protections

Implement:

- Input validation.
- Server-side authorization.
- Rate limiting for sensitive endpoints.
- Safe invitation token handling.
- Secure OAuth redirects.
- CSRF protections where applicable.
- Audit logging.
- Appropriate error handling.
- Protection against duplicate mutations.
- Safe handling of sensitive personal data.

---

## 14. UI/UX REQUIREMENTS

### 14.1 Visual Identity

Follow the existing VERALEX brand.

Preferred palette:

- Maroon: `#4A0E0E`
- Near-black: `#1E1E1E`
- White: `#FFFFFF`
- Restrained gold: `#C8A15A`

Do not unnecessarily redesign the existing public website.

### 14.2 Design Direction

- Modern.
- Premium.
- Minimal.
- Professional.
- Clear hierarchy.
- Fast interactions.
- Low cognitive load.
- Mobile responsive.

Avoid excessive gradients, decorative effects, unnecessary animations, and crowded dashboards.

### 14.3 Admin UX

Target workflow:

Open dashboard → identify task → open project → complete action → continue.

Optimize for minimal clicks.

Use progressive disclosure to hide advanced options until needed.

Provide clear success and error feedback.

### 14.4 Client UX

The client should be able to answer three questions immediately:

1. What is my current project status?
2. What happens next?
3. Do I need to do anything?

These questions are more important than displaying complicated progress percentages.

### 14.5 UI States

Implement:

- Loading.
- Empty.
- Error.
- Unauthorized.
- Expired invitation.
- Waiting for client.
- Waiting for institution.
- Completed.
- Cancelled.
- Pending priority request.
- Payment pending.
- Payment failed.
- Payment confirmed.

Accessibility and responsive design are mandatory.

---

## 15. FUTURE ANDROID APPLICATION

The initial product is web-first.

Future Android development should use:

**Expo + React Native**

The Android application must use the same Supabase backend and authorization rules.

Potential features:

- Client tracking.
- Admin task management.
- Google login for clients.
- Email/password login for admins.
- Push notifications.
- Deep links to projects.
- Document viewing.
- Priority request status.

Do not build the Android application in the initial release.

### 15.1 Backend Readiness

Keep business logic reusable outside the Next.js UI.

Use stable server-side operations and authorization boundaries.

Avoid tightly coupling workflow logic to React components.

### 15.2 Notifications

Plan for:

- Project updates.
- Client document requests.
- Task reminders.
- Priority payment confirmation.
- Priority work assignments.
- Project completion.

Notification delivery must be retryable and idempotent.

Avoid exposing confidential document details in push notification previews.

---

## 16. PROPOSED ROUTES

Adapt to the actual existing Next.js structure.

Public website:

`/`

Existing service pages and marketing routes remain unchanged.

Authentication:

`/admin/login`  
`/invite/[token]`  
`/auth/callback`

Admin:

`/admin`  
`/admin/projects`  
`/admin/projects/[id]`  
`/admin/projects/new`  
`/admin/clients`  
`/admin/team`  
`/admin/settings`

Client:

`/portal`  
`/portal/projects/[id]`

API routes or Server Actions should be created only where appropriate.

Do not expose privileged database operations directly to untrusted clients.

---

## 17. PERFORMANCE AND QUALITY

Requirements:

- Mobile-first client pages.
- Efficient database queries.
- Paginated project listings.
- Indexed project and audit queries.
- Minimal unnecessary realtime subscriptions.
- Fast initial dashboard rendering.
- Proper loading skeletons.
- No secrets in client bundles.
- No breaking changes to existing public pages.

Realtime updates are optional for the MVP.

Polling or refresh-on-navigation is acceptable initially if it simplifies implementation.

---

## 18. DEVELOPMENT PHASES

### Phase 0 — Repository Audit

Codex must:

1. Inspect existing project.
2. Identify framework versions.
3. Identify existing architecture.
4. Identify reusable components.
5. Identify integration risks.
6. Produce implementation plan.
7. Identify missing credentials and environment configuration.

**Deliverable:** repository assessment and implementation plan.

Do not perform destructive changes.

### Phase 1 — Supabase Foundation

Implement:

- Supabase client/server configuration.
- Authentication integration.
- Database migrations.
- Core authorization.
- RLS policies.
- Initial admin bootstrap.
- Admin login.
- Basic profiles.

**Deliverable:** secure authentication foundation.

### Phase 2 — Admin Workspace

Implement:

- Admin dashboard.
- Project CRUD.
- Client management.
- PIC assignment.
- Admin team management.
- Project activity tracking.

**Deliverable:** operational internal workspace.

### Phase 3 — Workflow Engine

Implement:

- Service catalog.
- Workflow templates.
- Workflow versioning.
- Project workflow instantiation.
- Internal checklists.
- Status transitions.
- Client-visible progress mapping.

**Deliverable:** reusable workflow management system.

### Phase 4 — Client Tracking

Implement:

- Project invitations.
- Google OAuth.
- Invitation validation.
- Client access binding.
- Client portal.
- Project timeline.
- Client-visible updates.
- Protected documents.

**Deliverable:** secure customer tracking experience.

### Phase 5 — Priority Service Foundation

Implement:

- Priority offering management.
- Eligibility checks.
- Client request UI.
- Admin request review.
- Payment abstraction.
- Pending/confirmed/failed states.

Actual payment processing requires approved provider configuration and verified webhook integration.

**Deliverable:** priority service workflow ready for approved payment integration.

### Phase 6 — Notification Foundation

Implement:

- Notification records.
- In-app notification center.
- Notification outbox.
- Retryable event processing.
- Future push notification readiness.

**Deliverable:** extensible notification architecture.

### Phase 7 — Android Application

Future project.

Do not implement until separately requested.

---

## 19. ACCEPTANCE CRITERIA

### Admin

- Admin can sign in using email/password.
- Unauthorized users cannot access admin pages.
- Existing admins can invite additional admins.
- All admins have equal permissions.
- Admin can create a client project.
- Admin can assign and change PIC.
- Admin can select a service workflow.
- Admin can complete project tasks.
- Admin can update project status.
- Admin can view project activity history.

### Client

- Client cannot self-create a project.
- Client receives a project invitation.
- Client must authenticate with Google.
- Wrong Google account cannot claim the invitation.
- Valid Google account can claim the invitation.
- Client can access authorized projects afterward.
- Client cannot access other clients' projects.
- Client sees simplified tracking information.
- Client cannot modify internal workflow tasks.

### Audit

- Project creator is recorded.
- PIC changes are recorded.
- Project updates record their actor.
- Status transitions are recorded.
- Audit events cannot be edited through the application.

### Workflow

- Service selection creates a workflow instance.
- Required tasks are tracked.
- Project stages follow configured dependencies.
- External waiting states are supported.
- Rejected or exceptional outcomes are supported.
- Template updates do not silently rewrite existing workflows.

### Existing Website

- Public pages still work.
- Existing service content remains intact.
- Existing WhatsApp links still work.
- Existing SEO metadata remains intact.
- No unintended visual regression.
- Application builds successfully.

---

## 20. TESTING REQUIREMENTS

Codex must implement or execute appropriate tests for:

- Admin authentication.
- Client Google authentication.
- Invitation claiming.
- Expired and revoked invitations.
- Wrong-account invitation attempts.
- Unauthorized project access.
- RLS isolation.
- Admin account invitation.
- PIC assignment.
- Project creation.
- Workflow instantiation.
- Task completion.
- Audit log creation.
- Concurrent invitation redemption.
- Duplicate submission handling.
- Payment webhook idempotency when payments are implemented.
- Existing public route regression.

Run available lint, typecheck, build, and test commands.

Report failures honestly.

Do not claim functionality is verified without executing the relevant checks.

---

## 21. CODEX EXECUTION INSTRUCTIONS

You are operating inside the existing VERALEX website workspace.

Follow these instructions strictly.

**First:**

Inspect the repository before making implementation decisions.

**Second:**

Produce a concise architecture assessment explaining how the proposed features integrate into the existing application.

**Third:**

Create a phased implementation plan with concrete files, modules, migrations, and dependencies.

**Fourth:**

Implement incrementally, beginning with the secure foundation.

**Fifth:**

Preserve all existing public website functionality.

**Sixth:**

Do not generate placeholder backend behavior that pretends to persist real data.

**Seventh:**

Do not fabricate legal procedures, payment confirmations, or completed workflow states.

**Eighth:**

Do not expose privileged Supabase credentials to client-side code.

**Ninth:**

Use the existing project conventions wherever practical.

**Tenth:**

After each phase, report:

- Files changed.
- Features implemented.
- Database migrations added.
- Tests performed.
- Remaining work.
- Configuration required.

### Explicit Non-Goals

Do not:

- Rebuild the marketing website.
- Introduce public customer checkout.
- Add public admin registration.
- Introduce a super-admin hierarchy.
- Build the Android APK yet.
- Implement an unapproved payment provider.
- Guarantee government processing times.
- Overengineer microservices.
- Replace existing styling unnecessarily.

### Final Engineering Principle

Build a production-oriented extension of the current VERALEX website, not a disconnected prototype.

Prioritize security, operational simplicity, maintainability, and incremental delivery.

**Begin by auditing the existing repository and presenting the implementation plan. Do not assume the existing project structure.**

