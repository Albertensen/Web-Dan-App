-- ============================================================
-- Migration 011: Security fixes (RLS exploit)
-- 1) is_solution self-marking → hanya thread author yang bisa set is_solution
-- 2) self-promotion admin → role & reputation tidak bisa diubah user sendiri
-- ============================================================

-- 1) DROP policy lama yang membolehkan author reply set is_solution sendiri
drop policy if exists "Authors can update own replies" on public.replies;

-- Policy baru: author reply bisa update reply sendiri KECUALI kolom is_solution.
-- is_solution hanya bisa diubah thread owner (via grant di bawah).
create policy "Authors can update own replies"
  on public.replies for update to authenticated
  using (auth.uid() = author_id)
  with check (
    auth.uid() = author_id
    and is_solution is not distinct from (
      select r.is_solution from public.replies r where r.id = replies.id
    )
  );

-- Thread owner boleh set is_solution (menandai jawaban benar di thread-nya)
create policy "Thread owner can mark solution"
  on public.replies for update to authenticated
  using (
    exists (
      select 1 from public.threads t
      where t.id = replies.thread_id
        and t.author_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.threads t
      where t.id = replies.thread_id
        and t.author_id = auth.uid()
    )
  );

-- 2) Users can update own profile — tapi bukan role/reputation
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = profiles.id)
    and reputation = (select p.reputation from public.profiles p where p.id = profiles.id)
  );