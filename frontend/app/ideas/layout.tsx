import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Ideas Board — StudyHub",
  description: "Suggest features for StudyHub, upvote the ideas you want, and see what's planned and shipped.",
};

export default function IdeasLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
