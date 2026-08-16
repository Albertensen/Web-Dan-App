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
      ? "Staff Toko"
      : role === "moderator"
      ? "Moderator"
      : "Member (Akses Toko)";

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-10rem)] bg-slate-100 w-full overflow-x-hidden">
      <AdminSidebar userRole={role} />
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <AdminHeader
          title="Portal Toko &amp; Manajemen"
          subtitle={`Status: ${roleLabel}`}
        />
        <div className="flex-1 overflow-y-auto w-full">{children}</div>
      </div>
    </div>
  );
}
