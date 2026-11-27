-- Admin role, content reports and admin audit log (frontend/app/admin, backend/app/api/routes/admin.py).
-- Applied to the StudyHub Supabase project on 2026-11-27 (migrations admin_roles_reports_audit, grant_admin_tables).
--
-- Admin access lives on the account (auth.users.raw_app_meta_data.role = 'admin'), never on a separate login.
-- Users cannot edit app_metadata, so nobody can make themselves admin.
-- Make an allowlisted account admin after it signs up (SQL editor):  select public.grant_admin('you@example.com');

-- 1. Emails allowed to hold the admin role. No RLS policies: readable/writable only from SQL / service role.
create table if not exists public.admin_emails (
  email    text primary key check (email = lower(email)),
  added_at timestamptz not null default now()
);
alter table public.admin_emails enable row level security;
insert into public.admin_emails (email) values ('you@example.com'), ('admin@example.com') on conflict do nothing;

-- 2. Is the caller an admin? (from the signed JWT)
create or replace function public.is_admin() returns boolean
language sql stable set search_path = '' as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

-- 3. Automatic grant, only when the owner has proven the mailbox: a confirmation email was actually
--    sent and then confirmed. With "Confirm email" off, sign-ups are auto-confirmed without any email,
--    so this never fires and the grant must be done with grant_admin() instead.
create or replace function public.apply_admin_role() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.email is not null
     and new.email_confirmed_at is not null
     and new.confirmation_sent_at is not null
     and exists (select 1 from public.admin_emails a where a.email = lower(new.email)) then
    new.raw_app_meta_data := coalesce(new.raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb;
  end if;
  return new;
end $$;
drop trigger if exists apply_admin_role on auth.users;
create trigger apply_admin_role before insert or update of email_confirmed_at on auth.users
  for each row execute function public.apply_admin_role();

-- 4. Manual grant / revoke for allowlisted emails. Run from the SQL editor; app users can't call these.
create or replace function public.grant_admin(target_email text) returns text
language plpgsql security definer set search_path = '' as $$
declare uid uuid;
begin
  if not exists (select 1 from public.admin_emails where email = lower(target_email)) then
    raise exception '% is not in admin_emails', target_email;
  end if;
  update auth.users set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where lower(email) = lower(target_email) returning id into uid;
  if uid is null then return 'No account for ' || target_email || ' yet. Sign up first, then run this again.'; end if;
  return 'Admin granted to ' || target_email || '. Sign out and back in to pick it up.';
end $$;

create or replace function public.revoke_admin(target_email text) returns text
language plpgsql security definer set search_path = '' as $$
begin
  update auth.users set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) - 'role'
   where lower(email) = lower(target_email);
  return 'Admin removed from ' || target_email;
end $$;
revoke all on function public.grant_admin(text), public.revoke_admin(text), public.apply_admin_role() from public, anon, authenticated;

-- 5. Reports from learners about posts or replies.
create table if not exists public.content_reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('post', 'comment')),
  target_id   text not null check (length(target_id) between 1 and 64),
  reason      text not null check (length(reason) between 1 and 500),
  status      text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at  timestamptz not null default now(),
  resolved_by uuid references auth.users(id) on delete set null,
  resolved_at timestamptz,
  unique (reporter_id, target_type, target_id)
);
alter table public.content_reports enable row level security;
create policy "report as yourself" on public.content_reports for insert to authenticated
  with check (reporter_id = (select auth.uid()) and status = 'open' and resolved_by is null);
create policy "see own reports, admins see all" on public.content_reports for select to authenticated
  using (reporter_id = (select auth.uid()) or (select public.is_admin()));
create policy "admins resolve" on public.content_reports for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create index if not exists content_reports_open on public.content_reports (status, created_at desc);

-- 6. Every admin action, append-only.
create table if not exists public.admin_audit_log (
  id          bigint generated always as identity primary key,
  admin_id    uuid not null default auth.uid() references auth.users(id) on delete set null,
  admin_email text default (auth.jwt() ->> 'email'),
  action      text not null check (length(action) between 1 and 60),
  target      text check (length(target) <= 200),
  details     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
alter table public.admin_audit_log enable row level security;
create policy "admins read the log" on public.admin_audit_log for select to authenticated using ((select public.is_admin()));
create policy "admins write as themselves" on public.admin_audit_log for insert to authenticated
  with check ((select public.is_admin()) and admin_id = (select auth.uid()));
create index if not exists admin_audit_log_recent on public.admin_audit_log (created_at desc);

-- 7. Admin-only reads and actions on accounts. Callable by signed-in users, but each refuses non-admins.
create or replace function public.admin_overview() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'admins only' using errcode = '42501'; end if;
  return jsonb_build_object(
    'users',        (select count(*) from auth.users),
    'new_7d',       (select count(*) from auth.users where created_at > now() - interval '7 days'),
    'active_7d',    (select count(*) from auth.users where last_sign_in_at > now() - interval '7 days'),
    'suspended',    (select count(*) from auth.users where banned_until > now()),
    'admins',       (select count(*) from auth.users where raw_app_meta_data ->> 'role' = 'admin'),
    'open_reports', (select count(*) from public.content_reports where status = 'open')
  );
end $$;

create or replace function public.admin_list_users(q text default '', lim int default 50, off int default 0)
returns table (id uuid, email text, created_at timestamptz, last_sign_in_at timestamptz, is_admin boolean, suspended boolean)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'admins only' using errcode = '42501'; end if;
  return query
    select u.id, u.email::text, u.created_at, u.last_sign_in_at,
           coalesce(u.raw_app_meta_data ->> 'role' = 'admin', false),
           coalesce(u.banned_until > now(), false)
      from auth.users u
     where q = '' or u.email ilike '%' || q || '%'
     order by u.created_at desc
     limit least(greatest(lim, 1), 200) offset greatest(off, 0);
end $$;

create or replace function public.admin_set_suspended(target uuid, suspend boolean) returns void
language plpgsql security definer set search_path = '' as $$
declare t_email text; t_admin boolean;
begin
  if not public.is_admin() then raise exception 'admins only' using errcode = '42501'; end if;
  if target = auth.uid() then raise exception 'you cannot suspend yourself'; end if;
  select email, coalesce(raw_app_meta_data ->> 'role' = 'admin', false) into t_email, t_admin from auth.users where id = target;
  if t_email is null then raise exception 'no such user'; end if;
  if t_admin then raise exception 'admins cannot be suspended here'; end if;
  update auth.users set banned_until = case when suspend then now() + interval '100 years' else null end where id = target;
  insert into public.admin_audit_log (admin_id, action, target, details)
  values (auth.uid(), case when suspend then 'suspend_user' else 'restore_user' end, t_email, jsonb_build_object('user_id', target));
end $$;

revoke all on function public.admin_overview(), public.admin_list_users(text, int, int), public.admin_set_suspended(uuid, boolean) from public, anon;
grant execute on function public.admin_overview(), public.admin_list_users(text, int, int), public.admin_set_suspended(uuid, boolean), public.is_admin() to authenticated;

-- Row-level security above decides which rows; these grants let signed-in users reach the tables at all.
grant select, insert on public.content_reports to authenticated;
grant update (status, resolved_by, resolved_at) on public.content_reports to authenticated;
grant select, insert on public.admin_audit_log to authenticated;
revoke all on public.admin_emails from anon, authenticated;
