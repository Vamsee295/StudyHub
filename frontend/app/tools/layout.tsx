import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools | StudyHub",
  description: "Placement preparation tools, calculators, and builders.",
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
