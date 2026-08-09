import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AICustomerServiceWidget from "@/components/support/AICustomerServiceWidget";

export const metadata: Metadata = {
  title: "Tekno Zone — E-Commerce, AI Builder & Komunitas",
  description:
    "Platform teknologi all-in-one Indonesia: belanja elektronik, diskusi tech & AI, dan rakit PC dengan AI Agent.",
  keywords: ["tekno zone", "pc builder", "rakit pc", "komponen pc", "forum teknologi", "belanja elektronik"],
  openGraph: {
    title: "Tekno Zone — E-Commerce, AI Builder & Komunitas",
    description: "Belanja elektronik, diskusi tech & AI, dan rakit PC dengan AI Agent.",
    type: "website",
    url: "https://teknohub-omega.vercel.app",
    siteName: "Tekno Zone",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col">
        <Navbar />
        {children}
        <AICustomerServiceWidget />
      </body>
    </html>
  );
}
