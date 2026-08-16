import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { createClient } from "@supabase/supabase-js";

export type AdminRole = "admin" | "moderator" | "marketplace" | "member" | null;

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("supabaseKey is required");
  return createClient(url, key);
}

/** Ambil role user dari tabel profiles (server-only). null = belum login. */
export async function getUserRole(): Promise<AdminRole> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const { data } = await getServiceClient()
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();
  return (data?.role as AdminRole) ?? "member";
}

/** Cek akses portal toko (semua user login diizinkan akses dashboard, pesanan, produk, forum). */
export async function requireAdminRole(): Promise<{ role: AdminRole; isStaff: boolean }> {
  const role = await getUserRole();
  return { role, isStaff: role !== null };
}

/** Cek apakah role berhak kelola PC Builder (Komponen & Quotes) -> Hanya Super Admin */
export function canManagePCBuilder(role: AdminRole): boolean {
  return role === "admin";
}

/** Cek apakah role berhak kelola Pengguna & Hak Akses -> Hanya Super Admin */
export function canManageUsers(role: AdminRole): boolean {
  return role === "admin";
}
