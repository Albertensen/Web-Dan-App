"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, selectTotalPrice, selectTotalItems } from "@/store/cartStore";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";
import { Truck, QrCode, Landmark, Wallet, CreditCard, CheckCircle2, X, Loader2 } from "lucide-react";

// Kurir + layanan (estimasi hari & ongkir deterministik)
const COURIER_PACKS = [
  { courier: "jne", label: "JNE", services: [
      { id: "jne_reg", label: "JNE Reguler", days: "2-3 hari", cost: 18000, icon: Truck },
      { id: "jne_yes", label: "JNE YES", days: "1 hari", cost: 32000, icon: Truck },
  ]},
  { courier: "sicepat", label: "SiCepat", services: [
      { id: "sc_best", label: "SiCepat BEST", days: "1-2 hari", cost: 21000, icon: Truck },
      { id: "sc_gokil", label: "SiCepat GOKIL", days: "3-5 hari", cost: 14000, icon: Truck },
  ]},
  { courier: "gosend", label: "GoSend", services: [
      { id: "go_instant", label: "GoSend Instant", days: "1-3 jam", cost: 26000, icon: Truck },
      { id: "go_sameday", label: "GoSend SameDay", days: "Hari ini", cost: 24000, icon: Truck },
  ]},
];

// Metode pembayaran
const PAYMENT_METHODS = [
  { id: "qris", label: "QRIS", desc: "Instant · semua e-wallet & m-banking", icon: QrCode },
  { id: "va", label: "Virtual Account", desc: "BCA · Mandiri · BNI · BRI", icon: Landmark },
  { id: "ewallet", label: "E-Wallet", desc: "GoPay · OVO · DANA · ShopeePay", icon: Wallet },
  { id: "cc", label: "Kartu Kredit/Debit", desc: "Visa · Mastercard · JCB", icon: CreditCard },
];

const SERVICE_FEE = 2500;
const RAKIT_FEE = 150000;
const PACKING_FEE = 35000;

type FormState = {
  name: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
  courier: CheckoutInput["courier"];
  service: string;
  notes: string;
};

const initialForm: FormState = {
  name: "", phone: "", address: "", province: "", city: "", district: "", postal_code: "",
  courier: "jne", service: "jne_reg", notes: "",
};

