import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Study With Me — StudyHub Placement Engine",
  description: "See what students are learning, solving, and building today on StudyHub's community learning feed.",
};

export default function StudyWithMeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
