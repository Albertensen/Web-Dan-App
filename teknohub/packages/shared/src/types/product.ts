export interface Category {
  /** ID unik kategori */
  id: string;
  /** Nama kategori */
  name: string;
  /** Slug (versi URL) nama kategori */
  slug: string;
  /** Deskripsi lengkap kategori, bisa null */
  description: string | null;
  /** Waktu pembuatan catatan ini */
  created_at: string;
}

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
  /** ID kategori tempat produk ini berada */
  category_id: string;
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
}
