import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import AICustomerServiceWidget from "@/components/support/AICustomerServiceWidget";

// Font Latin-only (auto-subset next/font) — ukuran payload kecil, self-hosted
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tekno Zone — E-Commerce, AI Builder & Komunitas",
  description:
    "Platform teknologi all-in-one Indonesia: belanja elektronik, diskusi tech & AI, dan rakit PC dengan AI Agent.",
  keywords: ["tekno zone", "pc builder", "rakit pc", "komponen pc", "forum teknologi", "belanja elektronik"],
  openGraph: {
    title: "Tekno Zone — E-Commerce, AI Builder & Komunitas",
    description: "Belanja elektronik, diskusi tech & AI, dan rakit PC dengan AI Agent.",
    type: "website",
    url: "https://teknohub-web.vercel.app",
    siteName: "Tekno Zone",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`scroll-smooth ${inter.variable}`}>
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col">
        <Providers>
          {children}
          <AICustomerServiceWidget />
        </Providers>
      </body>
    </html>
  );
}
