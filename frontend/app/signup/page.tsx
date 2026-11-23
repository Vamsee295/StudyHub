import { redirect } from "next/navigation";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = new URLSearchParams();
  search.set("mode", "signup");

  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (key !== "mode" && typeof val === "string") {
        search.set(key, val);
      }
    });
  }

  redirect(`/login?${search.toString()}`);
}
