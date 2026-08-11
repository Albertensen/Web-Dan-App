"use client";

import { useState } from "react";

const CATEGORIES = [
  "laptop",
  "smartphone",
  "monitor",
  "cpu",
  "gpu",
  "ram",
  "storage",
  "motherboard",
  "psu",
  "case",
  "cooler",
  "aksesoris",
];

const inputCls = "w-full p-3 border border-slate-300 rounded-lg bg-surface text-foreground focus:ring-accent/40 focus:border-accent transition duration-150";

export default function AdminProductForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("laptop");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpload = async (): Promise<string | null> => {
    if (!image) return null;
    setUploading(true);
    try {
      const ext = image.name.split(".").pop() ?? "png";
      const path = `products/${Date.now()}-${slug || "product"}.${ext}`;
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, contentType: image.type }),
      });
      const { signedUrl, publicUrl } = await res.json();

      // Upload langsung ke Signed URL
      const up = await fetch(signedUrl, { method: "PUT", body: image });
      if (!up.ok) throw new Error("upload gagal");
      return publicUrl;
    } catch {
      setError("Gagal upload gambar");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const imageUrl = await handleUpload();

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug: finalSlug,
        category,
        brand,
        price: Number(price),
        stock: Number(stock),
        description,
        image_url: imageUrl,
      }),
    });

    if (res.ok) {
      setSuccess("Produk berhasil ditambahkan!");
      setName(""); setSlug(""); setBrand(""); setPrice(""); setStock("0"); setDescription(""); setImage(null);
      window.location.reload();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Gagal menambahkan produk");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-muted mb-1">Nama Produk</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} placeholder="RTX 5090 Gaming OC" />
      </div>
      <div>
        <label className="block text-sm font-medium text-muted mb-1">Slug (kosongkan = auto)</label>
        <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputCls} placeholder="rtx-5090-gaming-oc" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Kategori</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Brand</label>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} className={inputCls} placeholder="ASUS" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Harga (IDR)</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" required className={inputCls} placeholder="15000000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Stok</label>
          <input value={stock} onChange={(e) => setStock(e.target.value)} type="number" className={inputCls} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-muted mb-1">Deskripsi</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} />
      </div>
      <div>
        <label className="block text-sm font-medium text-muted mb-1">Gambar Produk</label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-tertiary file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-surface-2 file:text-foreground hover:file:bg-surface-2"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-green-400 text-sm">{success}</p>}

      <button
        type="submit"
        disabled={uploading}
        className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Tambah Produk"}
      </button>
    </form>
  );
}
