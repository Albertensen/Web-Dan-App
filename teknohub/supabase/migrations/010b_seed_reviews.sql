-- ============================================================
-- TeknoHub — Migration 010b: Seed Product Reviews (per produk)
-- Pattern: 5 Silver (rating 4-5), 3 Gold (rating 3-5), 1 Diamond (5)
-- ============================================================

-- Review utk 15 produk seed (003). Map: slug -> 9 review (5S + 3G + 1D)
-- Silver users: 0000...001-009, Gold: ...010-012, Diamond: ...013
do $$
declare
  p record;
  r record;
  revs text[];
begin
  for p in
    select id, slug from public.products where slug in (
      'rog-strix-g16','legion-5-pro','nitro-v15','galaxy-s24-ultra','iphone-15-pro',
      'redmi-note-13','lg-ultragear-27','samsung-odyssey-g5','msi-g274qpf','rtx-4070-super',
      'rx-7800-xt','ryzen-7-7800x3d','core-i7-14700k','corsair-vengeance-32gb-ddr5','kingston-fury-16gb-ddr5'
    )
  loop
    -- 5 review Silver (rating 4-5)
    for i in 1..5 loop
      insert into public.product_reviews (product_id, user_id, rating, comment)
      select p.id, ('00000000-0000-4000-a001-00000000000' || i)::uuid,
             case when i % 2 = 0 then 4 else 5 end,
             case i
               when 1 then 'Packing rapi, barang original. Recommended seller!'
               when 2 then 'Produk sesuai deskripsi, pengiriman agak lama tapi aman.'
               when 3 then 'Kualitas bagus untuk harga segini. Puas!'
               when 4 then 'Fungsinya oke, tapi garansi agak ribet diklaim.'
               when 5 then 'Mantap! Barang sesuai foto, fast response seller.'
             end
      on conflict (product_id, user_id) do nothing;
    end loop;
    -- 3 review Gold (rating 3-5)
    for i in 10..12 loop
      insert into public.product_reviews (product_id, user_id, rating, comment)
      select p.id, ('00000000-0000-4000-a001-0000000000' || i)::uuid,
             case i
               when 10 then 4
               when 11 then 5
               else 3
             end,
             case i
               when 10 then 'Sudah beli 3x di sini, kualitas konsisten. Good!'
               when 11 then 'Produk premium, performa sesuai ekspektasi. Top tier!'
               else 'Bagus, tapi harga naik turun. Pantau sebelum beli.'
             end
      on conflict (product_id, user_id) do nothing;
    end loop;
    -- 1 review Diamond (5)
    insert into public.product_reviews (product_id, user_id, rating, comment)
    select p.id, '00000000-0000-4000-a001-000000000013'::uuid, 5,
           'Trusted seller, garansi resmi, support purna jual cepat. Saya pelanggan lama, tidak pernah kecewa.'
    on conflict (product_id, user_id) do nothing;
  end loop;
end $$;

-- Verifikasi
select count(*) as total_reviews from public.product_reviews;
select p.slug,
       count(*) filter (where pr.rating >= 4) as reviews_4plus
from public.product_reviews pr
join public.products p on p.id = pr.product_id
group by p.slug
order by p.slug;
