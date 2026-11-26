import { redirect } from "next/navigation";

// The SQL playground was a second SQL editor with its own schema. Lessons use the SQL Lab's
// employees and departments tables, so old links go there instead.
export default function SqlPlaygroundRedirect() {
  redirect("/practice/sql");
}
