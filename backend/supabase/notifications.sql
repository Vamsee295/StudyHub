-- Supabase table behind the notification bell (frontend/lib/services/notificationService.ts).
-- Applied to the StudyHub Supabase project on 2026-11-25 (migrations create_notifications, grant_notifications).
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null check (type in ('LESSON_COMPLETED','COURSE_MILESTONE','DSA_PROBLEM_SOLVED','DSA_MILESTONE','NEW_RESOURCE','PLACEMENT_UPDATE','SYSTEM')),
  read boolean not null default false,
  link text,
  created_at timestamptz not null default now()
);
create index notifications_user_created_idx on public.notifications (user_id, created_at desc);

-- Each learner sees and changes only their own notifications.
alter table public.notifications enable row level security;
create policy "read own notifications" on public.notifications for select to authenticated using ((select auth.uid()) = user_id);
create policy "create own notifications" on public.notifications for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own notifications" on public.notifications for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
grant select, insert, update on public.notifications to authenticated;

-- live updates for the bell
alter publication supabase_realtime add table public.notifications;
