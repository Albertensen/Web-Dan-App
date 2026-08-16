import Navbar from "@/components/Navbar";
import SlideNav from "@/components/SlideNav";
import Footer from "@/components/Footer";

/** Layout utama (non-auth): Navbar + SlideNav + Footer di semua halaman store/forum/builder */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <SlideNav />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}