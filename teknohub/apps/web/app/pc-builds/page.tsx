export const metadata = { title: "Rakitan PC — TeknoHub" };

const builds = [
  {
    name: "Budget Gaming 4 Jt",
    parts: ["Ryzen 5 5600", "RX 6600", "16GB DDR4"],
    author: "fajar_gaming",
  },
  {
    name: "Content Creator Pro",
    parts: ["Ryzen 7 7700", "RTX 4070", "32GB DDR5"],
    author: "rina_studio",
  },
  {
    name: "Mini ITX Portable",
    parts: ["i5-13400", "RTX 4060 Ti", "16GB DDR5"],
    author: "eko_kecil",
  },
];

export default function PcBuildsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Rakitan PC</h1>
      <p className="text-slate-600 mb-8">
        Inspirasi build PC dari komunitas. Bagikan rakitan kamu juga!
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {builds.map((b) => (
          <div
            key={b.name}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold">{b.name}</h2>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              {b.parts.map((part) => (
                <li key={part} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {part}
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-400 mt-4">oleh {b.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
