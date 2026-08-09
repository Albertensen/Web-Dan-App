-- Migration 006: Komunitas Fase 3 — follows, reports, notifications, badges, ban
-- ============================================================
-- 1. FOLLOWS (user follow user & thread)
-- ============================================================
create table if not exists public.follows (
  id         uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.profiles (id) on delete cascade,
  target_type text not null check (target_type in ('user', 'thread')),
  target_id   uuid not null,
  created_at timestamptz not null default now(),
  unique (follower_id, target_type, target_id)
);

create index if not exists idx_follows_target on public.follows (target_type, target_id);
create index if not exists idx_follows_follower on public.follows (follower_id);

alter table public.follows enable row level security;

create policy "Follows are viewable by everyone"
  on public.follows for select using (true);

create policy "Users can follow"
  on public.follows for insert with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on public.follows for delete using (auth.uid() = follower_id);

-- ============================================================
-- 2. REPORTS (moderasi)
-- ============================================================
create table if not exists public.reports (
  id         uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  target_type text not null check (target_type in ('thread', 'reply', 'user')),
  target_id   uuid not null,
  reason     text not null,
  status     text not null default 'open' check (status in ('open', 'reviewed', 'dismissed', 'actioned')),
  created_at timestamptz not null default now(),
  unique (reporter_id, target_type, target_id)
);

create index if not exists idx_reports_status on public.reports (status, created_at desc);

alter table public.reports enable row level security;

create policy "Reports are viewable by moderators"
  on public.reports for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('moderator', 'admin'))
  );

create policy "Users can create reports"
  on public.reports for insert with check (auth.uid() = reporter_id);

create policy "Moderators can update reports"
  on public.reports for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('moderator', 'admin'))
  );

-- ============================================================
-- 3. NOTIFICATIONS
-- ============================================================
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  type       text not null check (type in ('reply', 'solution', 'follow', 'mention', 'system')),
  title      text not null,
  body       text,
  link       text,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user on public.notifications (user_id, is_read, created_at desc);

alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update using (auth.uid() = user_id);

-- ============================================================
-- 4. BAN + BADGES (kolom di profiles)
-- ============================================================
alter table public.profiles
  add column if not exists is_banned boolean not null default false,
  add column if not exists banned_until timestamptz;

-- trigger: cegah login user yang di-ban (blokir aksi via RLS)
create or replace function public.check_not_banned()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if exists (select 1 from public.profiles where id = auth.uid() and is_banned) then
    raise exception 'Akun Anda diblokir';
  end if;
  return new;
end;
$$;

-- ============================================================
-- 5. TRIGGER notifikasi: reply baru ke pemilik thread
-- ============================================================
create or replace function public.handle_reply_notification()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_author uuid;
  v_title  text;
begin
  select author_id, title into v_author, v_title
  from public.threads where id = new.thread_id;

  if v_author is not null and v_author <> new.author_id then
    insert into public.notifications (user_id, type, title, body, link)
    values (v_author, 'reply', 'Balasan baru',
            'Thread "' || v_title || '" mendapat balasan baru',
            '/forum/' || new.thread_id);
  end if;

  return new;
end;
$$;

create trigger on_reply_notification
  after insert on public.replies
  for each row
  execute function public.handle_reply_notification();

-- ============================================================
-- 6. TRIGGER notifikasi: follow user
-- ============================================================
create or replace function public.handle_follow_notification()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_name text;
begin
  select username into v_name from public.profiles where id = new.follower_id;

  if new.target_type = 'user' and v_name is not null then
    insert into public.notifications (user_id, type, title, body, link)
    values (new.target_id, 'follow', 'Pengikut baru',
            '@' || v_name || ' mengikuti Anda', null);
  end if;

  return new;
end;
$$;

create trigger on_follow_notification
  after insert on public.follows
  for each row
  execute function public.handle_follow_notification();
