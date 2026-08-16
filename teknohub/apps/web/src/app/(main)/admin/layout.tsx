import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/admin-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

/**
 * Admin layout — Server-side RBAC guard.
 * Semua halaman /admin/* wajib login + role admin/moderator.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const role = await getUserRole();

  if (!role) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/admin")}`);
  }
  if (role !== "admin" && role !== "moderator") {
    redirect("/");
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] bg-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Back-Office TeknoHub"
          subtitle={`Role: ${role === "admin" ? "Admin" : "Moderator"}`}
        />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
