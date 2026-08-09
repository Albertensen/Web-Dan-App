import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AICustomerServiceWidget from "@/components/support/AICustomerServiceWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TeknoHub — E-Commerce, Forum, & PC Builder AI",
  description:
    "Platform teknologi all-in-one Indonesia: belanja elektronik, diskusi tech & AI, dan rakit PC dengan AI Agent.",
  keywords: ["teknoHub", "pc builder", "rakit pc", "komponen pc", "forum teknologi", "belanja elektronik"],
  openGraph: {
    title: "TeknoHub — E-Commerce, Forum, & PC Builder AI",
    description: "Belanja elektronik, diskusi tech & AI, dan rakit PC dengan AI Agent.",
    type: "website",
    url: "https://teknohub-omega.vercel.app",
    siteName: "TeknoHub",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.variable} bg-background text-foreground antialiased min-h-screen flex flex-col`}>
        <Navbar />
        {children}
        <AICustomerServiceWidget />
      </body>
    </html>
  );
}
