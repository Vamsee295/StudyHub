import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Roadmaps — StudyHub Placement Engine",
  description: "Curated role-based roadmaps for software engineering, frontend, backend, devops, and data science.",
};

export default function RoadmapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
