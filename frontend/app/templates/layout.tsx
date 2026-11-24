import { AppLayout } from "@/components/layout/AppLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates — StudyHub",
  description: "Verified engineering resume templates, cold email scripts, and preparation rubrics.",
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
