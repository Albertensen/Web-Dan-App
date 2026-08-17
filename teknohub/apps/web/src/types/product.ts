export interface Product {
  /** ID unik produk */
  id: string;
  /** Nama produk */
  name: string;
  /** Slug (versi URL) nama produk */
  slug: string;
  /** Deskripsi lengkap produk, bisa null */
  description: string | null;
  /** Harga jual produk */
  price: number;
  /** Jumlah stok yang tersedia */
  stock: number;
  /** URL gambar utama produk, bisa null */
  image_url: string | null;
  /** Kategori produk (enum text) */
  category: string;
  /** Brand produk */
  brand: string | null;
  /** Status apakah produk aktif atau tidak */
  is_active: boolean;
  /** Apakah produk digital (software, license, voucher) */
  is_digital?: boolean;
  /** Tipe lisensi produk digital */
  license_type?: string | null;
  /** URL download produk digital */
  download_url?: string | null;
  /** Instruksi aktivasi / redeem produk digital */
  digital_instructions?: string | null;
  /** Waktu pembuatan catatan ini */
  created_at: string;
  /** Waktu update terakhir */
  updated_at?: string;
  /** Kumpulan review produk */
  reviews?: { rating: number }[];
  /** Harga coret / sebelum diskon */
  original_price?: number | null;
}
