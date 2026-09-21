import { AppLayout } from "@/components/layout/AppLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Feedback — StudyHub",
  description: "Placement preparation support, frequently asked questions, problem reports, and student assistance.",
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
