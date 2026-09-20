import { AppLayout } from "@/components/layout/AppLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile & Career Hub — Pathward",
  description: "Manage your academic profile, learning path, target companies, and placement readiness.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
