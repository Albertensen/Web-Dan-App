import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forum Tech & AI — TeknoHub",
  description: "Diskusi hardware, AI, gaming, mobile, dan DIY",
};

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
