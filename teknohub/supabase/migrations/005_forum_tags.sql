-- Migration 005: Tag system untuk forum threads
alter table public.threads
  add column if not exists tags text[] not null default '{}';

-- index GIN utk pencarian tags
create index if not exists idx_threads_tags on public.threads using gin (tags);
