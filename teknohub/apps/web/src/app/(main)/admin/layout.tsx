import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/admin-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const role = await getUserRole();

  if (!role) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/admin")}`);
  }

  const roleLabel =
    role === "admin"
      ? "Super Admin"
      : role === "marketplace"
      ? "Staff Marketplace"
      : role === "moderator"
      ? "Moderator"
      : "Member (Akses Toko)";

  return (
    <div className="flex min-h-[calc(100vh-10rem)] bg-slate-100">
      <AdminSidebar userRole={role} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Portal Toko & Back-Office"
          subtitle={`Akses: ${roleLabel}`}
        />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
