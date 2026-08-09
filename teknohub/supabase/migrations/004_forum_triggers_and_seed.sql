-- ============================================================
-- TeknoHub — Migration 004: Forum Views + Reputation Triggers
-- Sesuai schema 001 (threads, replies, votes, profiles)
-- ============================================================

-- ------------------------------------------------------------
-- A. VIEW thread_details — thread + author + kategori (join)
-- ------------------------------------------------------------
create or replace view public.thread_details as
select
  t.id,
  t.title,
  t.content,
  t.category_id,
  c.name        as category_name,
  c.slug        as category_slug,
  t.author_id,
  p.username    as author_username,
  p.avatar_url  as author_avatar,
  p.reputation  as author_reputation,
  t.is_pinned,
  t.is_locked,
  t.view_count,
  t.reply_count,
  t.last_reply_at,
  t.created_at,
  t.updated_at
from public.threads t
left join public.profiles p on p.id = t.author_id
left join public.forum_categories c on c.id = t.category_id;

-- ============================================================
-- B. TRIGGER 1 — Reputation: vote thread (+10 upvote / -10 downvote)
-- ============================================================
create or replace function public.handle_thread_vote()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_author uuid;
  v_delta integer;
  v_type  text;
begin
  -- tentukan target_type (NEW utk insert/update, OLD utk delete)
  v_type := coalesce(new.target_type, old.target_type);

  -- hanya untuk vote thread
  if v_type <> 'thread' then
    return coalesce(new, old);
  end if;

  -- cari author thread
  select author_id into v_author
  from public.threads
  where id = coalesce(new.target_id, old.target_id);

  if v_author is null then
    return coalesce(new, old);
  end if;

  -- hitung delta reputation
  if tg_op = 'INSERT' then
    v_delta := new.value * 10;
  elsif tg_op = 'UPDATE' then
    v_delta := (new.value - old.value) * 10;
  else -- DELETE
    v_delta := -old.value * 10;
  end if;

  if v_delta <> 0 then
    update public.profiles
    set reputation = reputation + v_delta,
        updated_at = now()
    where id = v_author;
  end if;

  return coalesce(new, old);
end;
$$;

create trigger on_vote_thread
  after insert or update or delete on public.votes
  for each row
  execute function public.handle_thread_vote();

-- ============================================================
-- C. TRIGGER 2 — Reputation: reply ditandai solved (+50) + kunci thread
-- ============================================================
create or replace function public.handle_solution_reply()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.is_solution and not old.is_solution then
    -- +50 ke penulis reply
    update public.profiles
    set reputation = reputation + 50,
        updated_at = now()
    where id = new.author_id;

    -- kunci thread (solved)
    update public.threads
    set is_locked = true,
        updated_at = now()
    where id = new.thread_id;
  end if;

  return new;
end;
$$;

create trigger on_reply_solution
  after update of is_solution on public.replies
  for each row
  execute function public.handle_solution_reply();
