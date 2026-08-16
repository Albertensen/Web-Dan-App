-- Migration 013: Product reviews enhancement (verified, variant, media)
alter table public.product_reviews
  add column if not exists is_verified boolean not null default false,
  add column if not exists bought_variant text,
  add column if not exists media text[] not null default '{}';

-- user dengan reputasi >= 10 (Gold/Diamond) dianggap pembeli terverifikasi
update public.product_reviews pr set is_verified = true
from public.profiles p
where p.id = pr.user_id and p.reputation >= 10;
