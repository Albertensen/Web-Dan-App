export const metadata = { title: "Profil — TeknoHub" };

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 text-primary text-4xl font-bold flex items-center justify-center mx-auto mb-4">
          A
        </div>
        <h1 className="text-2xl font-bold">Pengguna</h1>
        <p className="text-slate-500 mt-1">@username</p>
        <p className="text-slate-600 mt-4">
          Halaman profil — data akan terisi setelah login.
        </p>
      </div>
    </div>
  );
}
