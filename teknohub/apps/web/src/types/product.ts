export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  original_price?: number | null;
  stock: number;
  category: string;
  brand?: string | null;
  image_url: string | null;
  is_active?: boolean;
  is_digital?: boolean;
  license_type?: string | null;
  download_url?: string | null;
  digital_instructions?: string | null;
  reviews?: { rating: number }[];
  created_at?: string;
  updated_at?: string;
}
