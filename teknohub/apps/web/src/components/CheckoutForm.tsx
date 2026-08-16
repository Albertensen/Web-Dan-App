"use client";

import { useState } from "react";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";

const COURIERS = [
  { value: "jne", label: "JNE" },
  { value: "jnt", label: "J&T Express" },
  { value: "sicepat", label: "SiCepat" },
  { value: "grab", label: "GrabExpress" },
];

type FormState = {
  name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  courier: CheckoutInput["courier"];
  notes: string;
};

const initialForm: FormState = {
  name: "",
  phone: "",
  address: "",
  city: "",
  postal_code: "",
  courier: "jne",
  notes: "",
};

// window.snap type (Midtrans Snap global)
declare global {
  interface Window {
    snap?: { pay: (token: string) => void };
  }
}

export default function CheckoutForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = String(issue.path[0] ?? "general");
        newErrors[key] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      // Simulasi POST /api/checkout → dapat snap_token (integrasi Midtrans Fase berikutnya)
      await new Promise((r) => setTimeout(r, 800));
      const mockToken = "mock_midtrans_token_xyz123";

      // Inject Midtrans Snap script
      const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
      if (clientKey && !document.getElementById("midtrans-snap")) {
        const script = document.createElement("script");
        script.id = "midtrans-snap";
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", clientKey);
        document.body.appendChild(script);
      }

      if (window.snap?.pay) {
        window.snap.pay(mockToken);
      } else {
        alert("Checkout berhasil (Midtrans token akan diisi Fase berikutnya)");
      }
    } catch {
      setErrors({ general: "Terjadi kesalahan saat memproses pembayaran." });
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (hasError: boolean) =>
    `w-full p-3 border ${hasError ? "border-red-500" : "border-border"} rounded-lg bg-surface text-foreground focus:ring-accent/40 focus:border-accent transition duration-150`;

  const field = (
    name: keyof FormState,
    label: string,
    type = "text",
    placeholder = ""
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-muted mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={form[name] as string}
        onChange={handleChange}
        className={inputCls(!!errors[name])}
      />
      {errors[name] && <p className="text-red-600 text-sm mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {field("name", "Nama Lengkap", "text", "Budi Santoso")}
      {field("phone", "Nomor Telepon", "tel", "081234567890")}
      {field("address", "Alamat Lengkap", "text", "Jl. Merdeka No. 10, RT 01/RW 02")}
      {field("city", "Kota", "text", "Jakarta Selatan")}
      {field("postal_code", "Kode Pos", "text", "12345")}

      <div>
        <label htmlFor="courier" className="block text-sm font-medium text-muted mb-1">
          Kurir
        </label>
        <select
          id="courier"
          name="courier"
          value={form.courier}
          onChange={handleChange}
          className={inputCls(!!errors.courier)}
        >
          {COURIERS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        {errors.courier && <p className="text-red-600 text-sm mt-1">{errors.courier}</p>}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-muted mb-1">
          Catatan (opsional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={form.notes}
          onChange={handleChange}
          className={inputCls(false)}
          placeholder="Catatan untuk kurir..."
        />
      </div>

      {errors.general && (
        <p className="text-red-600 text-sm">{errors.general}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {submitting ? "Memproses..." : "Bayar Sekarang"}
      </button>
    </form>
  );
}
