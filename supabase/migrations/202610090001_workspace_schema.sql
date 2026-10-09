-- VERALEX Workspace, additive to the legacy order schema. No existing customer data is removed.
create schema if not exists private;
create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default 'Pengguna',
  role text not null default 'client' check (role in ('admin','client')),
  active boolean not null default true,
  must_change_password boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists profiles_role_active_idx on public.profiles(role, active);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 2 and 200),
  email text not null default '',
  phone text not null default '',
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists clients_name_idx on public.clients(name);

create table if not exists public.workspace_services (
  slug text primary key,
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.workflow_templates (
  id uuid primary key default gen_random_uuid(),
  service_slug text not null references public.workspace_services(slug),
  version integer not null check (version > 0),
  status text not null check (status in ('draft','published','archived')),
  legal_review_required boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  published_at timestamptz,
  unique(service_slug, version)
);
create unique index if not exists workflow_one_published_idx on public.workflow_templates(service_slug) where status = 'published';
create unique index if not exists workflow_one_draft_idx on public.workflow_templates(service_slug) where status = 'draft';
create table if not exists public.workflow_template_steps (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.workflow_templates(id) on delete cascade,
  position integer not null check (position > 0),
  title text not null,
  description text not null default '',
  client_label text not null,
  client_visible boolean not null default true,
  waiting_kind text not null check (waiting_kind in ('internal','client','institution')),
  completion_criteria text not null,
  unique(template_id, position)
);
create table if not exists public.workflow_template_tasks (
  id uuid primary key default gen_random_uuid(),
  step_id uuid not null references public.workflow_template_steps(id) on delete cascade,
  position integer not null check (position > 0),
  title text not null,
  conditional boolean not null default false,
  unique(step_id, position)
);

create sequence if not exists public.workspace_project_reference_seq;
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('VRX-' || extract(year from now())::text || '-' || lpad(nextval('public.workspace_project_reference_seq')::text, 5, '0')),
  client_id uuid not null references public.clients(id),
  service_slug text not null references public.workspace_services(slug),
  workflow_template_id uuid not null references public.workflow_templates(id),
  workflow_version integer not null check (workflow_version > 0),
  title text not null check (length(trim(title)) between 2 and 250),
  status text not null default 'active' check (status in ('draft','active','waiting_client','waiting_external','review','completed','rejected','cancelled','archived')),
  pic_user_id uuid not null references public.profiles(id),
  created_by uuid not null references public.profiles(id),
  updated_by uuid not null references public.profiles(id),
  start_at date,
  follow_up_at date,
  internal_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_status_idx on public.projects(status, updated_at desc);
create index if not exists projects_pic_idx on public.projects(pic_user_id, status);
create index if not exists projects_client_idx on public.projects(client_id);
create index if not exists projects_follow_up_idx on public.projects(follow_up_at) where follow_up_at is not null;
create table if not exists public.project_supporting_admins (
  project_id uuid not null references public.projects(id) on delete cascade,
  admin_user_id uuid not null references public.profiles(id),
  primary key(project_id, admin_user_id)
);
create table if not exists public.project_steps (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  source_template_step_id uuid references public.workflow_template_steps(id) on delete set null,
  position integer not null check (position > 0),
  title text not null,
  description text not null default '',
  client_label text not null,
  client_visible boolean not null default true,
  waiting_kind text not null check (waiting_kind in ('internal','client','institution')),
  completion_criteria text not null,
  created_at timestamptz not null default now(),
  unique(project_id, position) deferrable initially deferred
);
create index if not exists project_steps_project_idx on public.project_steps(project_id, position);
create table if not exists public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  step_id uuid not null references public.project_steps(id) on delete cascade,
  position integer not null check (position > 0),
  title text not null,
  conditional boolean not null default false,
  status text not null default 'pending' check (status in ('pending','in_progress','blocked','completed','skipped')),
  note text not null default '',
  due_at date,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now(),
  unique(step_id, position) deferrable initially deferred
);
create index if not exists project_tasks_step_idx on public.project_tasks(step_id, position);

create table if not exists public.project_access_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  token_hash char(64) not null unique,
  status text not null default 'active' check (status in ('active','claimed','revoked')),
  expires_at timestamptz not null,
  created_by uuid not null references public.profiles(id),
  claimed_by uuid references public.profiles(id),
  claimed_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index if not exists project_one_active_link_idx on public.project_access_links(project_id) where status = 'active';
