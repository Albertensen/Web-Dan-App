-- ============================================================
-- TeknoHub — Migration 010b: Seed Product Reviews (per produk)
-- Pattern: 5 Silver (rating 4-5), 3 Gold (rating 3-5), 1 Diamond (5)
-- User id diambil dari profiles (hasil trigger handle_new_user)
-- ============================================================

-- 1) Set reputasi tier utk user seed (username dari user_metadata)
update public.profiles set reputation = v.rep from (values
  ('silver1', 5), ('silver2', 3), ('silver3', 7), ('silver4', 2),
  ('silver5', 9), ('silver6', 4), ('silver7', 6), ('silver8', 8),
  ('silver9', 1), ('gold1', 25), ('gold2', 40), ('gold3', 15),
  ('diamond1', 80)
) as v(username, rep) where public.profiles.username = v.username;

-- 2) Hapus review orphan (profil user tidak ada)
delete from public.product_reviews pr
where not exists (select 1 from public.profiles p where p.id = pr.user_id);

-- 3) Seed 9 review per produk (15 produk = 135 review)
-- Silver: silver1=5, silver2=4, silver3=5, silver4=4, silver5=5
-- Gold:   gold1=4,   gold2=5,   gold3=3
-- Diamond: diamond1=5
insert into public.product_reviews (product_id, user_id, rating, comment)
select
  p.id as product_id,
  u.id as user_id,
  v.rating,
  v.comment
from public.products p
cross join (values
  ('silver1', 5, 'Packing rapi, barang original. Recommended seller!'),
  ('silver2', 4, 'Produk sesuai deskripsi, pengiriman agak lama tapi aman.'),
  ('silver3', 5, 'Kualitas bagus untuk harga segini. Puas!'),
  ('silver4', 4, 'Fungsinya oke, tapi garansi agak ribet diklaim.'),
  ('silver5', 5, 'Mantap! Barang sesuai foto, fast response seller.'),
  ('gold1', 4, 'Sudah beli 3x di sini, kualitas konsisten. Good!'),
  ('gold2', 5, 'Produk premium, performa sesuai ekspektasi. Top tier!'),
  ('gold3', 3, 'Bagus, tapi harga naik turun. Pantau sebelum beli.'),
  ('diamond1', 5, 'Trusted seller, garansi resmi, support purna jual cepat. Saya pelanggan lama, tidak pernah kecewa.')
) as v(username, rating, comment)
join public.profiles u on u.username = v.username
on conflict (product_id, user_id) do nothing;
