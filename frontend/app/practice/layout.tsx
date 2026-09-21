import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Practice — StudyHub Placement Engine",
  description: "Curated coding problems, SQL queries, and technical interview questions.",
};

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
