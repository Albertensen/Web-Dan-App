export const metadata = { title: "Forum — TeknoHub" };

const threads = [
  { title: "Rekomendasi GPU di bawah 5 juta?", replies: 42, author: "dika_kun" },
  { title: "Pengalaman pindah ke Linux untuk daily driver", replies: 87, author: "budi.dev" },
  { title: "Monitor 144Hz vs 4K — mana yang lebih worth?", replies: 25, author: "siti_rara" },
  { title: "Troubleshoot PC nyala tapi layar gelap", replies: 63, author: "andi_pe" },
];

export default function ForumPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Forum Diskusi</h1>
          <p className="text-slate-600 mt-1">
            {threads.length} topik hangat dibicarakan
          </p>
        </div>
        <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
          + Buat Thread
        </button>
      </div>
      <div className="divide-y divide-slate-200 bg-white rounded-xl shadow-sm border border-slate-200">
        {threads.map((t) => (
          <div
            key={t.title}
            className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div>
              <h2 className="font-semibold hover:text-primary cursor-pointer">
                {t.title}
              </h2>
              <p className="text-sm text-slate-500 mt-1">oleh {t.author}</p>
            </div>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {t.replies} balasan
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
