import PcBuilder from "@/components/PcBuilder";
import PCBuilderChatInterface from "@/components/builder/PCBuilderChatInterface";

export const metadata = {
  title: "PC Builder AI — TeknoHub",
  description: "Rakit PC impianmu dengan AI Agent. Masukkan kebutuhan & budget, dapatkan rekomendasi build optimal dengan visual 3D interaktif.",
};

export default function BuilderPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Wizard + AI Chat */}
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
