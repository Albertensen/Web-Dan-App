import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Masuk — TeknoZone",
  description: "Masuk ke akun TeknoZone untuk belanja, berdiskusi, dan merakit PC.",
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Selamat datang kembali 👋</h1>
        <p className="text-sm text-muted">
          Masuk untuk melanjutkan ke marketplace, forum, dan PC Builder.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
