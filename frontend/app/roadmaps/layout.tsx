import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Roadmaps — Pathward Placement Engine",
  description:
    "Follow a structured placement roadmap from fundamentals to technical and HR interviews.",
};

export default function RoadmapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
