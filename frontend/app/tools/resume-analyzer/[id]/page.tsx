import type { Metadata } from "next";
import { ResumeAnalysisDetailPage } from "@/components/resume-analyzer/ResumeAnalysisDetailPage";

export const metadata: Metadata = {
  title: "Resume Analysis Report | StudyHub",
  description: "Detailed placement benchmark report and actionable resume feedback.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResumeAnalysisPage({ params }: PageProps) {
  const { id } = await params;
  return <ResumeAnalysisDetailPage analysisId={id} />;
}
