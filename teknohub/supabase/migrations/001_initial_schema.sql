-- ============================================================
-- TeknoHub — Initial Schema
-- Tabel: profiles, products, orders, cart, forum_categories,
--        threads, replies, votes, pc_components, component_prices,
--        pc_builds, build_components, build_quotes
-- ============================================================

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text unique not null check (char_length(username) between 3 and 20),
  full_name   text,
  avatar_url  text,
  bio         text default '',
  location    text,
  role        text not null default 'member' check (role in ('member', 'moderator', 'admin')),
  reputation  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- ============================================================
-- PRODUCTS
-- ============================================================
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text unique not null,
  category     text not null check (category in (
    'laptop', 'smartphone', 'monitor', 'cpu', 'gpu', 'ram',
    'storage', 'motherboard', 'psu', 'case', 'cooler', 'aksesoris'
  )),
  brand        text,
  description  text,
  image_url    text,
  price        numeric(12, 2) check (price >= 0),
  currency     text not null default 'IDR',
  stock        integer not null default 0,
  specs        jsonb not null default '{}'::jsonb,
  is_active    boolean not null default true,
  created_by   uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_slug on public.products (slug);
create index if not exists idx_products_active on public.products (is_active);

alter table public.products enable row level security;

create policy "Products are viewable by everyone"
  on public.products for select using (is_active = true);