create index if not exists project_access_links_expiry_idx on public.project_access_links(expires_at) where status = 'active';
create table if not exists public.client_project_access (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  client_user_id uuid not null references public.profiles(id),
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  revoked_by uuid references public.profiles(id)
);
create unique index if not exists project_one_current_client_idx on public.client_project_access(project_id) where revoked_at is null;
create index if not exists client_project_access_user_idx on public.client_project_access(client_user_id, project_id) where revoked_at is null;

create table if not exists public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  actor_user_id uuid not null references public.profiles(id),
  message text not null,
  client_visible boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists project_updates_project_idx on public.project_updates(project_id, created_at desc);
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id),
  project_id uuid references public.projects(id),
  event_type text not null,
  message text not null,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_project_idx on public.audit_logs(project_id, created_at desc);
create table if not exists public.priority_offerings (
  id uuid primary key default gen_random_uuid(),
  singleton boolean not null default true unique check (singleton),
  enabled boolean not null default false,
  service_slugs text[] not null default '{}',
  stage_keys text[] not null default '{}',
  title text not null default 'Layanan Prioritas Penanganan VERALEX',
  description text not null default '',
  commitment text not null default '',
  limitations text not null default 'Keputusan dan waktu pemrosesan instansi di luar kendali VERALEX.',
  terms text not null default '',
  price_idr bigint not null default 0 check (price_idr >= 0),
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);
create table if not exists public.priority_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id),
  client_user_id uuid not null references public.profiles(id),
  status text not null default 'requested' check (status in ('requested','approved','payment_unavailable','active','rejected','cancelled')),
  quoted_price_idr bigint not null check (quoted_price_idr >= 0),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists priority_one_open_request_idx on public.priority_requests(project_id) where status in ('requested','approved','payment_unavailable','active');
create table if not exists public.workspace_payments (
  id uuid primary key default gen_random_uuid(),
  priority_request_id uuid not null references public.priority_requests(id),
  provider text not null,
  provider_reference text not null unique,
  amount_idr bigint not null check (amount_idr > 0),
  status text not null check (status in ('pending','processing','confirmed','failed','cancelled')),
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null,
  payment_id uuid not null references public.workspace_payments(id),
  processed_at timestamptz not null default now(),
  unique(provider, provider_event_id)
);
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_user_id uuid not null references public.profiles(id),
  project_id uuid references public.projects(id),
  event_type text not null,
  title text not null,
  message text not null,
  target_path text not null,
  dedupe_key text unique,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_recipient_idx on public.notifications(recipient_user_id, read_at, created_at desc);
create table if not exists public.notification_outbox (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references public.notifications(id) on delete cascade,
  channel text not null default 'in_app' check (channel in ('in_app','email','push')),
  status text not null default 'pending' check (status in ('pending','processing','sent','failed')),
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  last_error text,
  created_at timestamptz not null default now(),
  unique(notification_id, channel)
);
create index if not exists notification_outbox_pending_idx on public.notification_outbox(status, next_attempt_at) where status in ('pending','failed');
create table if not exists public.workspace_rate_limits (
  key_hash char(64) not null,
  action text not null,
  window_start timestamptz not null,
  attempts integer not null default 0,
  primary key(key_hash, action, window_start)
);

create or replace function private.workspace_is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin' and active = true and must_change_password = false)
$$;
create or replace function private.workspace_has_access(p_project_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.client_project_access a join public.profiles p on p.id = a.client_user_id
    where a.project_id = p_project_id and a.client_user_id = auth.uid() and a.revoked_at is null and p.active and p.role = 'client')
$$;
revoke all on schema private from public;
grant usage on schema private to authenticated;
revoke all on function private.workspace_is_admin() from public;
revoke all on function private.workspace_has_access(uuid) from public;
grant execute on function private.workspace_is_admin() to authenticated;
grant execute on function private.workspace_has_access(uuid) to authenticated;

create or replace function private.workspace_profile_created()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, email, full_name, role, active, must_change_password)
  values(new.id, coalesce(new.email,new.id::text || '@local.invalid'), coalesce(nullif(new.raw_user_meta_data->>'full_name',''),'Pengguna'),
    case when new.raw_app_meta_data->>'workspace_role' = 'admin' then 'admin' else 'client' end,
    true, coalesce((new.raw_app_meta_data->>'must_change_password')::boolean,false))
  on conflict(id) do nothing;
  return new;
