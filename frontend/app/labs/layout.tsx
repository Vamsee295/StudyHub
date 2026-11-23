import React from "react";
import { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Labs | StudyHub",
  description: "Interactive simulators for DSA, operating systems, networks and system design.",
};

export default function LabsLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
