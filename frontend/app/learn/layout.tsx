import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Learn — StudyHub Placement Engine",
  description: "Comprehensive syllabus, notes, diagrams, and code examples for your tech career preparation.",
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