end $$;
drop trigger if exists workspace_profile_on_signup on auth.users;
create trigger workspace_profile_on_signup after insert on auth.users for each row execute function private.workspace_profile_created();
-- Existing Auth users are imported as clients; an authorized bootstrap promotes the first admin.
insert into public.profiles(id,email,full_name,role)
select id, coalesce(email,id::text || '@local.invalid'), coalesce(nullif(raw_user_meta_data->>'full_name',''),'Pengguna'), 'client'
from auth.users on conflict(id) do nothing;
-- Reuse existing legacy admin identities when the older order schema exists.
do $$ begin
  if to_regclass('public.users') is not null then
    execute 'update public.profiles p set role=''admin'' from public.users u where u.id=p.id and u.role::text=''admin''';
  end if;
end $$;

create or replace function private.workspace_guard_project_creator()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.created_by is distinct from old.created_by or new.created_at is distinct from old.created_at then
    raise exception 'Project creator and creation time are immutable';
  end if;
  return new;
end $$;
drop trigger if exists workspace_project_creator_immutable on public.projects;
create trigger workspace_project_creator_immutable before update on public.projects for each row execute function private.workspace_guard_project_creator();
create or replace function private.workspace_audit_immutable()
returns trigger language plpgsql set search_path = '' as $$
begin raise exception 'Audit logs are append-only'; end $$;
drop trigger if exists workspace_audit_no_update on public.audit_logs;
create trigger workspace_audit_no_update before update or delete on public.audit_logs for each row execute function private.workspace_audit_immutable();

-- Explicit grants and RLS. Browser clients never receive direct mutation grants.
do $$ declare table_name text; begin
  foreach table_name in array array['profiles','clients','workspace_services','workflow_templates','workflow_template_steps','workflow_template_tasks','projects','project_supporting_admins','project_steps','project_tasks','project_access_links','client_project_access','project_updates','audit_logs','priority_offerings','priority_requests','workspace_payments','payment_webhook_events','notifications','notification_outbox','workspace_rate_limits'] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on public.%I from anon, authenticated', table_name);
  end loop;
end $$;
grant select on public.profiles, public.workspace_services, public.workflow_templates, public.workflow_template_steps, public.workflow_template_tasks, public.projects, public.clients, public.project_supporting_admins, public.project_steps, public.project_tasks, public.project_access_links, public.client_project_access, public.project_updates, public.audit_logs, public.priority_offerings, public.priority_requests, public.workspace_payments, public.notifications to authenticated;
grant update(read_at) on public.notifications to authenticated;

create policy profiles_read on public.profiles for select to authenticated using (id = (select auth.uid()) or (select private.workspace_is_admin()));
create policy clients_admin_read on public.clients for select to authenticated using ((select private.workspace_is_admin()));
create policy services_read on public.workspace_services for select to authenticated using (true);
create policy templates_admin_read on public.workflow_templates for select to authenticated using ((select private.workspace_is_admin()));
create policy template_steps_admin_read on public.workflow_template_steps for select to authenticated using ((select private.workspace_is_admin()));
create policy template_tasks_admin_read on public.workflow_template_tasks for select to authenticated using ((select private.workspace_is_admin()));
create policy projects_admin_read on public.projects for select to authenticated using ((select private.workspace_is_admin()));
create policy supporting_admin_read on public.project_supporting_admins for select to authenticated using ((select private.workspace_is_admin()));
create policy project_steps_admin_read on public.project_steps for select to authenticated using ((select private.workspace_is_admin()));
create policy project_tasks_admin_read on public.project_tasks for select to authenticated using ((select private.workspace_is_admin()));
create policy links_admin_read on public.project_access_links for select to authenticated using ((select private.workspace_is_admin()));
create policy access_admin_or_own_read on public.client_project_access for select to authenticated using ((select private.workspace_is_admin()) or client_user_id = (select auth.uid()));
create policy updates_admin_or_visible_read on public.project_updates for select to authenticated using ((select private.workspace_is_admin()) or (client_visible and private.workspace_has_access(project_id)));
create policy audits_admin_read on public.audit_logs for select to authenticated using ((select private.workspace_is_admin()));
create policy offering_read on public.priority_offerings for select to authenticated using (true);
create policy requests_admin_or_own_read on public.priority_requests for select to authenticated using ((select private.workspace_is_admin()) or (client_user_id = (select auth.uid()) and private.workspace_has_access(project_id)));
create policy payments_admin_read on public.workspace_payments for select to authenticated using ((select private.workspace_is_admin()));
create policy notifications_own_read on public.notifications for select to authenticated using (recipient_user_id = (select auth.uid()));
create policy notifications_own_update on public.notifications for update to authenticated using (recipient_user_id = (select auth.uid())) with check (recipient_user_id = (select auth.uid()));