create policy "Admins can manage products"
  on public.products for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  status        text not null default 'pending' check (status in (
    'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  )),
  total_amount  numeric(12, 2) not null default 0,
  currency      text not null default 'IDR',
  shipping_address jsonb not null default '{}'::jsonb,
  payment_method text,
  midtrans_order_id text unique,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_orders_user on public.orders (user_id);
create index if not exists idx_orders_status on public.orders (status);

alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select using (auth.uid() = user_id);

create policy "Users can create orders"
  on public.orders for insert with check (auth.uid() = user_id);

create policy "Users can update own orders"
  on public.orders for update using (auth.uid() = user_id);

-- ============================================================
-- ORDER ITEMS (order detail)
-- ============================================================
create table if not exists public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  name       text not null,
  price      numeric(12, 2) not null,
  quantity   integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order on public.order_items (order_id);

alter table public.order_items enable row level security;

create policy "Users can view own order items"
  on public.order_items for select using (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );

create policy "Users can create order items"
  on public.order_items for insert with check (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );

-- ============================================================
-- CART
-- ============================================================
create table if not exists public.cart (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  quantity   integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index if not exists idx_cart_user on public.cart (user_id);

alter table public.cart enable row level security;

create policy "Users can manage own cart"
  on public.cart for all using (auth.uid() = user_id);

-- ============================================================
-- FORUM CATEGORIES
-- ============================================================
create table if not exists public.forum_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  description text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.forum_categories enable row level security;

create policy "Forum categories are viewable by everyone"
  on public.forum_categories for select using (true);

-- ============================================================
-- THREADS
-- ============================================================
create table if not exists public.threads (
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

create index if not exists idx_threads_category on public.threads (category_id);
create index if not exists idx_threads_author on public.threads (author_id);
create index if not exists idx_threads_pinned on public.threads (is_pinned, last_reply_at desc);

alter table public.threads enable row level security;

create policy "Threads are viewable by everyone"
  on public.threads for select using (true);

create policy "Authenticated users can create threads"
  on public.threads for insert with check (auth.uid() = author_id);

create policy "Authors can update own threads"
  on public.threads for update using (auth.uid() = author_id);

-- ============================================================
-- REPLIES
-- ============================================================
create table if not exists public.replies (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references public.threads (id) on delete cascade,
  author_id   uuid not null references public.profiles (id) on delete cascade,
  content     text not null,
  is_solution boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_replies_thread on public.replies (thread_id);

alter table public.replies enable row level security;

create policy "Replies are viewable by everyone"
  on public.replies for select using (true);

create policy "Authenticated users can create replies"
  on public.replies for insert with check (auth.uid() = author_id);

create policy "Authors can update own replies"
  on public.replies for update using (auth.uid() = author_id);

-- ============================================================
-- VOTES (upvote/downvote untuk thread & reply)
-- ============================================================
create table if not exists public.votes (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references public.profiles (id) on delete cascade,
  target_id uuid not null,
  target_type text not null check (target_type in ('thread', 'reply')),
  value     integer not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  unique (user_id, target_id, target_type)
);

create index if not exists idx_votes_target on public.votes (target_id, target_type);

alter table public.votes enable row level security;

create policy "Votes are viewable by everyone"
  on public.votes for select using (true);

create policy "Users can vote"
  on public.votes for insert with check (auth.uid() = user_id);

create policy "Users can update own votes"
  on public.votes for update using (auth.uid() = user_id);

-- ============================================================
-- PC COMPONENTS (untuk PC Builder AI)
-- ============================================================
create table if not exists public.pc_components (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  brand       text,
  component_type text not null check (component_type in (
    'cpu', 'gpu', 'ram', 'storage', 'motherboard', 'psu', 'case', 'cooler'
  )),
  socket      text,
  specs       jsonb not null default '{}'::jsonb,
  image_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_components_type on public.pc_components (component_type);
create index if not exists idx_components_socket on public.pc_components (socket);

alter table public.pc_components enable row level security;

create policy "Components are viewable by everyone"
  on public.pc_components for select using (true);

create policy "Admins can manage components"
  on public.pc_components for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- COMPONENT PRICES (harga real dari marketplace, history tracking)
-- ============================================================
create table if not exists public.component_prices (
  id           uuid primary key default gen_random_uuid(),
  component_id uuid not null references public.pc_components (id) on delete cascade,
  source       text not null check (source in ('tokopedia', 'shopee', 'official')),
  url          text,
  price        numeric(12, 2) not null check (price >= 0),
  currency     text not null default 'IDR',
  fetched_at   timestamptz not null default now()
);

create index if not exists idx_prices_component on public.component_prices (component_id);
create index if not exists idx_prices_source on public.component_prices (source, fetched_at desc);

alter table public.component_prices enable row level security;

create policy "Prices are viewable by everyone"
  on public.component_prices for select using (true);

create policy "Admins can manage prices"
  on public.component_prices for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- PC BUILDS
-- ============================================================
create table if not exists public.pc_builds (
  id           uuid primary key default gen_random_uuid(),
  author_id    uuid not null references public.profiles (id) on delete cascade,
  title        text not null,
  slug         text unique not null,
  description  text,
  total_price  numeric(12, 2),
  build_type   text not null default 'gaming' check (build_type in (
    'gaming', 'productivity', 'content-creator', 'mini-itx', 'budget'
  )),
  cover_image  text,
  is_public    boolean not null default true,
  like_count   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_builds_author on public.pc_builds (author_id);
create index if not exists idx_builds_type on public.pc_builds (build_type);

alter table public.pc_builds enable row level security;

create policy "Public builds are viewable by everyone"
  on public.pc_builds for select using (is_public = true or auth.uid() = author_id);

create policy "Authenticated users can create builds"
  on public.pc_builds for insert with check (auth.uid() = author_id);

create policy "Authors can update own builds"
  on public.pc_builds for update using (auth.uid() = author_id);

-- ============================================================
-- BUILD COMPONENTS (relasi build ↔ komponen)
-- ============================================================
create table if not exists public.build_components (
  id           uuid primary key default gen_random_uuid(),
  build_id     uuid not null references public.pc_builds (id) on delete cascade,
  component_id uuid not null references public.pc_components (id) on delete cascade,
  quantity     integer not null default 1 check (quantity > 0),
  note         text,
  created_at   timestamptz not null default now(),
  unique (build_id, component_id)
);

create index if not exists idx_build_components_build on public.build_components (build_id);

alter table public.build_components enable row level security;

create policy "Build components are viewable with build"
  on public.build_components for select using (
    exists (select 1 from public.pc_builds where id = build_id and (is_public = true or author_id = auth.uid()))
  );

create policy "Authors can manage build components"
  on public.build_components for all using (
    exists (select 1 from public.pc_builds where id = build_id and author_id = auth.uid())
  );

-- ============================================================
-- BUILD QUOTES (penawaran resmi rakit PC)
-- ============================================================
create table if not exists public.build_quotes (
  id            uuid primary key default gen_random_uuid(),
  build_id      uuid references public.pc_builds (id) on delete set null,
  user_id       uuid not null references public.profiles (id) on delete cascade,
  status        text not null default 'requested' check (status in (
    'requested', 'drafted', 'sent', 'accepted', 'rejected', 'expired'
  )),
  ai_draft      text,
  final_quote   text,
  total_price   numeric(12, 2),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_quotes_user on public.build_quotes (user_id);
create index if not exists idx_quotes_build on public.build_quotes (build_id);

alter table public.build_quotes enable row level security;

create policy "Users can view own quotes"
  on public.build_quotes for select using (auth.uid() = user_id);

create policy "Users can request quotes"
  on public.build_quotes for insert with check (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS — auto-update updated_at
-- ============================================================
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
create trigger trg_orders_updated before update on public.orders
  for each row execute function public.set_updated_at();
create trigger trg_cart_updated before update on public.cart
  for each row execute function public.set_updated_at();
create trigger trg_threads_updated before update on public.threads
  for each row execute function public.set_updated_at();
create trigger trg_replies_updated before update on public.replies
  for each row execute function public.set_updated_at();
create trigger trg_components_updated before update on public.pc_components
  for each row execute function public.set_updated_at();
create trigger trg_builds_updated before update on public.pc_builds
  for each row execute function public.set_updated_at();
create trigger trg_quotes_updated before update on public.build_quotes
  for each row execute function public.set_updated_at();

-- ============================================================
-- SEED — kategori forum & kategori produk
-- ============================================================
insert into public.forum_categories (name, slug, description, sort_order) values
  ('Hardware',    'hardware',    'CPU, GPU, RAM, dan perangkat keras lainnya', 1),
  ('AI',          'ai',          'Diskusi AI, machine learning, dan tools-nya', 2),
  ('Mobile',      'mobile',      'Smartphone, tablet, dan gadget mobile',       3),
  ('Gaming',      'gaming',      'Setup gaming, game, dan perangkat pendukung', 4),
  ('DIY',         'diy',         'Proyek DIY, modding, dan rakitan custom',     5),
  ('Jual Beli',   'jual-beli',   'Jual beli barang bekas antar member',        6)
on conflict (slug) do nothing;
