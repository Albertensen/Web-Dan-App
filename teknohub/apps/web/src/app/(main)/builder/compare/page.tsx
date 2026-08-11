import BuildCompare from "@/components/BuildCompare";

export const metadata = {
  title: "Bandingkan Build — TeknoHub",
  description: "Bandingkan 2-3 rekomendasi build PC secara side-by-side",
};

export default function ComparePage() {
  return (
    <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-2">Bandingkan Build</h1>
      <p className="text-tertiary mb-8">Rekomendasi AI untuk gaming, productivity, dan content creator — berdampingan.</p>
      <BuildCompare />
    </main>
  );
}
