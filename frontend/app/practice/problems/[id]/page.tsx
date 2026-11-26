"use client";

import { useParams } from "next/navigation";
import { ProblemWorkspace } from "@/components/practice/ProblemWorkspace";

export default function ProblemPage() {
  const params = useParams();
  const id = String(params?.id || "1");
  // key: a fresh workspace per problem (tabs, draft and result); draftKey: your code survives reloads
  return <ProblemWorkspace key={id} problemId={id} draftKey={`studyhub:draft:${id}`} />;
}
