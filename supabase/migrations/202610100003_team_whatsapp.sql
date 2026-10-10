-- Team contact channel so a client can reach the project PIC directly.
-- Additive only: one nullable-by-default text column plus a length guard.
alter table public.profiles add column if not exists phone text not null default '';

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_phone_length') then
    alter table public.profiles add constraint profiles_phone_length check (char_length(phone) <= 20);
  end if;
end $$;

comment on column public.profiles.phone is
  'WhatsApp contact of a team member, digits only with an optional leading 62. Shown to clients as their project PIC; never used for authentication.';