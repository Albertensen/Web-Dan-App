-- ============================================================
-- TeknoHub — Migration 010: Product Reviews (Tier-based rating)
-- Setiap produk punya review dari member Silver/Gold/Diamond
-- Rating indicator: badge tier (bukan bintang), sesuai reputasi user
-- ============================================================

-- 1) Tabel review produk
create table if not exists public.product_reviews (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  rating     integer not null check (rating between 1 and 5),
  comment    text not null check (char_length(comment) between 3 and 1000),
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

create index if not exists idx_product_reviews_product on public.product_reviews (product_id);
create index if not exists idx_product_reviews_user on public.product_reviews (user_id);

alter table public.product_reviews enable row level security;

create policy "Anyone can read product reviews"
  on public.product_reviews for select using (true);

create policy "Users can create own product reviews"
  on public.product_reviews for insert with check (auth.uid() = user_id);

create policy "Users can update own product reviews"
  on public.product_reviews for update using (auth.uid() = user_id);

create policy "Users can delete own product reviews"
  on public.product_reviews for delete using (auth.uid() = user_id);

-- 2) Seed: 13 user + profil dengan reputasi beragam (tier Silver/Gold/Diamond)
-- Reputasi: <10 = Silver, 10-50 = Gold, >50 = Diamond
-- CATATAN: trigger handle_new_user buat profil default (username dari email, rep 0),
-- jadi reputasi di-update by username hasil trigger, bukan insert profil baru.
insert into auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data)
select x.id, x.email, crypt('teknozone123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'
from (values
  ('00000000-0000-4000-a001-000000000001'::uuid, 'silver1@tekno.zone'),
  ('00000000-0000-4000-a001-000000000002'::uuid, 'silver2@tekno.zone'),
  ('00000000-0000-4000-a001-000000000003'::uuid, 'silver3@tekno.zone'),
  ('00000000-0000-4000-a001-000000000004'::uuid, 'silver4@tekno.zone'),
  ('00000000-0000-4000-a001-000000000005'::uuid, 'silver5@tekno.zone'),
  ('00000000-0000-4000-a001-000000000006'::uuid, 'silver6@tekno.zone'),
  ('00000000-0000-4000-a001-000000000007'::uuid, 'silver7@tekno.zone'),
  ('00000000-0000-4000-a001-000000000008'::uuid, 'silver8@tekno.zone'),
  ('00000000-0000-4000-a001-000000000009'::uuid, 'silver9@tekno.zone'),
  ('00000000-0000-4000-a001-000000000010'::uuid, 'gold1@tekno.zone'),
  ('00000000-0000-4000-a001-000000000011'::uuid, 'gold2@tekno.zone'),
  ('00000000-0000-4000-a001-000000000012'::uuid, 'gold3@tekno.zone'),
  ('00000000-0000-4000-a001-000000000013'::uuid, 'diamond1@tekno.zone')
) as x(id, email)
on conflict (id) do nothing;

-- Set reputasi sesuai tier (username hasil trigger = bagian sebelum @)
update public.profiles set reputation = v.rep from (values
  ('silver1', 5), ('silver2', 3), ('silver3', 7), ('silver4', 2),
  ('silver5', 9), ('silver6', 4), ('silver7', 6), ('silver8', 8),
  ('silver9', 1), ('gold1', 25), ('gold2', 40), ('gold3', 15),
  ('diamond1', 80)
) as v(username, rep) where public.profiles.username = v.username;
