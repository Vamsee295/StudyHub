import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Community — StudyHub",
  description: "Ask questions, share wins and resources, and vote up what helps other students preparing for placements.",
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
