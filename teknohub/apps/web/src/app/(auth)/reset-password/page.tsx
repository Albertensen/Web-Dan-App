import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Reset Password — TeknoZone",
  description: "Buat password baru untuk akun TeknoZone Anda.",
};

export default function ResetPasswordPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Buat password baru 🔒</h1>
        <p className="text-sm text-muted">
          Masukkan password baru untuk akun Anda.
        </p>
      </div>
      <ResetPasswordForm />
    </div>
  );
}
