import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getUserRole } from "@/lib/admin-auth";
import AdminProductForm from "@/components/admin/AdminProductForm";
import AdminProductTable, { type ProductItem } from "@/components/admin/AdminProductTable";

export const metadata = {
  title: "Admin Produk — TeknoHub",
};

export const dynamic = "force-dynamic";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("supabaseKey is required");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export default async function AdminProductsPage() {
  const role = await getUserRole();
  const session = await getServerSession(authOptions);
  const isAdmin = role === "admin";
  const currentUserId = session?.user?.id;

  let query = getServiceClient()
    .from("products")
    .select("id, name, category, brand, price, stock, image_url, slug, is_active, description, is_digital, license_type, download_url, digital_instructions, created_by")
    .order("created_at", { ascending: false });

  // Seller non-admin hanya melihat produk miliknya sendiri
  if (!isAdmin && currentUserId) {
    query = query.eq("created_by", currentUserId);
  }

  const { data: products } = await query;

  const list = (products as ProductItem[]) ?? [];

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Manajemen Produk</h1>
        <p className="text-xs text-tertiary">
          {isAdmin
            ? "Kelola seluruh katalog, stok, status aktif, dan tambah produk baru"
            : "Kelola produk milik seller Anda (fisik & digital)"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table & controls */}
        <div className="lg:col-span-2">
          <AdminProductTable initialProducts={list} isAdmin={isAdmin} />
        </div>

        {/* Form Tambah */}
        <div>
          <div className="bg-surface border border-slate-300 rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-foreground mb-3">Tambah Produk Baru</h2>
            <AdminProductForm />
          </div>
        </div>
      </div>
    </div>
  );
}
