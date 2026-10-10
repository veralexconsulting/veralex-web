-- Owner-only analytics. Additive: no existing table, policy or grant is changed.
-- Public visitors may append one kind of event; only the server-side owner
-- identity (env VERALEX_OWNER_USER_ID) may read, and that read happens through
-- direct PostgreSQL, never through PostgREST.

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null check (event_name in ('whatsapp_click','phone_click','email_click','login')),
  occurred_at timestamptz not null default now(),
  -- Reporting calendar day in Asia/Jakarta. Written server-side, never trusted
  -- from a request body, so date filtering cannot be shifted by the client.
  report_day date not null default (now() at time zone 'Asia/Jakarta')::date,
  page_path text not null default '',
  service_slug text not null default '',
  cta_location text not null default '',
  locale text not null default 'id' check (locale in ('id','en','zh')),
  -- 'owner' is derived from the immutable owner UUID at login time, not from the client.
  actor_role text not null default '' check (actor_role in ('','admin','client','owner')),
  actor_user_id uuid references public.profiles(id) on delete set null,
  -- Random per-browser-session nonce. Not a fingerprint, carries no personal data.
  visitor_token text,
  -- Whitelisted campaign labels only (utm_source/medium/campaign, truncated upstream).
  campaign text,
  dedupe_key text,
  created_at timestamptz not null default now(),
  check (char_length(page_path) <= 300),
  check (char_length(service_slug) <= 120),
  check (char_length(cta_location) <= 60),
  check (visitor_token is null or visitor_token ~ '^[0-9a-f-]{36}$')
);
create index if not exists analytics_events_occurred_idx on public.analytics_events(occurred_at desc);
create index if not exists analytics_events_name_day_idx on public.analytics_events(event_name, report_day);
create index if not exists analytics_events_role_day_idx on public.analytics_events(actor_role, report_day) where event_name = 'login';
create index if not exists analytics_events_page_idx on public.analytics_events(page_path) where event_name = 'whatsapp_click';
create index if not exists analytics_events_service_idx on public.analytics_events(service_slug) where event_name = 'whatsapp_click';
create unique index if not exists analytics_events_dedupe_idx on public.analytics_events(dedupe_key) where dedupe_key is not null;

-- No public read path exists: RLS on with zero policies means anon and
-- authenticated receive nothing even if a grant were added by mistake.
alter table public.analytics_events enable row level security;
revoke all on public.analytics_events from anon, authenticated;

create or replace function private.analytics_purge_events(p_before date)
returns bigint language sql security definer set search_path = '' as $$
  with removed as (delete from public.analytics_events where report_day < p_before returning 1)
  select count(*) from removed
$$;
revoke all on function private.analytics_purge_events(date) from public, anon, authenticated;

comment on table public.analytics_events is
  'Owner-only analytics. Public visitors append click events through the server route; no browser client may read this table. Retention: 180 days via private.analytics_purge_events.';
