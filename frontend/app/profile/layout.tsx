import { AppLayout } from "@/components/layout/AppLayout";
import { ActivitySidebar } from "@/components/profile/ActivitySidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile — StudyHub",
  description: "Manage your placement profile, target companies, skills, and resume details.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      {/* every profile page keeps its own content on the left and the activity sidebar on the right */}
      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">{children}</div>
        <ActivitySidebar />
      </div>
    </AppLayout>
  );
}
