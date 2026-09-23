import type { Metadata } from "next";
import { ResumeAnalyzerPage } from "@/components/resume-analyzer/ResumeAnalyzerPage";

export const metadata: Metadata = {
  title: "Resume Analyzer | StudyHub",
  description: "Analyze a resume against a target company and role with a secure, structured placement review.",
};

export default function ResumeAnalyzerRoutePage() {
  return <ResumeAnalyzerPage />;
}
