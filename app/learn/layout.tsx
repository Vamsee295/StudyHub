import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Learn — Pathward Placement Engine",
  description: "Learn and prepare for your placement journey through structured modules.",
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
