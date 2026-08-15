import Link from "next/link";

export const metadata = { title: "Kebijakan Privasi — TeknoHub" };

export default function PrivacyPage() {
  return (
    <main className="flex-1 px-6 py-10 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-2">Kebijakan Privasi</h1>
      <p className="text-sm text-tertiary mb-8">Terakhir diperbarui: 15 Agustus 2026</p>
      <div className="space-y-6 text-tertiary leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Data yang Dikumpulkan</h2>
          <p>Kami mengumpulkan data akun (nama, email, username), data profil opsional, dan data aktivitas forum/transaksi yang Anda lakukan di TeknoHub.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Penggunaan Data</h2>
          <p>Data digunakan untuk: memproses login dan transaksi, menampilkan konten forum, memberikan rekomendasi PC Builder, serta meningkatkan layanan.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Keamanan</h2>
          <p>Kata sandi dienkripsi, sesi dilindungi, dan akses data dibatasi oleh kebijakan keamanan database (RLS). Kami tidak pernah menjual data pribadi Anda.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Hak Anda</h2>
          <p>Anda dapat mengakses, mengubah, atau menghapus data akun melalui halaman profil. Penghapusan akun menghapus data pribadi Anda dari sistem.</p>
        </section>
      </div>
      <p className="mt-10 text-sm text-tertiary">
        Baca juga <Link href="/terms" className="text-accent hover:underline">Syarat &amp; Ketentuan</Link>.
      </p>
    </main>
  );
}
