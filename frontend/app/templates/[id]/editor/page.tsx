import { redirect } from "next/navigation";

// The template editor now lives at /templates/[id]; keep old links working.
export default async function OldEditorRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/templates/${id}`);
}
