import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeknoHub — E-Commerce, Forum, & PC Builder AI",
  description:
    "Platform teknologi all-in-one Indonesia: belanja elektronik, diskusi tech & AI, dan rakit PC dengan AI Agent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="bg-[#0a0a0f] text-slate-200 antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
