import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";

interface EnrichedProduct extends Product {
  avg_rating?: number;
}

const DIGITAL_PRODUCTS: EnrichedProduct[] = [
  {
    id: "prod-dig-1",
    name: "Windows 11 Pro Retail Lifetime License Key",
    slug: "windows-11-pro-retail-key",
    description: "Lisensi original Windows 11 Professional 64-bit Retail Key resmi Microsoft. Aktivasi seumur hidup (Lifetime) untuk 1 PC. Mendukung update resmi langsung dari server Microsoft. Kode lisensi 25 karakter dikirim instan 0 detik setelah pembayaran.",
    price: 249000,
    original_price: 3499000,
    stock: 50,
    category: "software",
    brand: "Microsoft",
    image_url: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&q=80&auto=format&fit=crop",
    is_active: true,
    is_digital: true,
    license_type: "Retail Key (1 PC Lifetime)",
    digital_instructions: "Masuk ke Settings > System > Activation > Change Product Key. Masukkan 25 digit serial key yang tercantum pada invoice Anda.",
    download_url: null,
    reviews: [{ rating: 5 }, { rating: 5 }, { rating: 4.8 }],
    avg_rating: 4.9,
  },
  {
    id: "prod-dig-2",
    name: "Microsoft 365 Personal 1 Tahun (Official Subscription)",
    slug: "microsoft-365-personal-1-year",
    description: "Langganan resmi Microsoft 365 Personal selama 12 bulan (1 Tahun). Termasuk akses penuh aplikasi premium: Word, Excel, PowerPoint, Outlook, serta cloud storage 1TB OneDrive. Kompatibel untuk Windows, macOS, iOS, dan Android.",
    price: 499000,
    original_price: 959900,
    stock: 35,
    category: "software",
    brand: "Microsoft",
    image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80&auto=format&fit=crop",
    is_active: true,
    is_digital: true,
    license_type: "1 Year Subscription (1 User)",
    digital_instructions: "Kunjungi setup.office.com, login dengan akun Microsoft Anda, lalu masukkan 25 digit kode redeem untuk mengaktifkan langganan 1 tahun.",
    download_url: null,
    reviews: [{ rating: 5 }, { rating: 5 }],
    avg_rating: 4.9,
  },
  {
    id: "prod-dig-3",
    name: "Steam Wallet IDR 250.000 Digital Voucher Code",
    slug: "steam-wallet-idr-250000",
    description: "Voucher resmi Steam Wallet senilai Rp 250.000 untuk regional Indonesia. Saldo dapat langsung digunakan untuk membeli game, item in-game, dan DLC di platform Valve Steam. Kode voucher dikirim otomatis.",
    price: 260000,
    original_price: null,
    stock: 100,
    category: "game-voucher",
    brand: "Valve Steam",
    image_url: "https://images.unsplash.com/photo-1612287233280-9b49b38ff40a?w=1200&q=80&auto=format&fit=crop",
    is_active: true,
    is_digital: true,
    license_type: "Redeem Code (IDR)",
    digital_instructions: "Buka aplikasi Steam > Menu Games > Redeem a Steam Wallet Code. Masukkan kode voucher dan saldo Rp 250.000 akan langsung masuk ke wallet.",
    download_url: null,
    reviews: [{ rating: 5 }, { rating: 5 }, { rating: 5 }],
    avg_rating: 5.0,
  },
  {
    id: "prod-dig-4",
    name: "Xbox Game Pass Ultimate PC 3 Bulan",
    slug: "xbox-game-pass-ultimate-pc-3-months",
    description: "Akses ratusan game PC berkualitas tinggi termasuk game day-one release dari Xbox Game Studios, EA Play membership, dan Riot Games benefits selama 3 bulan penuh.",
    price: 375000,
    original_price: 450000,
    stock: 25,
    category: "game-voucher",
    brand: "Xbox",
    image_url: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=1200&q=80&auto=format&fit=crop",
    is_active: true,
    is_digital: true,
    license_type: "3 Months PC Subscription",
    digital_instructions: "Kunjungi redeem.microsoft.com, masukkan kode voucher 25 karakter, lalu buka aplikasi Xbox di Windows untuk mulai bermain.",
    download_url: null,
    reviews: [{ rating: 5 }],
    avg_rating: 4.9,
  },
  {
    id: "prod-dig-5",
    name: "Bitdefender Total Security 1 PC 1 Tahun",
    slug: "bitdefender-total-security-1-year",
    description: "Perlindungan antivirus dan keamanan siber tingkat korporat nomor 1 di dunia. Fitur lengkap: Multi-layer Ransomware Protection, Network Threat Prevention, VPN Aman, dan Parental Control.",
    price: 189000,
    original_price: 399000,
    stock: 40,
    category: "software",
    brand: "Bitdefender",
    image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80&auto=format&fit=crop",
    is_active: true,
    is_digital: true,
    license_type: "1 PC / 1 Year License",
    digital_instructions: "Download installer di central.bitdefender.com, buat akun, lalu masukkan kode aktivasi lisensi di menu My Subscriptions.",
    download_url: null,
    reviews: [{ rating: 5 }, { rating: 4.6 }],
    avg_rating: 4.8,
  },
  {
    id: "prod-dig-6",
    name: "E-Book & Video Guide: Master AI PC Builder & Tuning 2026",
    slug: "ebook-master-ai-pc-builder-2026",
    description: "Panduan komprehensif 150+ halaman PDF berilustrasi warna & link video tutorial: Cara meracik PC AI & Gaming bebas bottleneck, panduan airflow & kabel manajemen rapi, overclocking aman, dan instalasi local LLM AI.",
    price: 99000,
    original_price: 299000,
    stock: 999,
    category: "course",
    brand: "TeknoHub Academy",
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80&auto=format&fit=crop",
    is_active: true,
    is_digital: true,
    license_type: "PDF E-Book + Video Access",
    digital_instructions: "Akses download file PDF dan link video eksklusif langsung aktif di dashboard pesanan Anda setelah checkout selesai.",
    download_url: "https://teknohub-web.vercel.app/downloads/sample-guide.pdf",
    reviews: [{ rating: 5 }, { rating: 5 }],
    avg_rating: 5.0,
  },
];

