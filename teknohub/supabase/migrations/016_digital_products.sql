-- Migration 016: Menambahkan dukungan Produk Digital (Software, License, Vouchers)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_digital BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS license_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS download_url TEXT,
ADD COLUMN IF NOT EXISTS digital_instructions TEXT;

ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS is_digital BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS digital_code TEXT;

-- Tambahkan kategori digital ke forum_categories atau mapping jika diperlukan
INSERT INTO forum_categories (id, name, slug, description, sort_order)
VALUES 
  ('2c74aa0a-4b9e-4dd4-847e-e0b99787df99', 'Software & Lisensi', 'software', 'Diskusi seputar OS, software productivity, tools AI, dan lisensi digital.', 7)
ON CONFLICT (slug) DO NOTHING;

-- Seed 6 Produk Digital Resmi
INSERT INTO products (name, slug, description, price, original_price, stock, category, brand, image_url, is_active, is_digital, license_type, digital_instructions, download_url)
VALUES 
(
  'Windows 11 Pro Retail Lifetime License Key',
  'windows-11-pro-retail-key',
  'Lisensi original Windows 11 Professional 64-bit Retail Key resmi Microsoft. Aktivasi seumur hidup (Lifetime) untuk 1 PC. Mendukung update resmi langsung dari server Microsoft. Kode lisensi 25 karakter dikirim instan 0 detik setelah pembayaran.',
  249000,
  3499000,
  50,
  'software',
  'Microsoft',
  'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&q=80&auto=format&fit=crop',
  true,
  true,
  'Retail Key (1 PC Lifetime)',
  'Masuk ke Settings > System > Activation > Change Product Key. Masukkan 25 digit serial key yang tercantum pada invoice Anda.',
  NULL
),
(
  'Microsoft 365 Personal 1 Tahun (Official Subscription)',
  'microsoft-365-personal-1-year',
  'Langganan resmi Microsoft 365 Personal selama 12 bulan (1 Tahun). Termasuk akses penuh aplikasi premium: Word, Excel, PowerPoint, Outlook, serta cloud storage 1TB OneDrive. Kompatibel untuk Windows, macOS, iOS, dan Android.',
  499000,
  959900,
  35,
  'software',
  'Microsoft',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80&auto=format&fit=crop',
  true,
  true,
  '1 Year Subscription (1 User)',
  'Kunjungi setup.office.com, login dengan akun Microsoft Anda, lalu masukkan 25 digit kode redeem untuk mengaktifkan langganan 1 tahun.',
  NULL
),
(
  'Steam Wallet IDR 250.000 Digital Voucher Code',
  'steam-wallet-idr-250000',
  'Voucher resmi Steam Wallet senilai Rp 250.000 untuk regional Indonesia. Saldo dapat langsung digunakan untuk membeli game, item in-game, dan DLC di platform Valve Steam. Kode voucher dikirim otomatis.',
  260000,
  NULL,
  100,
  'game-voucher',
  'Valve Steam',
  'https://images.unsplash.com/photo-1612287233280-9b49b38ff40a?w=1200&q=80&auto=format&fit=crop',
  true,
  true,
  'Redeem Code (IDR)',
  'Buka aplikasi Steam > Menu Games > Redeem a Steam Wallet Code. Masukkan kode voucher dan saldo Rp 250.000 akan langsung masuk ke wallet.',
  NULL
),
(
  'Xbox Game Pass Ultimate PC 3 Bulan',
  'xbox-game-pass-ultimate-pc-3-months',
  'Akses ratusan game PC berkualitas tinggi termasuk game day-one release dari Xbox Game Studios, EA Play membership, dan Riot Games benefits selama 3 bulan penuh.',
  375000,
  450000,
  25,
  'game-voucher',
  'Xbox',
  'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=1200&q=80&auto=format&fit=crop',
  true,
  true,
  '3 Months PC Subscription',
  'Kunjungi redeem.microsoft.com, masukkan kode voucher 25 karakter, lalu buka aplikasi Xbox di Windows untuk mulai bermain.',
  NULL
),
(
  'Bitdefender Total Security 1 PC 1 Tahun',
  'bitdefender-total-security-1-year',
  'Perlindungan antivirus dan keamanan siber tingkat korporat nomor 1 di dunia. Fitur lengkap: Multi-layer Ransomware Protection, Network Threat Prevention, VPN Aman, dan Parental Control.',
  189000,
  399000,
  40,
  'software',
  'Bitdefender',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80&auto=format&fit=crop',
  true,
  true,
  '1 PC / 1 Year License',
  'Download installer di central.bitdefender.com, buat akun, lalu masukkan kode aktivasi lisensi di menu My Subscriptions.',
  NULL
),
(
  'E-Book & Video Guide: Master AI PC Builder & Hardware Tuning 2026',
  'ebook-master-ai-pc-builder-2026',
  'Panduan komprehensif 150+ halaman PDF berilustrasi warna & link video tutorial: Cara meracik PC AI & Gaming bebas bottleneck, panduan airflow & kabel manajemen rapi, overclocking aman, dan instalasi local LLM AI.',
  99000,
  299000,
  999,
  'course',
  'TeknoHub Academy',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80&auto=format&fit=crop',
  true,
  true,
  'E-Book PDF + Video Tutorial Access',
  'Akses download file PDF dan link video eksklusif langsung aktif di dashboard pesanan Anda setelah checkout selesai.',
  'https://teknohub-web.vercel.app/downloads/sample-guide.pdf'
)
ON CONFLICT (slug) DO UPDATE SET
  is_digital = EXCLUDED.is_digital,
  license_type = EXCLUDED.license_type,
  digital_instructions = EXCLUDED.digital_instructions,
  download_url = EXCLUDED.download_url;
