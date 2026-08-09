-- ============================================================
-- TeknoHub — Schema Database (PostgreSQL)
-- Tabel: profiles, products, forum, pc_builds
-- ============================================================

-- ------------------------------------------------------------
-- 1. PROFILES — Profil pengguna (extend auth.users dari Supabase)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text unique not null check (char_length(username) between 3 and 20),
  full_name   text,
  avatar_url  text,
  bio         text default '',
  location    text,
  website     text,
  role        text not null default 'member'
              check (role in ('member', 'moderator', 'admin')),
  reputation  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. PRODUCTS — Katalog produk gadget & komponen PC
-- ------------------------------------------------------------
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text unique not null,
  category     text not null
               check (category in ('cpu', 'gpu', 'ram', 'storage', 'motherboard', 'psu', 'case', 'cooler', 'monitor', 'laptop', 'smartphone')),
  brand        text,
  description  text,
  image_url    text,
  price        numeric(12, 2) check (price >= 0),
  currency     text not null default 'IDR',
  specs        jsonb not null default '{}'::jsonb,
  is_active    boolean not null default true,
  created_by   uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_slug on public.products (slug);

-- ------------------------------------------------------------
-- 3. FORUM — Thread & balasan diskusi
-- ------------------------------------------------------------
create table if not exists public.forum_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  description text,
  sort_order  integer not null default 0
);

create table if not exists public.forum_threads (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid references public.forum_categories (id) on delete set null,
  author_id     uuid not null references public.profiles (id) on delete cascade,
  title         text not null check (char_length(title) between 5 and 200),
  content       text not null,
  is_pinned     boolean not null default false,
  is_locked     boolean not null default false,
  view_count    integer not null default 0,
  reply_count   integer not null default 0,
  last_reply_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.forum_replies (
  id         uuid primary key default gen_random_uuid(),
  thread_id  uuid not null references public.forum_threads (id) on delete cascade,
  author_id  uuid not null references public.profiles (id) on delete cascade,
  content    text not null,
  is_solution boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_threads_category on public.forum_threads (category_id);
create index if not exists idx_threads_author on public.forum_threads (author_id);
create index if not exists idx_replies_thread on public.forum_replies (thread_id);

-- ------------------------------------------------------------
-- 4. PC_BUILDS — Rakitan PC dari komunitas
-- ------------------------------------------------------------
create table if not exists public.pc_builds (
  id           uuid primary key default gen_random_uuid(),
  author_id    uuid not null references public.profiles (id) on delete cascade,
  title        text not null,
  slug         text unique not null,
  description  text,
  total_price  numeric(12, 2),
  build_type   text not null default 'gaming'
               check (build_type in ('gaming', 'productivity', 'content-creator', 'mini-itx', 'budget')),
  parts        jsonb not null default '[]'::jsonb, -- [{ part: "CPU", product_id: uuid, note: "..." }]
  cover_image  text,
  is_public    boolean not null default true,
  like_count   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_builds_author on public.pc_builds (author_id);
create index if not exists idx_builds_type on public.pc_builds (build_type);

-- ------------------------------------------------------------
-- Trigger: auto-update updated_at
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_products_updated before update on public.products
  for each row execute function public.set_updated_at();
create trigger trg_threads_updated before update on public.forum_threads
  for each row execute function public.set_updated_at();
create trigger trg_replies_updated before update on public.forum_replies
  for each row execute function public.set_updated_at();
create trigger trg_builds_updated before update on public.pc_builds
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Seed: kategori forum
-- ------------------------------------------------------------
insert into public.forum_categories (name, slug, description, sort_order) values
  ('Diskusi Umum',   'diskusi-umum',   'Topik bebas seputar teknologi',            1),
  ('Tanya Jawab',    'tanya-jawab',    'Pertanyaan & solusi masalah teknis',       2),
  ('Review Produk',  'review-produk',  'Pengalaman pakai produk nyata',            3),
  ('Rakitan PC',     'rakitan-pc',     'Build, upgrade, dan troubleshooting PC',   4)
on conflict (slug) do nothing;
