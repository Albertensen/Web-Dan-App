import { getUserRole } from "@/lib/admin-auth";
import Link from "next/link";
import AdminQuotes from "@/components/admin/AdminQuotes";

export const metadata = {
  title: "Review Penawaran — TeknoHub",
  description: "Admin review permintaan penawaran rakit PC",
};

export default async function AdminQuotesPage() {
  const role = await getUserRole();

  // Proteksi sisi server: layanan Rakit PC hanya untuk Official Admin
  if (role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center mb-5">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-foreground">Akses Ditolak</h1>
        <p className="text-muted text-sm mt-2 max-w-md">
          Layanan Rakit PC khusus Official Admin. Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <Link
          href="/admin"
          className="mt-6 px-6 py-3 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent-secondary transition shadow-sm"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return <AdminQuotes />;
}
