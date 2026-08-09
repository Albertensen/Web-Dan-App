-- ============================================================
-- TeknoHub — Migration 003: Seed Produk Elektronik (15 produk)
-- Sesuai schema 001: products.category = text enum
-- ============================================================

INSERT INTO public.products (name, slug, category, brand, description, price, stock, image_url, is_active) VALUES
('ROG Strix G16', 'rog-strix-g16', 'laptop', 'ASUS', 'Laptop gaming dengan performa grafis superior.', 28999000, 30, NULL, TRUE),
('Legion 5 Pro', 'legion-5-pro', 'laptop', 'Lenovo', 'Laptop gaming dengan desain elegan dan pendinginan optimal.', 25999000, 25, NULL, TRUE),
('Nitro V15', 'nitro-v15', 'laptop', 'Acer', 'Laptop gaming entry-level dengan performa solid.', 12999000, 40, NULL, TRUE),
('Galaxy S24 Ultra', 'galaxy-s24-ultra', 'smartphone', 'Samsung', 'Smartphone flagship dengan kamera dan fitur AI tercanggih.', 19999000, 50, NULL, TRUE),
('iPhone 15 Pro', 'iphone-15-pro', 'smartphone', 'Apple', 'Smartphone premium dengan ekosistem Apple yang terintegrasi.', 21999000, 35, NULL, TRUE),
('Redmi Note 13', 'redmi-note-13', 'smartphone', 'Xiaomi', 'Smartphone mid-range dengan rasio harga dan performa terbaik.', 2999000, 45, NULL, TRUE),
('LG UltraGear 27"', 'lg-ultragear-27', 'monitor', 'LG', 'Monitor gaming dengan refresh rate tinggi dan warna akurat.', 4599000, 20, NULL, TRUE),
('Samsung Odyssey G5', 'samsung-odyssey-g5', 'monitor', 'Samsung', 'Monitor gaming dengan desain futuristik dan warna cerah.', 3799000, 30, NULL, TRUE),
('MSI G274QPF', 'msi-g274qpf', 'monitor', 'MSI', 'Monitor gaming 144Hz dengan resolusi QHD.', 3299000, 28, NULL, TRUE),
('RTX 4070 Super', 'rtx-4070-super', 'gpu', 'NVIDIA', 'Kartu grafis generasi terbaru untuk gaming 1440p.', 8999000, 15, NULL, TRUE),
('RX 7800 XT', 'rx-7800-xt', 'gpu', 'AMD', 'Alternatif GPU berperforma tinggi dengan efisiensi daya yang baik.', 7499000, 22, NULL, TRUE),
('Ryzen 7 7800X3D', 'ryzen-7-7800x3d', 'cpu', 'AMD', 'CPU gaming terbaik dengan teknologi 3D V-Cache.', 5799000, 18, NULL, TRUE),
('Core i7-14700K', 'core-i7-14700k', 'cpu', 'Intel', 'CPU serbaguna untuk produktivitas dan gaming berat.', 5699000, 20, NULL, TRUE),
('Corsair Vengeance 32GB DDR5', 'corsair-vengeance-32gb-ddr5', 'ram', 'Corsair', 'Kit RAM berkapasitas besar untuk multitasking berat.', 1799000, 38, NULL, TRUE),
('Kingston Fury 16GB DDR5', 'kingston-fury-16gb-ddr5', 'ram', 'Kingston', 'Upgrade RAM standar dengan performa stabil.', 899000, 42, NULL, TRUE)
ON CONFLICT (slug) DO NOTHING;
