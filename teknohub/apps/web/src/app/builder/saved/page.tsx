import SavedBuilds from "@/components/SavedBuilds";

export const metadata = {
  title: "Build Saya — TeknoHub",
  description: "Daftar build PC yang tersimpan",
};

export default function SavedBuildsPage() {
  return (
    <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">
      <SavedBuilds />
    </main>
  );
}
