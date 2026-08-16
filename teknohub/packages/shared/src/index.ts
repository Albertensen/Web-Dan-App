export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category: string;
  brand: string | null;
  is_active: boolean;
  created_at: string;
}

export interface PCComponent {
  id: string;
  name: string;
  brand: string | null;
  component_type: string;
  socket: string | null;
  specs: Record<string, unknown>;
  image_url: string | null;
  marketplace_url: string | null;
}

export interface UserOrder {
  id: string;
  user_id: string;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  total_amount: number;
  currency: string;
  shipping_address: Record<string, unknown>;
  payment_method?: string;
  created_at: string;
}

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  category_id: string;
  author_id: string;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  reply_count: number;
  tags: string[];
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: "member" | "moderator" | "marketplace" | "admin";
  reputation: number;
  created_at: string;
}
