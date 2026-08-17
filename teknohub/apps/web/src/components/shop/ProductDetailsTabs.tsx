"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Star, MessageSquare, ShieldCheck, Truck, Award, PlusCircle, KeyRound, Zap, Download, RefreshCw } from "lucide-react";
import ProductReviews from "@/components/ProductReviews";
import RelatedForumThreads from "@/components/forum/RelatedForumThreads";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  brand: string | null;
  price: number;
  stock: number;
  is_digital?: boolean;
  license_type?: string | null;
  digital_instructions?: string | null;
  download_url?: string | null;
}

export default function ProductDetailsTabs({ product }: { product: ProductData }) {
  const [activeTab, setActiveTab] = useState<"desc" | "reviews" | "forum">("desc");
  const isDigital = Boolean(product.is_digital);

  const specRows = isDigital
    ? [
        { label: "Nama Produk", val: product.name },
        { label: "Penerbit / Brand", val: product.brand || "TeknoHub Official" },
        { label: "Kategori Produk", val: product.category.toUpperCase() },
        { label: "Tipe Lisensi", val: product.license_type || "Digital License Key" },
        { label: "Metode Pengiriman", val: "Instan 0 Detik (Otomatis ke Invoice & Akun)" },
        { label: "Status Stok", val: product.stock > 0 ? `Tersedia (${product.stock} lisensi)` : "Habis" },
      ]
    : [
        { label: "Nama Produk", val: product.name },
        { label: "Brand / Manufaktur", val: product.brand || "TeknoHub Official" },
        { label: "Kategori Hardware", val: product.category.toUpperCase() },
        { label: "Kondisi", val: "Baru (100% Original Segel)" },
        { label: "Garansi", val: "Garansi Resmi Distributor 1 - 3 Tahun" },
        { label: "Status Stok", val: product.stock > 0 ? `Ready Stock (${product.stock} unit)` : "Pre-Order / Habis" },
      ];

  return (
    <div className="w-full mt-10">
      {/* Header Navigasi Tab */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("desc")}
          className={`pb-3.5 px-3 text-sm sm:text-base font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "desc"
              ? "border-accent text-accent"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <FileText size={18} /> Deskripsi &amp; Spesifikasi
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`pb-3.5 px-3 text-sm sm:text-base font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "reviews"
              ? "border-accent text-accent"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <Star size={18} /> Ulasan &amp; Rating
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("forum")}
          className={`pb-3.5 px-3 text-sm sm:text-base font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "forum"
              ? "border-accent text-accent"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <MessageSquare size={18} /> Diskusi Forum Komunitas
        </button>
      </div>

      {/* Konten Tab */}
      <div className="py-6">
        {/* TAB 1: DESKRIPSI & SPESIFIKASI */}
        {activeTab === "desc" && (
          <div className="space-y-8">
            <div className="bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-foreground">Deskripsi Produk</h3>
              <p className="text-tertiary leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {product.description || "Belum ada deskripsi lengkap untuk produk ini."}
              </p>
            </div>

            {/* Seksi Khusus Digital: Panduan Aktivasi & Syarat Lisensi */}
            {isDigital && (
              <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/10 border border-cyan-500/30 dark:border-cyan-500/20 rounded-2xl p-6 space-y-3">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <KeyRound size={20} className="text-cyan-500" /> 🔑 Panduan Aktivasi &amp; Syarat Lisensi
                </h3>
                <p className="text-tertiary text-sm leading-relaxed whitespace-pre-line">
                  {product.digital_instructions || "Kode lisensi akan aktif seketika setelah pembayaran. Masukkan kode pada aplikasi resmi terkait."}
                </p>
                {product.download_url && (
                  <div className="pt-2">
                    <a
                      href={product.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition shadow-sm"
                    >
                      <Download size={14} /> Unduh Installer / Berkas Panduan
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Tabel Spesifikasi */}
            <div className="bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                {isDigital ? "Informasi Lisensi & Detail" : "Spesifikasi Teknis"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {specRows.map((row, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/80 text-sm">
                    <span className="text-tertiary font-medium">{row.label}</span>
                    <span className="text-foreground font-semibold text-right">{row.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Trust Badges (Digital vs Fisik) */}
            {isDigital ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-slate-200 dark:border-slate-800">
                  <ShieldCheck size={24} className="text-cyan-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-foreground">100% Lisensi Asli &amp; Resmi</p>
                    <p className="text-[11px] text-tertiary">Terhubung langsung ke server penerbit</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-slate-200 dark:border-slate-800">
                  <RefreshCw size={24} className="text-cyan-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Garansi Aktivasi Berhasil</p>
                    <p className="text-[11px] text-tertiary">Garansi tukar key baru / uang kembali</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-slate-200 dark:border-slate-800">
                  <Zap size={24} className="text-cyan-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Pengiriman Otomatis 0 Detik</p>
                    <p className="text-[11px] text-tertiary">Seketika aktif tanpa menunggu ekspedisi</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-slate-200 dark:border-slate-800">
                  <ShieldCheck size={24} className="text-accent shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-foreground">100% Produk Original</p>
                    <p className="text-[11px] text-tertiary">Jaminan uang kembali jika barang tiruan</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-slate-200 dark:border-slate-800">
                  <Award size={24} className="text-accent shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Garansi Resmi Brand</p>
                    <p className="text-[11px] text-tertiary">Klaim garansi mudah via service center</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-slate-200 dark:border-slate-800">
                  <Truck size={24} className="text-accent shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Pengemasan Ekstra Aman</p>
                    <p className="text-[11px] text-tertiary">Free Bubble wrap tebal + kardus proteksi</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ULASAN & REVIEW */}
        {activeTab === "reviews" && (
          <div className="bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <ProductReviews productId={product.id} />
          </div>
        )}

        {/* TAB 3: FORUM KOMUNITAS */}
        {activeTab === "forum" && (
          <div className="bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-foreground">Tanya &amp; Diskusi {isDigital ? "Software &amp; Lisensi" : "Hardware"}</h3>
                <p className="text-xs text-tertiary mt-0.5">
                  Diskusikan performa, fitur, atau masalah aktivasi bersama komunitas TeknoHub.
                </p>
              </div>
              <Link
                href={`/forum/new?title=${encodeURIComponent(`[Tanya Produk] ${product.name}`)}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent-secondary transition shadow-sm shrink-0"
              >
                <PlusCircle size={15} /> Buat Thread Diskusi
              </Link>
            </div>

            <RelatedForumThreads productName={product.name} brand={product.brand ?? ""} category={product.category} />
          </div>
        )}
      </div>
    </div>
  );
}
