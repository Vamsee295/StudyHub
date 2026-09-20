import { AppLayout } from "@/components/layout/AppLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates — Pathward Placement Engine",
  description: "Curated templates for resumes, cover letters, and outreach.",
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
