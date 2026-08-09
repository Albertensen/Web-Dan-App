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
  /** Waktu pembuatan catatan ini */
  created_at: string;
}
