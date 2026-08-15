import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import AuthSlider from "@/components/auth/AuthSlider";

export const metadata = {
  title: "Daftar — TeknoZone",
  description: "Buat akun TeknoZone untuk belanja, berdiskusi, dan merakit PC.",
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return (
    <div className="w-full flex justify-center">
      <AuthSlider />
    </div>
  );
}
