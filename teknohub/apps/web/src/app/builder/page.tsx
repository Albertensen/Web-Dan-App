import PcBuilder from "@/components/PcBuilder";
import PCBuilderChatInterface from "@/components/builder/PCBuilderChatInterface";

export const metadata = {
  title: "PC Builder AI — TeknoHub",
  description: "Rakit PC impianmu dengan AI Agent. Masukkan kebutuhan & budget, dapatkan rekomendasi build optimal.",
};

export default function BuilderPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">PC Builder AI</h1>
        <p className="text-slate-400">
          Masukkan kebutuhan dan budget — AI akan merakit PC optimal untukmu, lengkap dengan analisis bottleneck & kompatibilitas.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <PcBuilder />
        </div>
        <div className="lg:sticky lg:top-24 self-start">
          <PCBuilderChatInterface />
        </div>
      </div>
    </div>
  );
}
