import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/profile");

  return (
    <main className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="glow-card p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Masuk ke TeknoHub</h1>
          <p className="text-slate-400 text-sm mb-8">
            Login dengan Google untuk mulai belanja, berdiskusi, dan merakit PC.
          </p>
          <form action="/api/auth/signin/google" method="POST">
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 font-semibold hover:opacity-90 transition-opacity"
            >
              Lanjutkan dengan Google
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
