"use client"
import { useState } from "react"

interface CategoryOption {
  slug: string
  name: string
}

interface NewThreadFormProps {
  categories: CategoryOption[]
}

export default function NewThreadForm({ categories }: NewThreadFormProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState(categories[0]?.slug ?? "")
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError("")

    if (title.trim().length < 5) {
      setError("Judul minimal 5 karakter")
      return
    }
    if (content.trim().length < 10) {
      setError("Konten minimal 10 karakter")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/forum/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, category_slug: category, content }),
      })

      if (!res.ok) {
        throw new Error("Gagal membuat thread")
      }
      window.location.href = "/forum"
    } catch {
      setError("Gagal membuat thread. Pastikan sudah login.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-8 bg-[#1a1a20] rounded-xl shadow-2xl border border-slate-700">
      {error && <p className="text-red-400 text-sm p-3 bg-red-900/30 rounded-lg">{error}</p>}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Judul Thread</label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Rekomendasi GPU budget 3 juta"
          className="w-full p-3 border border-slate-600 rounded-lg bg-[#1a1a20] text-slate-200 focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-slate-500"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Kategori</label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border border-slate-600 rounded-lg bg-[#1a1a20] text-slate-200 focus:ring-blue-500 focus:border-blue-500 transition duration-150 appearance-none cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-1">Konten</label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          placeholder="Tulis detail pertanyaan atau topik diskusi..."
          className="w-full p-3 border border-slate-600 rounded-lg bg-[#1a1a20] text-slate-200 focus:ring-blue-500 focus:border-blue-500 transition duration-150 resize-none placeholder-slate-500"
          required
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-blue-500/30"
      >
        {submitting ? "Membuat..." : "Buat Thread"}
      </button>
    </form>
  )
}