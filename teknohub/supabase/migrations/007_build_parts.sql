-- Migration 007: Saved builds — tabel relasi build ↔ komponen
create table if not exists public.pc_build_parts (
  id           uuid primary key default gen_random_uuid(),
  build_id     uuid not null references public.pc_builds (id) on delete cascade,
  component_id uuid not null references public.pc_components (id) on delete cascade,
  quantity     integer not null default 1 check (quantity > 0),
  created_at   timestamptz not null default now(),
  unique (build_id, component_id)
);

create index if not exists idx_build_parts_build on public.pc_build_parts (build_id);

alter table public.pc_build_parts enable row level security;

create policy "Build parts are viewable with build"
  on public.pc_build_parts for select using (
    exists (
      select 1 from public.pc_builds b
      where b.id = build_id and (b.is_public = true or auth.uid() = b.author_id)
    )
  );

create policy "Authors can manage build parts"
  on public.pc_build_parts for all using (
    exists (select 1 from public.pc_builds b where b.id = build_id and auth.uid() = b.author_id)
  );

-- slug otomatis dari title (fallback ke random)
create or replace function public.build_slug(title text)
returns text
language sql
as $$
  select lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'), '^-+|-+$', '')) || '-' || substr(md5(random()::text), 1, 6)
$$;
