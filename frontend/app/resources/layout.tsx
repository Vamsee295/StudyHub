import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Resources Library — StudyHub Placement Engine",
  description: "Curated notes, cheat sheets, and interview guides mapped exactly to your placement syllabus.",
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
