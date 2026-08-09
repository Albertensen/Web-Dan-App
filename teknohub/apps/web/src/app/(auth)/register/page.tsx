import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Daftar — TeknoZone",
  description: "Buat akun TeknoZone untuk belanja, berdiskusi, dan merakit PC.",
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Buat akun baru ✨</h1>
        <p className="text-sm text-muted">
          Bergabung dengan komunitas TeknoZone — gratis dan hanya butuh 1 menit.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
