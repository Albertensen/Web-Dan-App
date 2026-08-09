import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Lupa Password — TeknoZone",
  description: "Kirim link reset password ke email Anda.",
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Lupa password? 🔑</h1>
        <p className="text-sm text-muted">
          Masukkan email terdaftar — kami kirim link untuk membuat password baru.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