const DIGITAL_CATEGORIES = ["software", "game-voucher", "course", "license"];
const COMPONENT_CHILDREN = ["cpu", "gpu", "ram", "storage", "motherboard", "psu", "case", "cooler"];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const brandsParam = searchParams.get("brands");
  const inStock = searchParams.get("in_stock");
  const sort = searchParams.get("sort") || "relevance";
  const type = searchParams.get("type");
  const limit = Number(searchParams.get("limit")) || 50;

  // 1. Ambil produk fisik dari DB
  let dbProducts: Product[] = [];
  try {
    const { data } = await supabase.from("products").select("*").eq("is_active", true);
    if (data) dbProducts = data as Product[];
  } catch (e) {
    console.error("DB fetch error:", e);
  }

  // 2. Gabungkan produk fisik & produk digital
  const allProducts: EnrichedProduct[] = [
    ...dbProducts.map((p) => ({ ...p, is_digital: false })),
    ...DIGITAL_PRODUCTS,
  ];

  // 3. Filter berdasarkan tipe (All, Physical, Digital)
  let filtered = allProducts;
  if (type === "digital") {
    filtered = filtered.filter((p) => p.is_digital === true || DIGITAL_CATEGORIES.includes(p.category));
  } else if (type === "physical") {
    filtered = filtered.filter((p) => !p.is_digital && !DIGITAL_CATEGORIES.includes(p.category));
  }

  // 4. Filter Kategori
  if (category && category !== "all") {
    const targetCats = category === "komponen" ? COMPONENT_CHILDREN : [category];
    filtered = filtered.filter((p) => targetCats.includes(p.category));
  }

  // 5. Filter Pencarian
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // 6. Filter Harga & Brand
  if (minPrice && !isNaN(Number(minPrice))) filtered = filtered.filter((p) => p.price >= Number(minPrice));
  if (maxPrice && !isNaN(Number(maxPrice))) filtered = filtered.filter((p) => p.price <= Number(maxPrice));
  if (brandsParam) {
    const brands = brandsParam.split(",").map((b) => b.trim().toLowerCase()).filter(Boolean);
    if (brands.length) filtered = filtered.filter((p) => Boolean(p.brand && brands.includes(p.brand.toLowerCase())));
  }
  if (inStock === "1") filtered = filtered.filter((p) => p.stock > 0);

  // 7. Sort
  if (sort === "price_asc") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") filtered.sort((a, b) => b.price - a.price);
  if (sort === "rating_desc") filtered.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));

  return NextResponse.json({ data: filtered.slice(0, limit) });
}
