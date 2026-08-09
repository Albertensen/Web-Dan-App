-- Migration 009: Populate marketplace_url untuk 34 komponen pc_components
-- Strategi: URL pencarian Tokopedia/Shopee per brand+model (bukan produk spesifik,
-- karena URL produk asli butuh scraping live; search URL selalu valid & berguna).
-- Update hanya komponen yang marketplace_url-nya masih NULL.

-- Tokopedia search URL: https://www.tokopedia.com/search?q=<query>
-- Shopee search URL:   https://shopee.co.id/search?keyword=<query>

-- CPU
update public.pc_components set marketplace_url = 'https://www.tokopedia.com/search?q=amd%20ryzen%205%207500f'
where name ilike '%7500F%' and marketplace_url is null;

update public.pc_components set marketplace_url = 'https://www.tokopedia.com/search?q=intel%20core%20i5%2013400f'
where name ilike '%i5-13400F%' and marketplace_url is null;

-- GPU
update public.pc_components set marketplace_url = 'https://www.tokopedia.com/search?q=rtx%204060%208gb'
where name ilike '%RTX 4060%' and marketplace_url is null;

-- RAM, SSD, Mobo, PSU, Case, Cooler — search URL generik per tipe
-- (diisi via loop di bawah, agar singkat)

-- Generic fill: semua komponen yang masih NULL dapat search URL per tipe
do $$
declare
  r record;
  q text;
begin
  for r in select id, name, component_type from public.pc_components where marketplace_url is null loop
    -- Bangun query pencarian dari nama komponen (hapus karakter spesial)
    q := translate(lower(r.name), ' ()-+/,', '');
    q := replace(q, ' ', '%20');
    update public.pc_components
    set marketplace_url = 'https://www.tokopedia.com/search?q=' || q
    where id = r.id;
  end loop;
end $$;
