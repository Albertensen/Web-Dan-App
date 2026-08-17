import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import AuthSlider from "@/components/auth/AuthSlider";
import { Suspense } from "react";

export const metadata = {
  title: "Daftar — TeknoHub",
  description: "Buat akun TeknoHub untuk belanja, berdiskusi, dan merakit PC.",
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions).catch(() => null);
  if (session) redirect("/");

  return (
    <div className="w-full flex justify-center">
      <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center">Memuat...</div>}>
        <AuthSlider initialMode="register" />
      </Suspense>
    </div>
  );
}
