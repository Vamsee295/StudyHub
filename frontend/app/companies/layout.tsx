import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Companies — Pathward Placement Engine",
  description: "Explore verified hiring patterns, selection rounds, role requirements, and company-specific preparation sprints.",
};

export default function CompaniesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