export default function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectTotalPrice);
  const totalItems = useCartStore(selectTotalItems);
  const clearCart = useCartStore((s) => s.clear);

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [payMethod, setPayMethod] = useState("qris");
  const [addonRakit, setAddonRakit] = useState(false);
  const [addonPacking, setAddonPacking] = useState(false);
  const [modal, setModal] = useState<null | { method: string; va: string }>(null);

  const pack = COURIER_PACKS.find((p) => p.courier === form.courier)!;
  const service = pack.services.find((s) => s.id === form.service) ?? pack.services[0];

  const shipping = service.cost;
  const addonsCost = (addonRakit ? RAKIT_FEE : 0) + (addonPacking ? PACKING_FEE : 0);
  const grandTotal = subtotal + shipping + SERVICE_FEE + addonsCost;

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const handleSetCourier = (c: string) => {
    const p = COURIER_PACKS.find((x) => x.courier === c)!;
    setForm((prev) => ({ ...prev, courier: c as FormState["courier"], service: p.services[0].id }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = checkoutSchema.safeParse({ ...form, courier: form.courier });
    if (!result.success) {
      const ne: Record<string, string> = {};
      result.error.issues.forEach((i) => { ne[String(i.path[0])] = i.message; });
      setErrors(ne);
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    // Simulasi payment intent
    const va = ["8888 0123 4567 8901", "8808 1122 3344 5566", "1 2345 6789 0123", "9001 2233 4455 6677"][
      ["qris","va","ewallet","cc"].indexOf(payMethod) % 4
    ];
    setSubmitting(false);
    setModal({ method: payMethod, va });
  };

  const finishMockPayment = () => {
    setModal(null);
    clearCart();
    alert("Pembayaran berhasil (simulasi). Pesanan Anda sedang diproses.");
    router.push("/shop/orders");
  };

  const inputCls = (hasError: boolean) =>
    `w-full p-3 border ${hasError ? "border-red-500" : "border-border"} rounded-lg bg-surface text-foreground focus:ring-accent/40 focus:border-accent transition duration-150`;

  const field = (name: keyof FormState, label: string, type = "text", placeholder = "") => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-muted mb-1">{label}</label>
      <input id={name} name={name} type={type} placeholder={placeholder} value={form[name] as string}
        onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
        className={inputCls(!!errors[name])} />
      {errors[name] && <p className="text-red-600 text-sm mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Alamat */}
      <section className="bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="font-bold text-foreground">1. Alamat Pengiriman</h2>
        {field("name", "Nama Penerima", "text", "Budi Santoso")}
        {field("phone", "No. Telepon", "tel", "081234567890")}
        {field("address", "Alamat Lengkap", "text", "Jl. Merdeka No. 10, RT 01/RW 02, Blok C2")}
        <div className="grid grid-cols-2 gap-3">
          {field("province", "Provinsi", "text", "DKI Jakarta")}
          {field("city", "Kota/Kabupaten", "text", "Jakarta Selatan")}
          {field("district", "Kecamatan", "text", "Kebayoran Baru")}
          {field("postal_code", "Kode Pos", "text", "12120")}
        </div>
      </section>

      {/* Kurir */}
      <section className="bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="font-bold text-foreground">2. Kurir & Logistik</h2>
        <div className="flex gap-2 flex-wrap">
          {COURIER_PACKS.map((p) => (
            <button type="button" key={p.courier} onClick={() => handleSetCourier(p.courier)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition ${
                form.courier === p.courier ? "bg-accent text-white border-accent" : "bg-surface border-slate-200 text-muted hover:text-accent"
              }`}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {pack.services.map((s) => (
            <label key={s.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
              form.service === s.id ? "border-accent bg-accent-dim" : "border-slate-200 dark:border-slate-800"
            }`}>
              <input type="radio" name="service" checked={form.service === s.id}
                onChange={() => setForm((pr) => ({ ...pr, service: s.id }))} className="accent-accent" />
              <s.icon size={18} className="text-accent" />
              <span className="flex-1">
                <span className="block text-sm font-semibold text-foreground">{s.label}</span>
                <span className="text-[11px] text-tertiary">Estimasi {s.days}</span>
              </span>
              <span className="text-sm font-bold text-foreground">{fmt(s.cost)}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Layanan Tambahan */}
      <section className="bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="font-bold text-foreground">Layanan Tambahan (Opsional)</h2>
        <label className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
          <span className="flex items-center gap-2">
            <input type="checkbox" checked={addonRakit} onChange={(e) => setAddonRakit(e.target.checked)} className="accent-accent" />
            <span className="text-sm font-semibold text-foreground">Jasa Rakit &amp; Cable Management</span>
          </span>
          <span className="text-sm font-bold text-foreground">{fmt(RAKIT_FEE)}</span>
        </label>
        <label className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
          <span className="flex items-center gap-2">
            <input type="checkbox" checked={addonPacking} onChange={(e) => setAddonPacking(e.target.checked)} className="accent-accent" />
            <span className="text-sm font-semibold text-foreground">Packing Kayu &amp; Asuransi Ekstra</span>
          </span>
          <span className="text-sm font-bold text-foreground">{fmt(PACKING_FEE)}</span>
        </label>
      </section>

      {/* Pembayaran */}
      <section className="bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="font-bold text-foreground">3. Metode Pembayaran</h2>
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map((m) => (
            <button type="button" key={m.id} onClick={() => setPayMethod(m.id)}
              className={`flex items-center gap-2 p-3 rounded-xl border text-left transition ${
                payMethod === m.id ? "border-accent bg-accent-dim" : "border-slate-200 dark:border-slate-800"
              }`}>
              <m.icon size={18} className="text-accent shrink-0" />
              <span className="min-w-0">
                <span className="block text-xs font-bold text-foreground">{m.label}</span>
                <span className="block text-[10px] text-tertiary truncate">{m.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
        <h2 className="font-bold text-foreground mb-3">Ringkasan Pembayaran</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted"><span>Subtotal Produk ({totalItems} item)</span><span className="font-semibold text-foreground">{fmt(subtotal)}</span></div>
          <div className="flex justify-between text-muted"><span>Ongkir ({service.label})</span><span className="font-semibold text-foreground">{fmt(shipping)}</span></div>
          <div className="flex justify-between text-muted"><span>Biaya Layanan</span><span className="font-semibold text-foreground">{fmt(SERVICE_FEE)}</span></div>
          {addonsCost > 0 && <div className="flex justify-between text-muted"><span>Layanan Tambahan</span><span className="font-semibold text-foreground">{fmt(addonsCost)}</span></div>}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between font-bold text-foreground"><span>Grand Total</span><span className="text-lg">{fmt(grandTotal)}</span></div>
        </div>
      </section>

      {errors.general && <p className="text-red-600 text-sm">{errors.general}</p>}

      <button type="submit" disabled={submitting || items.length === 0}
        className="w-full py-3 rounded-xl bg-accent text-white font-bold hover:opacity-90 transition disabled:opacity-50">
        {submitting ? <span className="inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Memproses...</span> : `Bayar Sekarang · ${fmt(grandTotal)}`}
      </button>

      {/* Modal pembayaran mock */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-sm bg-surface rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">Simulasi Pembayaran</h3>
              <button onClick={() => setModal(null)} aria-label="Tutup"><X size={18} /></button>
            </div>
            {modal.method === "qris" ? (
              <div className="text-center">
                <div className="w-40 h-40 mx-auto bg-slate-900 rounded-xl flex items-center justify-center mb-3">
                  <QrCode size={90} className="text-white" />
                </div>
                <p className="text-sm text-muted">Scan QRIS ini dengan e-wallet / m-banking mana pun</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted mb-2">Nomor VA / Pembayaran Anda:</p>
                <p className="text-xl font-black tracking-wider text-foreground mb-4">{modal.va}</p>
                <p className="text-xs text-tertiary mb-4">Salin lalu bayar di aplikasi {modal.method === "va" ? "bank" : modal.method === "ewallet" ? "e-wallet" : "bank"} pilihan Anda</p>
              </div>
            )}
            <div className="flex justify-between text-xs text-tertiary mb-4"><span>Total</span><span className="font-bold text-foreground">{fmt(grandTotal)}</span></div>
            <button onClick={finishMockPayment} className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 hover:opacity-90">
              <CheckCircle2 size={16} /> Saya Sudah Bayar
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
