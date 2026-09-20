import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Practice — Pathward Placement Engine",
  description: "Build speed, problem-solving intuition, and interview confidence.",
};

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
