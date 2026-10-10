-- Workspace removals are retained as audit-safe soft deletes. Existing project,
-- workflow, invitation, access, and audit rows stay linked for historical review.
alter table public.projects
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by uuid references public.profiles(id);

alter table public.profiles
  add column if not exists deleted_at timestamptz;

alter table public.clients
  add column if not exists deleted_at timestamptz;

create index if not exists projects_active_rows_idx
  on public.projects(updated_at desc) where deleted_at is null;
create index if not exists profiles_active_admins_idx
  on public.profiles(full_name) where role='admin' and active=true and deleted_at is null;

create or replace function private.workspace_has_access(p_project_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(
    select 1
    from public.client_project_access a
    join public.profiles p on p.id = a.client_user_id
    join public.projects j on j.id = a.project_id
    where a.project_id = p_project_id
      and a.client_user_id = auth.uid()
      and a.revoked_at is null
      and p.active
      and p.role = 'client'
      and j.deleted_at is null
  )
$$;
